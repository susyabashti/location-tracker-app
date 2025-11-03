import { Label } from '@/components/ui/label';
import { Icon, type IconName } from '@/components/Icon';
import { View, ViewProps } from 'react-native';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import React from 'react';

type SettingsRowProps = {
  icon: IconName;
  label: string;
  nativeID?: string;
  control: React.ReactNode;
  rowProps?: ViewProps;
};

/**
 * Reusable row for the Settings screen.
 * Pass any component as `control` (Switch, Slider, Button, custom UI…).
 */
export const SettingsRow = ({
  icon,
  label,
  nativeID,
  control,
  rowProps,
}: SettingsRowProps) => {
  const { theme } = useAppTheme();

  return (
    <View className="flex-row justify-between items-center" {...rowProps}>
      <View className="flex-row items-center gap-2">
        <Icon name={icon} size={20} color={theme.primary} />
        <Label nativeID={nativeID}>{label}</Label>
      </View>
      {control}
    </View>
  );
};
