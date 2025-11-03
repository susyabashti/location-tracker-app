import notifee, { EventType } from '@notifee/react-native';
import { stopLocationTracking } from './location';
import { locationStore } from './storage';

notifee.onForegroundEvent(async ({ type, detail }) => {
  const { notification } = detail;
  if (notification?.id !== 'stop-tracking' || type !== EventType.PRESS) return;

  locationStore.getState().updateSettings({ trackingEnabled: false });
  stopLocationTracking();

  await notifee.cancelNotification(notification.id);
});
