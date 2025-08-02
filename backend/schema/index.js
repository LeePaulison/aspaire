import { rootTypeDefs } from './rootTypeDefs.js';
import { userTypeDefs } from './user.js';
import { preferencesTypeDefs } from './preferences.js';
import { resumeTypeDefs } from './resumes.js';
import { remotiveTypeDefs } from './remotive.js';
import { serpTypeDefs } from './serp.js';
import { openAITypeDefs } from './openai.js';
import { jobListingsTypeDefs } from './jobListings.js';

export const typeDefs = [
  rootTypeDefs,
  userTypeDefs,
  preferencesTypeDefs,
  resumeTypeDefs,
  remotiveTypeDefs,
  serpTypeDefs,
  openAITypeDefs,
  jobListingsTypeDefs,
];
