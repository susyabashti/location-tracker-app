import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { RootStack } from './screens/RootStack/RootStack';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from './lib/theme/theme';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import React from 'react';
import { useSettingsStore } from './lib/storage/settings';
import {
  startLocationTracking,
  stopLocationTracking,
} from './lib/services/location/location';
import { ColorSchemeProvider } from './lib/providers/ColorSchemeProvider';
import { useAppInit } from './lib/hooks/useAppInit';
import { LocationTrackingProvider } from './lib/providers/LocationTrackingProvider';
import { NotificationsProvider } from './lib/providers/NotificationsProvider';
import { STATIONARY_NOTIFICATION_CHANNEL } from './lib/services/location/consts';
import { stationaryNotificationListener } from './lib/services/location/listeners';

// our ui library gives us a warning, for this matter we will ignore it.
configureReanimatedLogger({ strict: false });

export const App = () => {
  const { colorScheme } = useColorScheme();
  const { isAppReady } = useAppInit();
  const settings = useSettingsStore.use.settings();

  if (!isAppReady) return null;

  return (
    <GestureHandlerRootView>
      <NotificationsProvider
        channels={[STATIONARY_NOTIFICATION_CHANNEL]}
        listeners={[stationaryNotificationListener]}
      >
        <LocationTrackingProvider
          enabled={settings.trackingEnabled}
          intervalSeconds={settings.interval}
          onStart={startLocationTracking}
          onStop={stopLocationTracking}
        >
          <ColorSchemeProvider scheme={settings.theme}>
            <SafeAreaProvider>
              <ThemeProvider value={NAV_THEME[colorScheme || 'light']}>
                <StatusBar
                  barStyle={
                    colorScheme === 'dark' ? 'light-content' : 'dark-content'
                  }
                />
                <NavigationContainer>
                  <RootStack />
                </NavigationContainer>
              </ThemeProvider>
            </SafeAreaProvider>
          </ColorSchemeProvider>
        </LocationTrackingProvider>
      </NotificationsProvider>
    </GestureHandlerRootView>
  );
};

export default App;
