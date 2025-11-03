import React, { useState, useEffect } from 'react';
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
  const { id, latitude, longitude } = route.params;
  const updateLocation = useLocationStore.use.updateLocation();
  const [latInput, setLatInput] = useState(latitude.toString());
  const [lonInput, setLonInput] = useState(longitude.toString());

  useEffect(() => {
    setLatInput(latitude.toString());
    setLonInput(longitude.toString());
  }, [latitude, longitude]);

  const handleConfirm = () => {
    const newLat = parseFloat(latInput);
    const newLon = parseFloat(lonInput);

    if (isNaN(newLat) || isNaN(newLon)) {
      Alert.alert('Invalid input', 'Please enter valid coordinates.');
      return;
    }

    updateLocation(id, { latitude: newLat, longitude: newLon });
    navigation.goBack();
  };

  const handleCancel = () => {
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
                value={lonInput}
                onChangeText={setLonInput}
                placeholder="Longitude"
                keyboardType="numeric"
              />
            </View>
            <View className="gap-2">
              <Label>Latitude</Label>
              <Input
                value={latInput}
                onChangeText={setLatInput}
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
