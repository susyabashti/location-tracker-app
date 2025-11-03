import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { createSelectors } from '../helpers/zustand';
import { Platform } from 'react-native';

const storage = createMMKV({ id: 'settings-store' });

export type Settings = {
  // on android 'system' is not available
  theme: 'dark' | 'light' | 'system';
  interval: number;
  movementThreshold: number;
  stationaryTimeoutSeconds: number;
  pushEnabled: boolean;
  trackingEnabled: boolean;
};

type SettingsStore = {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
};

const INITIAL_SETTINGS: Settings = {
  // on android 'system' is not available so we set the default to light
  theme: Platform.OS === 'ios' ? 'system' : 'light',
  interval: 8,
  movementThreshold: 20,
  stationaryTimeoutSeconds: 20,
  pushEnabled: true,
  trackingEnabled: true,
};

export const settingsStore = create<SettingsStore>()(
  persist(
    set => ({
      settings: INITIAL_SETTINGS,
      updateSettings: newSettings =>
        set(state => {
          const updated = { ...state.settings, ...newSettings };
          storage.set('settings', JSON.stringify(updated));
          return { settings: updated };
        }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => ({
        setItem: (key, value) => storage.set(key, value),
        getItem: key => storage.getString(key) ?? null,
        removeItem: key => storage.remove(key),
      })),
      merge: (persistedState, currentState) => {
        const parsed = persistedState as SettingsStore;
        return {
          ...currentState,
          settings: { ...INITIAL_SETTINGS, ...parsed.settings },
        };
      },
    },
  ),
);

export const useSettingsStore = createSelectors(settingsStore);
