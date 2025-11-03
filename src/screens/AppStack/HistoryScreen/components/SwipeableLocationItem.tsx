import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Gesture,
  GestureDetector,
  Pressable,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/ui/text';
import { timeAgo } from '@/lib/helpers/time';
import { useLocationStore } from '@/lib/services/location/storage';
import { scheduleOnRN } from 'react-native-worklets';
import { Separator } from '@/components/ui/separator';
import { openInMaps } from '@/lib/helpers/maps';

const ACTION_WIDTH = 80;
const ROW_HEIGHT = 80;

type Props = {
  latitude: number;
  longitude: number;
  timestamp: number;
  id: string;
  onEdit: () => void;
};

const deleteWorklet = (
  id: string,
  height: SharedValue<number>,
  removeLocation: (id: string) => void,
) => {
  'worklet';
  height.value = withTiming(0, { duration: 250 }, finished => {
    if (finished) {
      scheduleOnRN(removeLocation, id);
    }
  });
};

export const SwipeableLocationItem = ({
  latitude,
  longitude,
  timestamp,
  id,
  onEdit,
}: Props) => {
  const translateX = useSharedValue(0);
  const height = useSharedValue(ROW_HEIGHT);
  const removeLocation = useLocationStore.use.deleteLocation();

  const confirmDelete = () => {
    Alert.alert('Delete Location', 'Are you sure you want to delete this?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteWorklet(id, height, removeLocation),
      },
    ]);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate(e => {
      // Cap the swipe distance for iOS-like feel
      translateX.value = Math.min(
        Math.max(e.translationX, -ACTION_WIDTH),
        ACTION_WIDTH,
      );
    })
    .onEnd(() => {
      const shouldOpenRight = translateX.value < -ACTION_WIDTH / 2;
      const shouldOpenLeft = translateX.value > ACTION_WIDTH / 2;

      if (shouldOpenLeft) {
        translateX.value = withSpring(ACTION_WIDTH);
      } else if (shouldOpenRight) {
        translateX.value = withSpring(-ACTION_WIDTH);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    height: height.value,
  }));

  return (
    <View>
      <View className="absolute inset-x-0 inset-y-0 flex-row justify-between overflow-hidden">
        <View className="bg-[#3b82f6] left-0" style={styles.actionContainer}>
          <Pressable
            onPress={() => {
              onEdit();
            }}
            style={styles.actionButton}
          >
            <Icon name="Pen" color="white" size={22} />
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
        </View>
        <View className="bg-[#ef4444] right-0" style={styles.actionContainer}>
          <Pressable onPress={confirmDelete} style={styles.actionButton}>
            <Icon name="Trash2" color="white" size={22} />
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
        </View>
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View
          className="flex-1 bg-background justify-center"
          style={animatedStyle}
        >
          <View className="flex-row items-center gap-3 p-4">
            <Icon name="MapPin" color="#EA4335" />
            <View className="flex-1 gap-0.5">
              <Text className="font-medium">
                Longitude: {longitude.toFixed(6)}
              </Text>
              <Text className="font-medium">
                Latitude: {latitude.toFixed(6)}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {timeAgo(timestamp)}
              </Text>
            </View>
            <Pressable
              style={pressed => ({ opacity: !pressed ? 0.5 : 1 })}
              onPress={() => openInMaps(latitude, longitude)}
            >
              <Text className="text-blue-500">Show on Map</Text>
            </Pressable>
          </View>
        </Animated.View>
      </GestureDetector>
      <Separator />
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    width: ACTION_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});
