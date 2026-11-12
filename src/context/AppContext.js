import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { alerts } from '../data/alerts';
import { manualPlaces } from '../data/places';
import { seedNotifications } from '../data/notifications';
import { defaultFavorites, defaultNotificationPrefs, defaultProfile } from '../data/userDefaults';
import { readDeviceLocation } from '../services/locationService';
import { presentLocalPreview } from '../services/notificationService';

const STORAGE_KEY = 'coastsafe.demo.v1';
const AppContext = createContext(null);

const initialState = {
  onboardingComplete: false,
  permissionsSeen: false,
  favorites: defaultFavorites,
  profile: defaultProfile,
  notificationPrefs: defaultNotificationPrefs,
  notifications: seedNotifications,
  placeId: 'panaji',
  locationSource: 'simulated',
  deviceLocation: null,
  compareIds: ['palolem', 'radhanagar'],
  locationMessage: 'Distances use a simulated place until you choose otherwise.',
  notificationPermission: 'undetermined',
};

export function AppProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active) return;
        if (raw) {
          const saved = JSON.parse(raw);
          setState((current) => ({ ...current, ...saved, profile: { ...current.profile, ...saved.profile }, notificationPrefs: { ...current.notificationPrefs, ...saved.notificationPrefs } }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const update = useCallback((patch) => {
    setState((current) => ({ ...current, ...patch }));
  }, []);

  const origin = useMemo(() => {
    if (state.locationSource === 'device' && state.deviceLocation) return state.deviceLocation;
    return manualPlaces.find((place) => place.id === state.placeId) || manualPlaces[0];
  }, [state.locationSource, state.deviceLocation, state.placeId]);

  const locationLabel = state.locationSource === 'device' && state.deviceLocation
    ? 'This device'
    : `${origin.name}, ${origin.state}`;

  const value = useMemo(() => {
    const toggleFavorite = (beachId) => {
      setState((current) => {
        const exists = current.favorites.includes(beachId);
        return {
          ...current,
          favorites: exists ? current.favorites.filter((id) => id !== beachId) : [beachId, ...current.favorites],
        };
      });
    };

    const toggleActivity = (activityId) => {
      setState((current) => {
        const exists = current.profile.activities.includes(activityId);
        const activities = exists
          ? current.profile.activities.filter((id) => id !== activityId)
          : [...current.profile.activities, activityId];
        return { ...current, profile: { ...current.profile, activities } };
      });
    };

    const toggleCompare = (beachId) => {
      setState((current) => {
        if (current.compareIds.includes(beachId)) {
          return { ...current, compareIds: current.compareIds.filter((id) => id !== beachId) };
        }
        if (current.compareIds.length >= 3) return { ...current, compareMessage: 'Compare up to 3 beaches. Remove one to add another.' };
        return { ...current, compareIds: [...current.compareIds, beachId], compareMessage: '' };
      });
    };

    const setNotificationPref = (key, enabled) => {
      setState((current) => ({
        ...current,
        notificationPrefs: { ...current.notificationPrefs, [key]: enabled },
      }));
    };

    const addNotification = async (entry) => {
      const item = {
        id: `note-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
        alertId: null,
        beachId: null,
        ...entry,
      };
      setState((current) => ({ ...current, notifications: [item, ...current.notifications] }));
      if (state.notificationPrefs.enabled && state.notificationPermission === 'granted') {
        await presentLocalPreview({ title: item.title, body: item.body });
      }
      return item;
    };

    return {
      ...state,
      hydrated,
      origin,
      locationLabel,
      toggleFavorite,
      isFavorite: (beachId) => state.favorites.includes(beachId),
      toggleActivity,
      setProfile: (patch) => setState((current) => ({ ...current, profile: { ...current.profile, ...patch } })),
      signInDemo: () => setState((current) => ({ ...current, profile: { ...defaultProfile, language: current.profile.language, activities: current.profile.activities } })),
      signOutDemo: () => setState((current) => ({ ...current, profile: { ...current.profile, signedIn: false, name: 'Guest', email: 'Not signed in' } })),
      setLanguage: (language) => setState((current) => ({ ...current, profile: { ...current.profile, language } })),
      setNotificationPref,
      markNotificationRead: (id) => setState((current) => ({
        ...current,
        notifications: current.notifications.map((item) => (item.id === id ? { ...item, read: true } : item)),
      })),
      markAllNotificationsRead: () => setState((current) => ({
        ...current,
        notifications: current.notifications.map((item) => ({ ...item, read: true })),
      })),
      addNotification,
      toggleCompare,
      clearCompare: () => update({ compareIds: [], compareMessage: '' }),
      setPlace: (placeId) => update({ placeId, locationSource: 'simulated', locationMessage: 'Using a simulated place chosen in the app.' }),
      useDeviceLocation: async () => {
        const result = await readDeviceLocation();
        if (result.granted && result.location) {
          update({
            deviceLocation: result.location,
            locationSource: 'device',
            locationMessage: 'Distances use this device’s location. Coastal readings are still demonstration data.',
          });
        } else {
          update({ locationSource: 'simulated', locationMessage: result.message });
        }
        return result;
      },
      setNotificationPermission: (notificationPermission) => update({ notificationPermission }),
      completeOnboarding: () => update({ onboardingComplete: true }),
      completePermissions: () => update({ permissionsSeen: true, onboardingComplete: true }),
      resetDemo: async () => {
        setState({ ...initialState, onboardingComplete: true, permissionsSeen: true });
        await AsyncStorage.removeItem(STORAGE_KEY);
      },
      nearbyAlertCount: (beachIds) => alerts.filter((alert) => alert.beachIds.some((id) => beachIds.includes(id))).length,
    };
  }, [state, hydrated, origin, locationLabel, update]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
