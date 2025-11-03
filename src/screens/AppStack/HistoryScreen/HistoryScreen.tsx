import React from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwipeableLocationItem } from './components/SwipeableLocationItem';
import { useNavigation } from '@react-navigation/native';
import { SwipeableListProvider } from './components/SwipeableListProvider';
import { useLocationStore } from '@/lib/storage/location';

export const HistoryScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const locations = useLocationStore.use.locations();
  const deleteLocation = useLocationStore.use.deleteLocation();

  const handleEdit = async (
    id: string,
    latitude: number,
    longitude: number,
  ) => {
    navigation.navigate('EditModal', { id, latitude, longitude });
  };

  const handleDelete = async (id: string) => {
    deleteLocation(id);
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 16 }}
    >
      <SwipeableListProvider>
        <FlashList
          data={locations}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SwipeableLocationItem
              id={item.id}
              latitude={item.latitude}
              longitude={item.longitude}
              timestamp={item.timestamp}
              onEdit={() => handleEdit(item.id, item.latitude, item.longitude)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      </SwipeableListProvider>
    </View>
  );
};
