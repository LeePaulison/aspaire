import { createUserAction } from '@/contracts/actions/user/createUser';
import { getOrCreateUserByAuthAction } from '@/contracts/actions/user/getOrCreateUserByAuth';
import { getUserById } from '@/dal/user';
import { getOrCreatePreferencesForUser } from '@/services/userService';
import { getResumesByUserId } from '@/dal/resumes';

export const userResolvers = {
  User: {
    preferences: async (parent) => {
      return await getOrCreatePreferencesForUser(parent.id);
    },
    resumes: async (parent, { limit, offset }) => {
      const safeLimit = Math.max(1, Math.min(limit ?? 10, 50));
      const safeOffset = Math.max(offset ?? 0, 0);
      return await getResumesByUserId(parent.id, safeLimit, safeOffset);
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
      return await getOrCreateUserByAuthAction(args);
    },
  },

  Mutation: {
    createUser: async (_, { input }) => {
      console.log('[User Resolvers] Creating user with input:', input);
      return await createUserAction(input);
    },
  },
};
