import { getUserById, getUserByAuth } from '../dal/user.js';
import { getOrCreatePreferencesForUser, createUser } from '../services/userService.js';
import { getResumesByUserId } from '../dal/resumes.js';
import { getJobListingsByUserId } from '../dal/jobListings.js';

export const userResolvers = {
  User: {
    preferences: async (parent) => {
      console.log('[User Resolvers] Fetching preferences for user:', parent.id);
      return await getOrCreatePreferencesForUser(parent.id);
    },
    resumes: async (parent, args) => {
      const { limit, offset } = args;
      const safeLimit = Math.max(1, Math.min(limit ?? 10, 50));
      const safeOffset = Math.max(offset ?? 0, 0);
      return await getResumesByUserId(parent.id, safeLimit, safeOffset);
    },
    jobListings: async (parent, args) => {
      const { limit, offset } = args;
      const safeLimit = Math.max(1, Math.min(limit ?? 10, 50));
      const safeOffset = Math.max(offset ?? 0, 0);
      return await getJobListingsByUserId(parent.id, safeLimit, safeOffset);
    },
  },

  Query: {
    user: async (_, { id }) => {
      const user = await getUserById(id);
      if (!user) {
        throw new Error(`User with ID ${id} does not exist.`);
      }
      return user;
    },

    userByAuth: async (_, args) => {
      const { authProviderId, authProvider, email, name } = args;
      return await getUserByAuth(authProviderId, authProvider, email, name);
    },
  },

  Mutation: {
    createUserWithAuth: async (_, { input }) => {
      return await createUser(input);
    },
  },
};
