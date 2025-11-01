import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocationScreen } from './LocationScreen/LocationScreen';

const Stack = createNativeStackNavigator();

export const PermissionsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Location" component={LocationScreen} />
    </Stack.Navigator>
  );
};
