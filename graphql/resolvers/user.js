import { createUser, getUserById } from '../../dal/user.js';
import { setPreferences, getPreferencesByUserId } from '../../dal/preferences.js';
import { getResumesByUserId } from '../../dal/resumes.js';

export const userResolvers = {
  // Resolver for User type
  User: {
    preferences: async (parent) => {
      let preferences = await getPreferencesByUserId(parent.id);

      if (!preferences) {
        preferences = await setPreferences({
          userId: parent.id,
          preferredLocations: [],
          remote: false,
          industries: [],
          salaryMin: 0,
          salaryMax: 0,
          notificationsEnabled: true,
        });

        console.log(`Default preferences created for user ${parent.id}`);
      }

      return preferences;
    },
    resumes: async (parent) => {
      return await getResumesByUserId(parent.id);
    },
  },
  // Resolvers for Query and Mutation types

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
        userId: existingUser.id,
        preferredLocations: [],
        remote: false,
        industries: [],
        salaryMin: 0,
        salaryMax: 0,
        notificationsEnabled: true,
      });

      return existingUser;
    },
  },
};
