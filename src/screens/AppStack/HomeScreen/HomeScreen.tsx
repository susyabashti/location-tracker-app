import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/Icon';
import { useSettingsStore } from '@/lib/storage/settings';

export const HomeScreen = () => {
  const settings = useSettingsStore.use.settings();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <View className="gap-4 items-center">
        <View className={settings.trackingEnabled ? 'animate-pulse' : ''}>
          <Icon
            name="Navigation"
            size={48}
            color={settings.trackingEnabled ? '#ef4444' : 'gray'}
          />
        </View>
        <Text>
          {settings.trackingEnabled
            ? 'Actively tracking your location'
            : 'Tracking is off'}
        </Text>
      </View>
    </View>
  );
};
