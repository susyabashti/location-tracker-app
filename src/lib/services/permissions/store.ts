import { create } from 'zustand';
import { createSelectors } from '../../helpers/zustand';

type PermissionsStore = {
  location: boolean;
  notification: boolean;
  denyLocation: () => void;
  allowLocation: () => void;
  denyNotifications: () => void;
  allowNotifications: () => void;
};

const usePermissionStoreBase = create<PermissionsStore>()(set => ({
  location: false,
  notification: false,
  denyLocation: () => set({ location: false }),
  allowLocation: () => set({ location: true }),
  denyNotifications: () => set({ notification: false }),
  allowNotifications: () => set({ notification: true }),
}));

export const usePermissionStore = createSelectors(usePermissionStoreBase);
