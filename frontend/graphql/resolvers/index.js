import { userResolvers } from './user.js';
import { preferencesResolvers } from './preferences.js';
import { resumeResolvers } from './resumes.js';

export const resolvers = [userResolvers, preferencesResolvers, resumeResolvers];
