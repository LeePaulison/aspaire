import { userResolvers } from './user.js';
import { preferencesResolvers } from './preferences.js';
import { resumeResolvers } from './resumes.js';
import { remotiveResolvers } from './remotive.js';
import { serpResolvers } from './serp.js';
import { openAIResolvers } from './openai.js';
import { jobListingsResolvers } from './jobListings.js';
import { aiSettingsResolvers } from './aiSettings.js';
import { aiHistoryResolvers } from './aiHistory.js';
import { resumeAIResultsResolvers } from './resumeAIResults.js';
import { resumeDetailResolvers } from './resumeDetail.js';

export const resolvers = [
  userResolvers,
  preferencesResolvers,
  resumeResolvers,
  jobListingsResolvers,
  remotiveResolvers,
  serpResolvers,
  openAIResolvers,
  aiSettingsResolvers,
  aiHistoryResolvers,
  resumeAIResultsResolvers,
  resumeDetailResolvers,
];
