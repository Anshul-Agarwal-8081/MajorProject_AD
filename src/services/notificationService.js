import { Platform } from 'react-native';

export async function configureLocalNotifications() {
  if (Platform.OS === 'web') return { available: false };
  try {
    const Notifications = await import('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('coastal-alerts', {
        name: 'Coastal alerts',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
    return { available: true };
  } catch (error) {
    return { available: false, message: error?.message };
  }
}

export async function requestNotificationPermission() {
  if (Platform.OS === 'web') {
    return {
      granted: false,
      simulated: true,
      status: 'undetermined',
      message: 'System notifications are not configured in the browser preview. The in-app centre still works.',
    };
  }
  try {
    const Notifications = await import('expo-notifications');
    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    return {
      granted: status === 'granted',
      simulated: false,
      status,
      message: status === 'granted'
        ? 'Notification permission is granted on this device. Delivery of real coastal warnings is not connected.'
        : 'Notification permission was not granted. The in-app centre still stores demonstration items.',
    };
  } catch (error) {
    return {
      granted: false,
      simulated: true,
      status: 'undetermined',
      message: error?.message || 'Notification permission could not be requested.',
    };
  }
}

export async function presentLocalPreview({ title, body, demo = true }) {
  if (Platform.OS === 'web') return { presented: false };
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { demo: Boolean(demo) },
      },
      trigger: null,
    });
    return { presented: true };
  } catch {
    return { presented: false };
  }
}
