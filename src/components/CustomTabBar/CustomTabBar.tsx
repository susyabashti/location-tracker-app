import { View, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text } from '../ui/text';

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="flex-row bg-zinc-50 dark:bg-zinc-800">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icon = options.tabBarIcon?.({
          focused: isFocused,
          color: isFocused ? '#3b82f6' /* primary */ : '#9ca3af' /* gray-400 */,
          size: 24,
        });

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            className="flex-1 items-center justify-center py-3"
          >
            <View className="flex-col gap-1 items-center">
              {icon}
              <Text className="text-sm">{options.title}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
