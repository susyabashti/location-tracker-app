import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { createSelectors } from '../helpers/zustand';

const storage = createMMKV({ id: 'locations-store' });

export type Location = {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
};

type LocationsStore = {
  locations: Location[];
  lastLocation: Location | null;
  stationarySince: number | null;
  hasSentNotification: boolean;

  addLocation: (loc: Omit<Location, 'id'>) => void;
  updateLocation: (
    id: string,
    coords: Pick<Location, 'latitude' | 'longitude'>,
  ) => void;
  clearLocations: () => void;
  deleteLocation: (id: string) => void;
  resetStationary: () => void;
  setHasSentNotification: (value: boolean) => void;
  setStationarySince: (timestamp: number) => void;
};

const INITIAL_STATE = {
  locations: [],
  lastLocation: null,
  stationarySince: null,
  hasSentNotification: false,
};

export const locationStore = create<LocationsStore>()(
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
      updateLocation: (id, coords) =>
        set(state => ({
          locations: state.locations.map(loc =>
            loc.id !== id ? loc : { ...loc, ...coords },
          ),
        })),
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
      name: 'locations-storage',
      storage: createJSONStorage(() => ({
        setItem: (key, value) => storage.set(key, value),
        getItem: key => storage.getString(key) ?? null,
        removeItem: key => storage.remove(key),
      })),
      merge: (persistedState, currentState) => {
        const parsed = persistedState as LocationsStore;
        return {
          ...currentState,
          ...parsed,
          locations: parsed.locations ?? [],
          lastLocation: parsed.lastLocation ?? null,
          stationarySince: parsed.stationarySince ?? null,
          hasSentNotification:
            parsed.hasSentNotification ?? INITIAL_STATE.hasSentNotification,
        };
      },
    },
  ),
);

export const useLocationStore = createSelectors(locationStore);
