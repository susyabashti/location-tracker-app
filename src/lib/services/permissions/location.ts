import { Alert, Linking } from 'react-native';
import { check, request, type Permission } from 'react-native-permissions';

export const checkPermissions = async (perms: Permission[]) => {
  const permissions = await Promise.all(perms.map(perm => check(perm)));
  return permissions.every(val => val === 'granted');
};

export const requestPermissions = async (perms: Permission[]) => {
  const results = await Promise.all(perms.map(perm => request(perm)));

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    if (res === 'granted') continue;

    if (res === 'blocked') {
      showSettingsAlert('Access is needed for this app.');
      return false;
    }

    // One of the permissions wasn't fully granted.
    return false;
  }

  return true;
};

const showSettingsAlert = (message: string) => {
  Alert.alert(
    'Permission Required',
    `${message}\n\nOpen Settings to enable?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
    { cancelable: true },
  );
};
