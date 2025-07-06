import { createUser, getUserById } from '../../dal/user.js';
import { setPreferences, getPreferencesByUserId } from '../../dal/preferences.js';

export const userResolvers = {
  // Resolver for User type
  User: {
    preferences: async (parent) => {
      let preferences = await getPreferencesByUserId(parent.id);

      if (!preferences) {
        await setPreferences({
          user_id: parent.id,
          preferred_locations: [],
          remote: false,
          industries: [],
          salary_min: 0,
          salary_max: 0,
          notifications_enabled: true,
        });

        preferences = await getPreferencesByUserId(parent.id);
      }

      return preferences;
    },
  },

  Query: {
    user: async (_, { id }) => {
      const user = await getUserById(id);
      // If user does not exist, throw an error
      if (!user) {
        throw new Error(`User with ID ${id} does not exist.`);
      }
      return user;
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      let existingUser = await getUserById(input.id);

      if (!existingUser) {
        existingUser = await createUser(input);
      }

      const existingPreferences = await getPreferencesByUserId(existingUser.id);
      if (existingPreferences) {
        // If preferences already exist, return the user with existing preferences
        return existingUser;
      }
      // set default preferences
      await setPreferences({
        user_id: existingUser.id,
        preferred_locations: [],
        remote: false,
        industries: [],
        salary_min: 0,
        salary_max: 0,
        notifications_enabled: true,
      });

      return existingUser;
    },
  },
};
