import {
  createFileResume,
  createPastedResume,
  getResumeById,
  getResumesByUserId,
  updateResume,
  deleteResume,
} from '../dal/resumes.js';

export const resumeResolvers = {
  Query: {
    resume: async (_, { id }) => {
      return await getResumeById(id);
    },
    resumesByUser: async (_, { userId, limit, offset }) => {
      return await getResumesByUserId(userId, limit, offset);
    },
  },
  Mutation: {
    createFileResume: async (_, { input }) => {
      return await createFileResume(input);
    },
    createPastedResume: async (_, { input }) => {
      return await createPastedResume(input);
    },
    updateResume: async (_, { id, input }) => {
      return await updateResume(id, input);
    },
    deleteResume: async (_, { id }) => {
      return await deleteResume(id);
    },
  },
};
