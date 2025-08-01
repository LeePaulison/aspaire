import { userResolvers } from './user.js';
import { preferencesResolvers } from './preferences.js';
import { resumeResolvers } from './resumes.js';
import { remotiveResolvers } from './remotive.js';
import { serpResolvers } from './serp.js';
import { openAIResolvers } from './openai.js';
import { jobListingsResolvers } from './jobListings.js';

export const resolvers = [
  userResolvers,
  preferencesResolvers,
  resumeResolvers,
  jobListingsResolvers,
  remotiveResolvers,
  serpResolvers,
  openAIResolvers,
];
