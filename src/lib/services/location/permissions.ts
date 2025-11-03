import {
  check,
  checkNotifications,
  PERMISSIONS,
  request,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import { showSettingsAlert } from '@helpers/alerts';
import { Platform } from 'react-native';
import {
  ALERT_BACKGROUND_LOCATION_DESC,
  ALERT_BACKGROUND_LOCATION_TITLE,
  ALERT_LOCATION_DESC,
  ALERT_LOCATION_TITLE,
  ALERT_NOTIFICATION_DESC,
  ALERT_NOTIFICATION_TITLE,
} from './consts';

export const checkLocationPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
      return status === RESULTS.GRANTED;
    } else if (Platform.OS === 'android') {
      const fineStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (fineStatus !== RESULTS.GRANTED) {
        return false;
      }

      // Only check background on Android 11+ (API 30+)
      if (Platform.Version < 30) {
        return true; // Background not supported, but foreground is enough
      }

      const backgroundStatus = await check(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      return backgroundStatus === RESULTS.GRANTED;
    }

    return false;
  } catch (error) {
    console.warn('Failed to check location permissions:', error);
    return false;
  }
};

export const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      // Request "When In Use"
      const whenInUseResult = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      if (whenInUseResult !== RESULTS.GRANTED) {
        if (
          whenInUseResult === RESULTS.BLOCKED ||
          whenInUseResult === RESULTS.DENIED
        ) {
          showSettingsAlert(ALERT_LOCATION_TITLE, ALERT_LOCATION_DESC);
        }
        return false;
      }

      // Request "Always" (only possible after "When In Use" is granted)
      const alwaysResult = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      if (alwaysResult !== RESULTS.GRANTED) {
        showSettingsAlert(
          ALERT_BACKGROUND_LOCATION_TITLE,
          ALERT_BACKGROUND_LOCATION_DESC,
        );
        return false;
      }

      return true;
    } else if (Platform.OS === 'android') {
      const fineResult = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      if (fineResult !== RESULTS.GRANTED) {
        if (fineResult === RESULTS.BLOCKED) {
          showSettingsAlert(ALERT_LOCATION_TITLE, ALERT_LOCATION_DESC);
        }
        return false;
      }

      const backgroundCheck = await check(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      if (backgroundCheck === RESULTS.GRANTED) {
        return true;
      }

      const backgroundResult = await request(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      if (backgroundResult !== RESULTS.GRANTED) {
        showSettingsAlert(
          ALERT_BACKGROUND_LOCATION_TITLE,
          ALERT_BACKGROUND_LOCATION_DESC,
        );
        return false;
      }

      return true;
    }

    return false;
  } catch (error) {
    console.warn('Permission request failed:', error);
    return false;
  }
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await requestNotifications(['alert', 'sound', 'badge']);

    if (status === RESULTS.GRANTED) {
      return true;
    }

    if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
      showSettingsAlert(ALERT_NOTIFICATION_TITLE, ALERT_NOTIFICATION_DESC);
    }

    return false;
  } catch (error) {
    console.warn('Notification permission request failed:', error);
    return false;
  }
};

export const checkNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await checkNotifications();
    return status === RESULTS.GRANTED;
  } catch (error) {
    console.warn('Failed to check notification permissions:', error);
    return false;
  }
};
