import { Linking, Platform } from 'react-native';

export const openInMaps = (lat: number, lon: number) => {
  const url =
    Platform.select({
      ios: `maps:0,0?q=${lat},${lon}`,
      android: `geo:0,0?q=${lat},${lon}`,
    }) ?? '';

  Linking.openURL(url);
};
