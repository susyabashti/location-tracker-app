import { View } from 'react-native';

export const SettingsGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-4 gap-4">
      {children}
    </View>
  );
};
