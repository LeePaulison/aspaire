import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePreferencesStore = create(
  persist(
    (set) => ({
      preferences: {},
      setPreferences: (prefs) => set({ preferences: { ...prefs } }),
      clearPreferences: () => set({ preferences: {} }),
    }),
    {
      name: 'preferences-storage', // unique name
      getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
    }
  )
);
