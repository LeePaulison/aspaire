import { setAISettings, getAISettingsByUserId } from '../dal/aiSettings.js';

export const aiSettingsResolvers = {
  Mutation: {
    setAISettings: async (_, { input }) => {
      console.log('[AI Settings Resolvers] Setting AI settings input:', input);
      return await setAISettings(input);
    },
  },
  Query: {
    aiSettings: async (_, { userId }) => {
      return await getAISettingsByUserId(userId);
    },
  },
};
