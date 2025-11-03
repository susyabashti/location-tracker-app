import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { RootStack } from './screens/RootStack/RootStack';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from './lib/theme/theme';
import { Appearance, Platform, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import React from 'react';
import { settingsStore, useSettingsStore } from './lib/storage/settings';
import { locationStore } from './lib/storage/location';
import { requestLocationPermission } from './lib/services/location/permissions';
import { requestNotificationPermissions } from './lib/services/notifications/permissions';
import {
  startLocationTracking,
  stopLocationTracking,
} from './lib/services/location/location';

// our ui library gives us a warning, for this matter we will ignore it.
configureReanimatedLogger({ strict: false });

export const App = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const settings = useSettingsStore.use.settings();
  const [isAppReady, setAppReady] = React.useState(false);

  React.useEffect(() => {
    const initApp = async () => {
      try {
        await settingsStore.persist.rehydrate();
        await locationStore.persist.rehydrate();
        await requestLocationPermission();
        await requestNotificationPermissions();
      } catch (err) {
        console.log('error requesting permissions', err);
      } finally {
        setAppReady(true);
      }
    };

    initApp();
  }, [setAppReady]);

  React.useEffect(() => {
    if (!isAppReady) return;

    setColorScheme(settings.theme);
  }, [isAppReady, settings.theme, setColorScheme]);

  React.useEffect(() => {
    if (!isAppReady) return;

    if (!settings.trackingEnabled) {
      stopLocationTracking();
      return;
    }

    startLocationTracking();

    return () => {
      stopLocationTracking();
    };
  }, [isAppReady, settings.trackingEnabled, settings.interval]);

  if (!isAppReady) return null;

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[colorScheme || 'light']}>
          <StatusBar
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          />
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
