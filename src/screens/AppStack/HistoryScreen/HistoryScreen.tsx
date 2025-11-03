import React from 'react';
import { useLocationStore } from '@/lib/services/location/storage';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwipeableLocationItem } from './components/SwipeableLocationItem';
import { useNavigation } from '@react-navigation/native';

export const HistoryScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const locations = useLocationStore.use.locations();

  const handleEditPress = async (
    id: string,
    latitude: number,
    longitude: number,
  ) => {
    navigation.navigate('EditModal', { id, latitude, longitude });
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 16 }}
    >
      <FlashList
        data={locations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SwipeableLocationItem
            id={item.id}
            latitude={item.latitude}
            longitude={item.longitude}
            timestamp={item.timestamp}
            onEdit={() =>
              handleEditPress(item.id, item.latitude, item.longitude)
            }
          />
        )}
      />
    </View>
  );
};
