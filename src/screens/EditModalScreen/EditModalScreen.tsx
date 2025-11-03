import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { RootStackScreenProps } from '@/lib/types/navigation';

type Props = {
  latitude: number;
  longitude: number;
};

export type EditLocationResult = {
  latitude: number;
  longitude: number;
};

export const EditModalScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'EditModal'>) => {
  const { id, latitude, longitude } = route.params;
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

    console.log(newLat, newLon, id);
    navigation.goBack();
    // hide({ latitude: newLat, longitude: newLon });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
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
      <View className="flex-row justify-end gap-3 mt-8">
        <Button variant="outline" onPress={handleCancel} className="flex-1">
          <Text>Cancel</Text>
        </Button>
        <Button onPress={handleConfirm} className="flex-1">
          <Text>Save</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
