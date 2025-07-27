import { setPreferencesAction } from '@/contracts/actions/preferences/setPreferences';
import { getPreferencesByUserId } from '@/dal/preferences';

export const preferencesResolvers = {
  Query: {
    preferences: async (_, { user_id }) => {
      return await getPreferencesByUserId(user_id);
    },
  },
  Mutation: {
    setPreferences: async (_, { input }) => {
      return await setPreferencesAction(input);
    },
  },
};
