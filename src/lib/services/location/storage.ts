import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { createSelectors } from '@/lib/helpers/zustand';

const storage = createMMKV({ id: 'location-tracker' });

type Location = {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
};

type Settings = {
  interval: number;
  movementThreshold: number;
  stationaryTimeoutSeconds: number;
  pushEnabled: boolean;
  trackingEnabled: boolean;
};

type StoreActions = {
  addLocation: (loc: Omit<Location, 'id'>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  clearLocations: () => void;
  deleteLocation: (id: string) => void;
  resetStationary: () => void;
  setHasSentNotification: (value: boolean) => void;
  setStationarySince: (timestamp: number) => void;
};

type LocationState = {
  locations: Location[];
  settings: Settings;
  lastLocation: Location | null;
  stationarySince: number | null;
  hasSentNotification: boolean;
};

type LocationStore = LocationState & StoreActions;

const INITIAL_STATE = {
  locations: [],
  settings: {
    interval: 8,
    movementThreshold: 20,
    stationaryTimeoutSeconds: 20,
    pushEnabled: true,
    trackingEnabled: true,
  },
  lastLocation: null,
  stationarySince: null,
  hasSentNotification: false,
} satisfies LocationState;

export const locationStore = create<LocationStore>()(
  persist(
    set => ({
      ...INITIAL_STATE,

      addLocation: loc =>
        set(state => {
          const newLoc = { ...loc, id: Date.now().toString() };
          const updated = [newLoc, ...state.locations];
          storage.set('locations', JSON.stringify(updated));
          storage.set('lastLocation', JSON.stringify(newLoc));
          return { locations: updated, lastLocation: newLoc };
        }),

      updateSettings: newSettings =>
        set(state => {
          const updated = { ...state.settings, ...newSettings };
          storage.set('settings', JSON.stringify(updated));
          return { settings: updated };
        }),

      clearLocations: () => {
        storage.remove('locations');
        storage.remove('lastLocation');

        set({ locations: [], lastLocation: null });
      },

      deleteLocation: id =>
        set(state => {
          const filtered = state.locations.filter(l => l.id !== id);
          storage.set('locations', JSON.stringify(filtered));
          return { locations: filtered };
        }),

      resetStationary: () => {
        storage.remove('stationarySince');
        storage.remove('hasSentNotification');
        set({ stationarySince: null, hasSentNotification: false });
      },

      setHasSentNotification: value => {
        storage.set('hasSentNotification', value.toString());
        set({ hasSentNotification: value });
      },

      setStationarySince: timestamp => {
        storage.set('stationarySince', timestamp.toString());
        set({ stationarySince: timestamp });
      },
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => ({
        setItem: (key, value) => storage.set(key, value),
        getItem: key => storage.getString(key) ?? null,
        removeItem: key => storage.remove(key),
      })),
      onRehydrateStorage: () => state => {
        if (state) {
          const saved = storage.getNumber('stationarySince');
          if (saved) state.stationarySince = saved;
        }
      },
    },
  ),
);

export const useLocationStore = createSelectors(locationStore);
