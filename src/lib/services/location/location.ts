import Geolocation from 'react-native-geolocation-service';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { locationStore } from './storage';
import BackgroundService from 'react-native-background-actions';
import { Platform } from 'react-native';

const TRACKING_TASK_OPTIONS = {
  taskName: 'LocationTracking',
  taskTitle: 'Tracking your location',
  taskDesc: 'Location tracking is active.',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff0000',
  linkingURI: 'locationtracker://home',
};

interface LocationTaskParams {
  delay: number;
}

let watcherId: number | null = null;

const sleep = (time: number) =>
  new Promise(resolve => setTimeout(() => resolve(true), time));

export const backgroundlocationTracking = async (
  taskData?: LocationTaskParams,
) => {
  const { delay = 8000 } = taskData || {};

  await new Promise(async _resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      Geolocation.getCurrentPosition(
        trackLocation,
        error => console.error('Location error:', error),
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
        },
      );

      await sleep(delay);
    }
  });
};

export const iosLocationTracking = async (interval: number) => {
  if (watcherId !== null) {
    Geolocation.clearWatch(watcherId);
    watcherId = null;
  }

  watcherId = Geolocation.watchPosition(
    trackLocation,
    error => console.warn('Location error:', error),
    {
      enableHighAccuracy: true,
      distanceFilter: 0,
      interval,
      fastestInterval: interval / 2,
      showsBackgroundLocationIndicator: true,
    },
  );
};

export const startLocationTracking = async () => {
  const { settings } = locationStore.getState();
  const interval = settings.interval * 1000;

  if (Platform.OS === 'ios') {
    iosLocationTracking(interval);
  } else {
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
    }
    await BackgroundService.start(backgroundlocationTracking, {
      ...TRACKING_TASK_OPTIONS,
      parameters: { delay: interval },
    });
  }
};

export const stopLocationTracking = async () => {
  if (Platform.OS === 'ios') {
    if (watcherId !== null) {
      Geolocation.clearWatch(watcherId);
      watcherId = null;
    }
  } else {
    await BackgroundService.stop();
  }

  locationStore.getState().resetStationary();
};

export const trackLocation = (position: Geolocation.GeoPosition) => {
  const state = locationStore.getState();
  const {
    lastLocation,
    addLocation,
    setStationarySince,
    stationarySince,
    resetStationary,
    setHasSentNotification,
    hasSentNotification,
    settings,
  } = state;

  const { latitude, longitude } = position.coords;
  const now = Date.now();
  addLocation({ latitude, longitude, timestamp: now });

  if (!lastLocation) {
    setStationarySince(now);
    return;
  }

  const distance = calculateDistance(
    { lat: lastLocation.latitude, lng: lastLocation.longitude },
    { lat: latitude, lng: longitude },
  );

  const isStationary = distance < settings.movementThreshold;
  if (!isStationary) {
    // if the user is in new location, set the current timestamp for next check
    resetStationary();
    return;
  }

  if (!stationarySince) {
    setStationarySince(now);
  }

  const since = stationarySince || now;
  const secondsSince = (now - since) / 1000;

  if (secondsSince < settings.stationaryTimeoutSeconds || hasSentNotification) {
    return;
  }

  sendStationaryNotification();
  setHasSentNotification(true);
};

const sendStationaryNotification = async () => {
  const channelId = await notifee.createChannel({
    id: 'stationary-alerts',
    name: 'Stationary Alerts',
  });

  await notifee.displayNotification({
    id: 'stop-tracking',
    title: "Hey, you've been still for a while!",
    body: 'Tap to stop location tracking.',
    android: {
      importance: AndroidImportance.HIGH,
      channelId: channelId,
    },
    ios: {
      critical: true,
    },
  });
};

export const calculateDistance = (
  c1: { lat: number; lng: number },
  c2: { lat: number; lng: number },
): number => {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(c2.lat - c1.lat);
  const dLon = toRad(c2.lng - c1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(c1.lat)) * Math.cos(toRad(c2.lat)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
