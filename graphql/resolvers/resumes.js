import {
  createFileResumeAction,
  createPastedResumeAction,
  updateResumeAction,
  deleteResumeAction,
  getResumeByIdAction,
  getResumesByUserAction,
} from '@/contracts/actions/resumes';

export const resumeResolvers = {
  Query: {
    resume: async (_, { id }) => {
      return await getResumeByIdAction(id);
    },
    resumesByUser: async (_, { userId, limit, offset }) => {
      return await getResumesByUserAction(userId, limit, offset);
    },
  },
  Mutation: {
    createFileResume: async (_, { input }) => {
      return await createFileResumeAction(input);
    },
    createPastedResume: async (_, { input }) => {
      return await createPastedResumeAction(input);
    },
    updateResume: async (_, { id, input }) => {
      return await updateResumeAction(id, input);
    },
    deleteResume: async (_, { id }) => {
      return await deleteResumeAction(id);
    },
  },
};
