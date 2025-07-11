import { create } from 'zustand';

const useResumesStore = create((set) => ({
  resumes: [],
  addResume: (resume) => set((state) => ({ resumes: [...state.resumes, resume] })),
  removeResume: (id) =>
    set((state) => ({
      resumes: state.resumes.filter((resume) => resume.id !== id),
    })),
}));

export default useResumesStore;
