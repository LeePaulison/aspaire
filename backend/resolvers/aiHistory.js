import { saveAIHistory, getAIHistoryByUser } from '../dal/aihistory.js';

export const aiHistoryResolvers = {
  Query: {
    aiHistory: async (_, { userId, type }) => {
      return await getAIHistoryByUser(userId, type);
    },
  },
  Mutation: {
    saveAIHistory: async (_, { input }) => {
      return await saveAIHistory(input);
    },
  },
};
