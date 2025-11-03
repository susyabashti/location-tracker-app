import notifee, { EventType } from '@notifee/react-native';
import { stopLocationTracking } from './location';
import { settingsStore } from '@/lib/storage/settings';

notifee.onForegroundEvent(async ({ type, detail }) => {
  const { notification } = detail;
  if (notification?.id !== 'stop-tracking' || type !== EventType.PRESS) return;

  settingsStore.getState().updateSettings({ trackingEnabled: false });
  stopLocationTracking();

  await notifee.cancelNotification(notification.id);
});
