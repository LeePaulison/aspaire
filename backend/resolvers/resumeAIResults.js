import { setResumeAIResults, getResumeAIResults } from '../dal/resumeAIResult.js';

export const resumeAIResultsResolvers = {
  Mutation: {
    setResumeAIResults: async (_, { input }) => {
      return await setResumeAIResults(input);
    },
  },
  Query: {
    getResumeAIResults: async (_, { resumeId }) => {
      return await getResumeAIResults(resumeId);
    },
  },
};
