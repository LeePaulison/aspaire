import { getOrCreatePreferencesForUser, createOrFetchUser } from '@/services/userService';
import { getResumesByUserId } from '@/dal/resumes';

export const userResolvers = {
  User: {
    preferences: async (parent) => {
      return await getOrCreatePreferencesForUser(parent.id);
    },
    resumes: async (parent, { limit, offset }) => {
      const safeLimit = Math.max(1, Math.min(limit, 50)); // Limit to a maximum of 50 resumes
      const safeOffset = Math.max(offset, 0); // Ensure offset is non-negative
      return await getResumesByUserId(parent.id, safeLimit, safeOffset);
    },
  },

  Query: {
    user: async (_, { id }) => {
      const user = await createOrFetchUser({ id });
      if (!user) {
        throw new Error(`User with ID ${id} does not exist.`);
      }
      return user;
    },
    userByAuth: async (_, { authProviderId, authProvider, email, name }) => {
      const user = await createOrFetchUser({ authProviderId, authProvider, email, name });
      if (!user) {
        throw new Error(`User with authProviderId ${authProviderId} and authProvider ${authProvider} does not exist.`);
      }
      return user;
    },
  },

  Mutation: {
    createUser: async (_, { input }) => {
      return await createOrFetchUser(input);
    },
  },
};
