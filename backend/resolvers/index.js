import { userResolvers } from './user.js';
import { preferencesResolvers } from './preferences.js';
import { resumeResolvers } from './resumes.js';
import { remotiveResolvers } from './remotive.js';
import { serpResolvers } from './serp.js';

export const resolvers = [userResolvers, preferencesResolvers, resumeResolvers, remotiveResolvers, serpResolvers];
