import { Platform } from 'react-native';

export async function readDeviceLocation() {
  if (Platform.OS === 'web') {
    return {
      granted: false,
      simulated: true,
      message: 'This browser build keeps the simulated location. Device GPS is used in the iOS and Android app.',
    };
  }
  try {
    const Location = await import('expo-location');
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      return {
        granted: false,
        simulated: true,
        message: 'Location permission was not granted. Distances stay based on the selected demonstration place.',
      };
    }
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      granted: true,
      simulated: false,
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        label: 'This device',
      },
    };
  } catch (error) {
    return {
      granted: false,
      simulated: true,
      message: error?.message || 'Device location is unavailable. The simulated place is still in use.',
    };
  }
}
