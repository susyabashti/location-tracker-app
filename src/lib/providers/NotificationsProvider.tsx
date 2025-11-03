import React from 'react';
import {
  initializeChannels,
  setupNotificationListeners,
} from '../services/notifications/notifications';
import type { NotificationListener } from '../services/notifications/types';

export const NotificationsProvider = ({
  channels,
  listeners,
  children,
}: {
  channels: { id: string; name: string }[];
  listeners: NotificationListener[];
  children: React.ReactNode;
}) => {
  const subscribeRef = React.useRef<() => void>(null);
  React.useEffect(() => {
    const func = async () => {
      await initializeChannels(channels);
    };

    func();
  }, [channels]);

  React.useEffect(() => {
    if (subscribeRef.current) {
      subscribeRef.current();
      subscribeRef.current = null;
    }

    subscribeRef.current = setupNotificationListeners(listeners);

    return subscribeRef.current;
  }, [listeners]);

  return <>{children}</>;
};
