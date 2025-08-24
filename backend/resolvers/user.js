import { getUserById, getUserByAuth } from '../dal/user.js';
import { getOrCreatePreferencesForUser, createUser } from '../services/userService.js';
import { getResumesByUserId } from '../dal/resumes.js';
import { getJobListingsByUserId } from '../dal/jobListings.js';
import { getAISettingsByUserId } from '../dal/aiSettings.js';

export const userResolvers = {
  User: {
    preferences: async (parent) => {
      try {
        console.log('[User Resolvers] Fetching preferences for user:', parent.id);
        const preferences = await getOrCreatePreferencesForUser(parent.id);
        console.log('[User Resolvers] Preferences found:', !!preferences);
        return preferences;
      } catch (error) {
        console.error('[User Resolvers] Error fetching preferences:', error.message);
        throw new Error(`Failed to fetch preferences: ${error.message}`);
      }
    },
    resumes: async (parent, args) => {
      try {
        const { limit, offset } = args;
        const safeLimit = Math.max(1, Math.min(limit ?? 10, 50));
        const safeOffset = Math.max(offset ?? 0, 0);
        console.log('[User Resolvers] Fetching resumes for user:', parent.id, { limit: safeLimit, offset: safeOffset });
        const resumes = await getResumesByUserId(parent.id, safeLimit, safeOffset);
        console.log('[User Resolvers] Resumes found:', resumes?.length || 0);
        return resumes || [];
      } catch (error) {
        console.error('[User Resolvers] Error fetching resumes:', error.message);
        throw new Error(`Failed to fetch resumes: ${error.message}`);
      }
    },
    jobListings: async (parent, args) => {
      try {
        const { limit, offset } = args;
        const safeLimit = Math.max(1, Math.min(limit ?? 10, 50));
        const safeOffset = Math.max(offset ?? 0, 0);
        return await getJobListingsByUserId(parent.id, safeLimit, safeOffset);
      } catch (error) {
        console.error('[User Resolvers] Error fetching job listings:', error.message);
        throw new Error(`Failed to fetch job listings: ${error.message}`);
      }
    },
    aiSettings: async (parent) => {
      try {
        return await getAISettingsByUserId(parent.id);
      } catch (error) {
        console.error('[User Resolvers] Error fetching AI settings:', error.message);
        throw new Error(`Failed to fetch AI settings: ${error.message}`);
      }
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
    createUserWithAuth: async (_, { input }, context) => {
      try {
        console.log('[User Resolver] Creating user with input:', JSON.stringify(input, null, 2));
        const user = await createUser(input);
        console.log('[User Resolver] User created successfully:', user?.id);
        console.log('[User Resolver] Full user object:', JSON.stringify(user, null, 2));
        
        // Return the full user object so field resolvers can access it
        console.log('[User Resolver] Returning full user object for field resolvers');
        return user;
      } catch (error) {
        console.error('[User Resolver] Error creating user:', error.message);
        console.error('[User Resolver] Error stack:', error.stack);
        throw new Error(`Failed to create user: ${error.message}`);
      }
    },
  },
};
