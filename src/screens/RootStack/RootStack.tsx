import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStack } from '../AppStack/AppStack';
import React from 'react';
import {
  requestLocationPermission,
  requestNotificationPermissions,
} from '@services/location/permissions';
import {
  startLocationTracking,
  stopLocationTracking,
} from '@services/location/location';
import { useLocationStore } from '@services/location/storage';
import { EditModalScreen } from '../EditModalScreen/EditModalScreen';
import type { RootStackParamList } from '@/lib/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const settings = useLocationStore.use.settings();
  const updateSettings = useLocationStore.use.updateSettings();
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        await useLocationStore.persist.rehydrate();
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
