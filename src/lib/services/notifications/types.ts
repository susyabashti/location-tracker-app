import type { EventDetail, EventType } from '@notifee/react-native';

export interface NotificationListener {
  id: string;
  event?: EventType;
  action: (id: string, detail: EventDetail) => Promise<void> | void;
}

export type NotificationListenerAction = NotificationListener['action'];
