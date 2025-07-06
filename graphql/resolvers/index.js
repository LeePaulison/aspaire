import { userResolvers } from './user.js';
import { preferencesResolvers } from './preferences.js';

export const resolvers = [userResolvers, preferencesResolvers];
