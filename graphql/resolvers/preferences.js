import { setPreferences, getPreferencesByUserId } from '@/dal/preferences';

export const preferencesResolvers = {
  Query: {
    preferences: async (_, { user_id }) => {
      return await getPreferencesByUserId(user_id);
    },
  },
  Mutation: {
    setPreferences: async (_, { input }) => {
      return await setPreferences(input);
    },
  },
};
