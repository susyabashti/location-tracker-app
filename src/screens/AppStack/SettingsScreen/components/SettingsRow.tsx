import { Label } from '@/components/ui/label';
import { Icon, type IconName } from '@/components/Icon';
import { View, type ViewProps } from 'react-native';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import React from 'react';
import { Pressable } from 'react-native-gesture-handler';

type SettingsRowProps = {
  icon: IconName;
  label: string;
  nativeID?: string;
  control?: React.ReactNode;
  rowProps?: ViewProps;
  onPress?: () => void;
};

export const SettingsRow = ({
  icon,
  label,
  nativeID,
  control,
  rowProps,
  onPress,
}: SettingsRowProps) => {
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onPress}>
      <View className="flex-row justify-between items-center" {...rowProps}>
        <View className="flex-row items-center gap-2">
          <Icon name={icon} size={20} color={theme.primary} />
          <Label nativeID={nativeID}>{label}</Label>
        </View>
        {control}
      </View>
    </Pressable>
  );
};
