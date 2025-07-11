import { create } from 'zustand';

export const usePreferencesStore = create((set) => ({
  preferences: {},
  setPreferences: (prefs) => set({ preferences: { ...prefs } }),
  clearPreferences: () => set({ preferences: {} }),
}));
