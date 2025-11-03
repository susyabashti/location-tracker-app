import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { RootStack } from './screens/RootStack/RootStack';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from './lib/theme/theme';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const App = () => {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
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
      </GestureHandlerRootView>
    </>
  );
};

export default App;
