import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStack } from '../AppStack/AppStack';
import { useLocationPermissions } from '@services/permissions/hooks';
import { PermissionsStack } from '@screens/PermissionsStack/PermissionsStack';
import { SplashScreen } from '@screens/SplashScreen/SplashScreen';

const Stack = createNativeStackNavigator();

export const RootStack = () => {
  const [hasPermissions, isLoadingPermissions] = useLocationPermissions();

  if (isLoadingPermissions) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {hasPermissions ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Permissions" component={PermissionsStack} />
      )}
    </Stack.Navigator>
  );
};
