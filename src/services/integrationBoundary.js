/**
 * Future integration boundary.
 * Nothing in this file contacts a network. Screens read local demo modules.
 * Live endpoints are intentionally not declared here.
 */

export const PLANNED_INTEGRATIONS = [
  {
    id: 'api',
    name: 'Application backend',
    stack: 'Node.js and Express.js',
    status: 'Not connected',
    replaces: 'Beach catalogue, profiles, favourites and alert queries will move off the device.',
  },
  {
    id: 'db',
    name: 'Database',
    stack: 'PostgreSQL',
    status: 'Not connected',
    replaces: 'Persistent beach, user and alert records.',
  },
  {
    id: 'incois',
    name: 'INCOIS ocean information',
    stack: 'External coastal data',
    status: 'Not connected',
    replaces: 'Demonstration wave, swell, current and coastal-alert records.',
  },
  {
    id: 'openmeteo',
    name: 'Open-Meteo',
    stack: 'External weather data',
    status: 'Not connected',
    replaces: 'Demonstration weather and forecast charts.',
  },
  {
    id: 'geo',
    name: 'Device geolocation',
    stack: 'expo-location',
    status: 'Permission flow ready; prototype defaults to a simulated place',
    replaces: 'The manually selected demonstration location.',
  },
  {
    id: 'maps',
    name: 'Device maps',
    stack: 'react-native-maps (Apple Maps on iOS, Google Maps on Android)',
    status: 'Used on device without a project API key. Web uses a schematic map.',
    replaces: 'The schematic fallback where a native map is unavailable.',
  },
  {
    id: 'push',
    name: 'Push notifications',
    stack: 'Expo Notifications',
    status: 'Permission and local preview only. Push tokens are not requested.',
    replaces: 'The in-app notification centre.',
  },
  {
    id: 'engine',
    name: 'Suitability engine',
    stack: 'Replaceable rule module',
    status: 'Simulated rules in src/services/suitabilityEngine.js',
    replaces: 'A reviewed assessment model in a later phase.',
  },
];

export function liveDataStatus() {
  return {
    live: false,
    label: 'Demonstration data',
  };
}
