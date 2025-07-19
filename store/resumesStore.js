import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useResumesStore = create(
  persist((set) => ({
    resumes: [],
    addResume: (resume) => set((state) => ({ resumes: [...state.resumes, resume] })),
    removeResume: (id) =>
      set((state) => ({
        resumes: state.resumes.filter((resume) => resume.id !== id),
      })),
  })),
  {
    name: 'resumes-storage', // unique name
    getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
  }
);
