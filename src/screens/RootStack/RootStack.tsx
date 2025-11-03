import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStack } from '../AppStack/AppStack';
import React from 'react';
import {
  startLocationTracking,
  stopLocationTracking,
} from '@services/location/location';
import { EditModalScreen } from '../EditModalScreen/EditModalScreen';
import type { RootStackParamList } from '@/lib/types/navigation';
import { requestLocationPermission } from '@/lib/services/location/permissions';
import { requestNotificationPermissions } from '@/lib/services/notifications/permissions';
import { settingsStore, useSettingsStore } from '@/lib/storage/settings';
import { locationStore } from '@/lib/storage/location';
import { useColorScheme } from 'nativewind';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const settings = useSettingsStore.use.settings();
  const updateSettings = useSettingsStore.use.updateSettings();
  const { setColorScheme } = useColorScheme();
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        await settingsStore.persist.rehydrate();
        await locationStore.persist.rehydrate();
        await requestLocationPermission();
        await requestNotificationPermissions();
      } catch (err) {
        console.log('error requesting permissions', err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, [updateSettings]);

  React.useEffect(() => {
    setColorScheme(settings.theme);
  }, [settings.theme]);

  React.useEffect(() => {
    if (!settings.trackingEnabled) {
      stopLocationTracking();
      return;
    }

    startLocationTracking();

    return () => {
      stopLocationTracking();
    };
  }, [settings.trackingEnabled, settings.interval]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="App" component={AppStack} />
      <Stack.Screen
        name="EditModal"
        component={EditModalScreen}
        initialParams={{ id: '', latitude: 0, longitude: 0 }}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
