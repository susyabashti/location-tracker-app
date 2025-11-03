import React from 'react';
import { locationStore } from '../storage/location';
import { settingsStore } from '../storage/settings';
import { requestLocationPermission } from '../services/location/permissions';
import { requestNotificationPermissions } from '../services/notifications/permissions';

export const useAppInit = () => {
  const [isAppReady, setAppReady] = React.useState(false);

  React.useEffect(() => {
    const initApp = async () => {
      try {
        await Promise.all([
          await settingsStore.persist.rehydrate(),
          await locationStore.persist.rehydrate(),
        ]);

        await requestLocationPermission();
        await requestNotificationPermissions();
      } catch (err) {
        console.log('error during app init', err);
      } finally {
        setAppReady(true);
      }
    };

    initApp();
  }, [setAppReady]);

  return { isAppReady };
};
