import { EventType } from '@notifee/react-native';
import type { NotificationListener } from '../notifications/types';
import { STATIONARY_NOTIFICATION_SETTINGS } from './consts';
import { stopLocationTracking } from './location';

export const stationaryNotificationListener: NotificationListener = {
  id: STATIONARY_NOTIFICATION_SETTINGS.id,
  event: EventType.PRESS,
  action: stopLocationTracking,
};
