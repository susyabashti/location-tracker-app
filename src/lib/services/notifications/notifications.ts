import notifee, { AndroidImportance } from '@notifee/react-native';
import type { NotificationListener } from './types';

export const initializeChannels = async (
  channels: { id: string; name: string }[],
) => {
  try {
    await notifee.createChannels(channels);
  } catch (err) {
    console.error('Failed to create notification channels:', err);
  }
};

export const sendNotification = async ({
  id,
  title,
  body,
  channelId,
}: {
  id: string;
  title: string;
  body: string;
  channelId: string;
}) => {
  try {
    await notifee.displayNotification({
      id,
      title,
      body,
      android: {
        channelId: channelId,
        importance: AndroidImportance.HIGH,
        pressAction: { id: 'default' },
      },
      ios: {
        critical: true,
      },
    });

    return true;
  } catch (err) {
    console.error('Failed to display notification:', err);
  }

  return false;
};

export const setupNotificationListeners = (
  listeners: NotificationListener[],
) => {
  const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
    const { notification } = detail;
    if (!notification?.id) return;

    for (const listener of listeners) {
      const matchesId = notification.id === listener.id;
      const matchesType = !listener.event || listener.event === type;

      if (matchesId && matchesType) {
        await listener.action(notification.id, detail);
      }
    }
  });

  return unsubscribe;
};

export const cancelNotificationById = (id: string) =>
  notifee.cancelNotification(id);
