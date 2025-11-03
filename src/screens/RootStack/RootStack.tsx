import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStack } from '../AppStack/AppStack';
import React from 'react';
import { EditModalScreen } from '../EditModalScreen/EditModalScreen';
import type { RootStackParamList } from '@/lib/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
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
