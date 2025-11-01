import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../AppStack/HomeScreen/HomeScreen';

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};
