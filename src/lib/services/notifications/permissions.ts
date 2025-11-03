import { showSettingsAlert } from '@/lib/helpers/alerts';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import { ALERT_NOTIFICATION_DESC, ALERT_NOTIFICATION_TITLE } from './consts';

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
