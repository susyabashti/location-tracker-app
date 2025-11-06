import React from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwipeableLocationItem } from './components/SwipeableLocationItem';
import { useNavigation } from '@react-navigation/native';
import { SwipeableListProvider } from './components/SwipeableListProvider';
import { useLocationStore } from '@/lib/storage/location';
import { Text } from '@/components/ui/text';
import { useLocationPagination } from '@/lib/hooks/useLocationPagination';

const LIMIT = 100;

export const HistoryScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    loadMore,
    updateById,
    deleteById,
    itemsCount,
    locations,
    totalCount,
  } = useLocationPagination({ perPage: LIMIT });
  const deleteLocation = useLocationStore.use.deleteLocation();

  const handleEdit = async (
    id: string,
    latitude: number,
    longitude: number,
  ) => {
    navigation.navigate('EditModal', {
      id,
      latitude,
      longitude,
      onSave: (long, lat) => {
        updateById(id, { longitude: long, latitude: lat });
      },
    });
  };

  const handleDelete = async (id: string) => {
    deleteLocation(id);
    deleteById(id);
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 16 }}
    >
      {itemsCount > 0 ? (
        <SwipeableListProvider>
          <FlashList
            data={locations}
            keyExtractor={item => item.id}
            maintainVisibleContentPosition={{
              autoscrollToTopThreshold: 0.2,
              startRenderingFromBottom: false,
            }}
            removeClippedSubviews={true}
            onEndReached={loadMore}
            onEndReachedThreshold={0.6}
            renderItem={({ item }) => (
              <SwipeableLocationItem
                id={item.id}
                latitude={item.latitude}
                longitude={item.longitude}
                timestamp={item.timestamp}
                onEdit={() =>
                  handleEdit(item.id, item.latitude, item.longitude)
                }
                onDelete={() => handleDelete(item.id)}
              />
            )}
          />
          <View className="absolute bottom-2 right-4 bg-primary rounded-full px-3 py-1 z-10">
            <Text className="text-white text-sm font-medium">
              {itemsCount} / {totalCount}
            </Text>
          </View>
        </SwipeableListProvider>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>No locations were recorded yet.</Text>
        </View>
      )}
    </View>
  );
};
