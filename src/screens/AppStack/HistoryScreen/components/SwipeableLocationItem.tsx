import React, { useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { openInMaps } from '@/lib/helpers/maps';
import { scheduleOnRN } from 'react-native-worklets';
import { useOpenRow } from './SwipeableListProvider';

const ACTION_WIDTH = 80;
const ROW_HEIGHT = 80;
const OPEN_THRESHOLD = ACTION_WIDTH * 0.7; // need clear swipe
const CLOSE_THRESHOLD = ACTION_WIDTH * 0.4; // less sensitive when returning

const deleteWorklet = (height: SharedValue<number>, onDelete: () => void) => {
  'worklet';
  height.value = withTiming(0, { duration: 250 }, finished => {
    if (finished) {
      scheduleOnRN(onDelete);
    }
  });
};

type Props = {
  latitude: number;
  longitude: number;
  timestamp: number;
  id: string;
  onEdit: () => void;
  onDelete: () => void;
};

export const SwipeableLocationItem = ({
  latitude,
  longitude,
  timestamp,
  id,
  onEdit,
  onDelete,
}: Props) => {
  const translateX = useSharedValue(0);
  const height = useSharedValue(ROW_HEIGHT);
  const { openRowId, setOpenRowId } = useOpenRow();

  useEffect(() => {
    if (openRowId && openRowId !== id) {
      translateX.value = withSpring(0);
    }
  }, [openRowId, id, translateX]);

  const confirmDelete = () => {
    Alert.alert('Delete Location', 'Are you sure you want to delete this?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteWorklet(height, onDelete),
      },
    ]);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate(e => {
      translateX.value = Math.min(
        Math.max(e.translationX, -ACTION_WIDTH),
        ACTION_WIDTH,
      );
    })
    .onEnd(() => {
      const x = translateX.value;

      if (x > OPEN_THRESHOLD) {
        translateX.value = withSpring(ACTION_WIDTH);
        scheduleOnRN(setOpenRowId, id);
      } else if (x < -OPEN_THRESHOLD) {
        translateX.value = withSpring(-ACTION_WIDTH);
        scheduleOnRN(setOpenRowId, id);
      } else if (Math.abs(x) < CLOSE_THRESHOLD) {
        translateX.value = withSpring(0);
        scheduleOnRN(setOpenRowId, null);
      } else {
        translateX.value = withSpring(x > 0 ? ACTION_WIDTH : -ACTION_WIDTH);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    height: height.value,
  }));

  return (
    <View>
      <View className="absolute inset-x-0 inset-y-0 flex-row justify-between overflow-hidden">
        {/* Left Action */}
        <View className="bg-[#3b82f6]" style={styles.actionContainer}>
          <Pressable onPress={onEdit} style={styles.actionButton}>
            <Icon name="Pen" color="white" size={22} />
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
        </View>
        {/* Right Action */}
        <View className="bg-[#ef4444]" style={styles.actionContainer}>
          <Pressable onPress={confirmDelete} style={styles.actionButton}>
            <Icon name="Trash2" color="white" size={22} />
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
        </View>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View
          className="flex-1 bg-background justify-center overflow-hidden"
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
            <Pressable onPress={() => openInMaps(latitude, longitude)}>
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
