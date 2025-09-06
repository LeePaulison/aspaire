import { getPreferencesByUserId, setPreferences } from '../dal/preferences.js';
import { requireAuth, requireUserId, getOptionalUser } from '../middleware/auth.js';

export const preferencesResolvers = {
  Query: {
    // Get preferences for the authenticated user
    preferences: async (_, { user_id }, context) => {
      if (user_id) {
        // If user_id is provided, ensure it matches the authenticated user
        requireUserId(context, user_id);
        return await getPreferencesByUserId(user_id);
      } else {
        // If no user_id provided, get preferences for the authenticated user
        const user = requireAuth(context);
        const userId = user.sub || user.id || user.email;
        return await getPreferencesByUserId(userId);
      }
    },
    
    // Get preferences for any user (admin only or public)
    preferencesByUserId: async (_, { user_id }, context) => {
      // Optional: Add admin check here if needed
      // const user = requireAuth(context);
      // if (!user.isAdmin) throw new Error('Admin access required');
      
      return await getPreferencesByUserId(user_id);
    },
  },
  
  Mutation: {
    setPreferences: async (_, { input }, context) => {
      const user = requireAuth(context);
      const userId = user.sub || user.id || user.email;
      
      // Ensure user can only set their own preferences
      if (input.userId && input.userId !== userId) {
        throw new Error('Cannot set preferences for another user');
      }
      
      // Set the userId from the token if not provided
      const preferencesInput = {
        ...input,
        userId: input.userId || userId
      };
      
      return await setPreferences(preferencesInput);
    },
  },
};
