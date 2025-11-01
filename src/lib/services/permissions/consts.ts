import { Platform } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';

export const LocationPermissions =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.LOCATION_ALWAYS]
    : [
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      ];
