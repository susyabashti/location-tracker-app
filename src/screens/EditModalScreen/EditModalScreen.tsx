import React from 'react';
import { Alert, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '@/lib/types/navigation';
import { useLocationStore } from '@/lib/storage/location';

export const EditModalScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'EditModal'>) => {
  const { id, latitude, longitude, onSave, onCancel, preventDefaultGoBack } =
    route.params;
  const latInputRef = React.useRef<string>(latitude.toString());
  const lonInputRef = React.useRef<string>(longitude.toString());
  const updateLocation = useLocationStore.use.updateLocation();

  const handleConfirm = () => {
    const newLat = parseFloat(latInputRef.current);
    const newLon = parseFloat(lonInputRef.current);

    if (isNaN(newLat) || isNaN(newLon)) {
      Alert.alert('Invalid input', 'Please enter valid coordinates.');
      return;
    }

    updateLocation(id, { latitude: newLat, longitude: newLon });
    onSave?.(newLon, newLat);

    if (preventDefaultGoBack) return;
    navigation.goBack();
  };

  const handleCancel = () => {
    onCancel?.();

    if (preventDefaultGoBack) {
      return;
    }
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-background px-6 py-8 justify-between">
        <View>
          <Text className="text-2xl font-bold mb-6 text-center">
            Edit Location Coordinates
          </Text>
          <View className="gap-4">
            <View className="gap-2">
              <Label>Longitude</Label>
              <Input
                defaultValue={longitude.toString()}
                onChangeText={text => {
                  lonInputRef.current = text;
                }}
                placeholder="Longitude"
                keyboardType="numeric"
              />
            </View>
            <View className="gap-2">
              <Label>Latitude</Label>
              <Input
                defaultValue={latitude.toString()}
                onChangeText={text => {
                  latInputRef.current = text;
                }}
                placeholder="Latitude"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View className="justify-end gap-3 mt-8">
          <Button onPress={handleConfirm}>
            <Text>Save</Text>
          </Button>
          <Button variant="outline" onPress={handleCancel}>
            <Text>Cancel</Text>
          </Button>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
