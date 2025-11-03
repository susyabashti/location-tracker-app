import { Alert } from 'react-native';
import { openSettings } from 'react-native-permissions';

export const showSettingsAlert = (
  title: string,
  message: string,
  onOpenSettings?: () => void,
) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: async () => {
          await openSettings();
          onOpenSettings?.();
        },
      },
    ],
    { cancelable: true },
  );
};
