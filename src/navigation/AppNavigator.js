// src/navigation/AppNavigator.js
// ---------------------------------------------------------
// Sets up all navigation for CoastSafe India.
//
// We use two navigators from React Navigation:
//
//  1. createBottomTabNavigator  — the 4 icons at the bottom
//     Tabs: Home | Beaches | Alerts | Profile
//
//  2. createNativeStackNavigator — a stack on top of the tabs
//     This lets us push new full screens (like BeachDetail)
//     on top of the tabs without replacing them.
//
// Navigation flow:
//   App loads → MainTabs (bottom bar visible)
//     ↓ user taps a beach
//   BeachDetail slides in (bottom bar hidden)
//     ↓ user taps Back
//   Returns to the tab they were on
// ---------------------------------------------------------

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// ── Import all screens ─────────────────────────────────────
import HomeScreen from '../screens/HomeScreen';
import BeachesScreen from '../screens/BeachesScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BeachDetailScreen from '../screens/BeachDetailScreen';
import SavedScreen from '../screens/SavedScreen';
import AboutScreen from '../screens/AboutScreen';
import ExploreScreen from '../screens/ExploreScreen';
import MapScreen from '../screens/MapScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ── Tab icon definitions ───────────────────────────────────
// 'active' is shown when the tab is selected, 'inactive' when not.
const TAB_ICONS = {
  Home:    { active: 'home',          inactive: 'home-outline' },
  Beaches: { active: 'water',         inactive: 'water-outline' },
  Alerts:  { active: 'notifications', inactive: 'notifications-outline' },
  Saved:   { active: 'heart',         inactive: 'heart-outline' },
  Profile: { active: 'person',        inactive: 'person-outline' },
};

// ── Bottom Tab Navigator ───────────────────────────────────
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Hide the default header — we build our own in each screen
        headerShown: false,

        // Icon colour when selected vs not selected
        tabBarActiveTintColor: '#0B3A5B',
        tabBarInactiveTintColor: '#94a3b8',

        // The tab bar itself
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 62,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        // Pick the right Ionicons icon for each tab
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Beaches" component={BeachesScreen} />
      <Tab.Screen name="Alerts"  component={AlertsScreen} />
      <Tab.Screen name="Saved"   component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ── Root Stack Navigator ───────────────────────────────────
// MainTabs is the first screen (shows the bottom bar).
// BeachDetail is pushed on top when a beach card is tapped.
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs"    component={BottomTabs} />
        <Stack.Screen
          name="BeachDetail"
          component={BeachDetailScreen}
          // Slide up from the bottom for a natural mobile feel
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="About" component={AboutScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Explore" component={ExploreScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
