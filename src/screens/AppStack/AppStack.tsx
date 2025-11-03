import { HomeScreen } from './HomeScreen/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from '@/components/CustomTabBar/CustomTabBar';
import { Icon } from '@/components/Icon';
import { SettingsScreen } from './SettingsScreen/SettingsScreen';
import { HistoryScreen } from './HistoryScreen/HistoryScreen';
import type { AppTabParamList } from '@/lib/types/navigation';

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
      tabBar={CustomTabBar}
    >
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: props => <Icon name="History" {...props} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: props => <Icon name="House" {...props} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: props => <Icon name="Settings" {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};
