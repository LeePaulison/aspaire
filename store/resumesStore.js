import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useResumesStore = create(
  persist(
    (set) => ({
      resumes: [],
      setResumes: (resumes) => set({ resumes }),
      addResume: (resume) => set((state) => ({ resumes: [...state.resumes, resume] })),
      removeResume: (id) =>
        set((state) => ({
          resumes: state.resumes.filter((resume) => resume.id !== id),
        })),
      reset: () => set({ resumes: [] }),
    }),
    {
      name: 'resumes-storage',
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        if (Array.isArray(state?.resumes) && Array.isArray(state.resumes[0])) {
          console.log('🛠 Flattening nested resumes on rehydrate');
          state.resumes = state.resumes[0];
        }
      },
    }
  )
);
