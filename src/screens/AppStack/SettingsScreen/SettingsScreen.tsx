import React from 'react';
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Haptics from '@mhpdev/react-native-haptics';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { SettingsRow } from './components/SettingsRow';
import { Input } from '@/components/ui/input';
import { useDebounceCallback } from '@/lib/hooks/useDebounce';
import { useSettingsStore } from '@/lib/storage/settings';
import { MenuView } from '@react-native-menu/menu';
import { Text } from '@/components/ui/text';
import { Pressable } from 'react-native-gesture-handler';
import { useColorScheme } from 'nativewind';

const themeOptions =
  Platform.OS === 'android'
    ? [
        { id: 'light', title: 'Light' },
        { id: 'dark', title: 'Dark' },
      ]
    : [
        { id: 'light', title: 'Light' },
        { id: 'dark', title: 'Dark' },
        { id: 'system', title: 'System' },
      ];

export const SettingsScreen = () => {
  const { setColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore.use.settings();
  const updateSettings = useSettingsStore.use.updateSettings();
  const [inputValue, setInputValue] = React.useState(
    settings.interval > 0 ? settings.interval.toString() : '',
  );

  const updateSettingWithFeedback = (
    payload: Parameters<typeof updateSettings>[0],
  ) => {
    Haptics.impact('light');
    updateSettings(payload);
  };

  // Keep input in sync if external changes occur
  React.useEffect(() => {
    setInputValue(settings.interval > 0 ? settings.interval.toString() : '');
  }, [settings.interval]);

  // Debounce store update
  const debouncedUpdate = useDebounceCallback((value: number) => {
    updateSettingWithFeedback({ interval: value });
  }, 300);

  const onLocationUpdateIntervalChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');

    // Update local input immediately
    setInputValue(numeric);

    if (numeric === '') {
      debouncedUpdate(0);
      return;
    }

    const value = Math.max(8, parseInt(numeric, 10));
    if (!isNaN(value)) {
      debouncedUpdate(value);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        className="flex-1 bg-background px-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-4 gap-4">
          <SettingsRow
            icon="Navigation"
            label="Tracking Enabled"
            nativeID="enable-tracking-state"
            control={
              <Switch
                checked={settings.trackingEnabled}
                onCheckedChange={checked =>
                  updateSettingWithFeedback({ trackingEnabled: checked })
                }
                id="enable-tracking-state"
                nativeID="enable-tracking-state"
              />
            }
          />
          <Separator />
          <SettingsRow
            icon="Bell"
            label="Notifications"
            nativeID="push-notifications-state"
            control={
              <Switch
                checked={settings.pushEnabled}
                onCheckedChange={checked =>
                  updateSettingWithFeedback({ pushEnabled: checked })
                }
                id="push-notifications-state"
                nativeID="push-notifications-state"
              />
            }
          />
          <Separator />
          <SettingsRow
            icon="Activity"
            label="Tracking Frequency"
            nativeID="tracking-frequency-state"
            control={
              <Input
                keyboardType="numeric"
                id="tracking-frequency-state"
                nativeID="tracking-frequency-state"
                className="w-14 text-center"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                submitBehavior="blurAndSubmit"
                value={inputValue}
                placeholder="8"
                onChangeText={onLocationUpdateIntervalChange}
              />
            }
          />
          <Separator />
          <SettingsRow
            icon="Palette"
            label="Theme"
            nativeID="app-theme-state"
            control={
              <View>
                <MenuView
                  title="Select theme"
                  onPressAction={({ nativeEvent }) => {
                    const newTheme = nativeEvent.event as typeof settings.theme;
                    updateSettingWithFeedback({
                      theme: newTheme,
                    });
                  }}
                  actions={themeOptions}
                >
                  <Pressable>
                    <Text className="capitalize">{settings.theme}</Text>
                  </Pressable>
                </MenuView>
              </View>
            }
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
