import {
  createFileResume,
  createPastedResume,
  getResumeById,
  getResumesByUserId,
  updateResume,
  deleteResume,
} from '../dal/resumes.js';
import { requireAuth, requireUserId, getOptionalUser } from '../middleware/auth.js';

export const resumeResolvers = {
  Query: {
    // Get a specific resume (with ownership check)
    resume: async (_, { id }, context) => {
      const user = requireAuth(context);
      const resume = await getResumeById(id);
      
      if (!resume) {
        throw new Error('Resume not found');
      }
      
      // Check if user owns this resume
      const userId = user.sub || user.id || user.email;
      if (resume.user_id !== userId) {
        throw new Error('Unauthorized: You can only access your own resumes');
      }
      
      return resume;
    },
    
    // Get resumes for authenticated user
    resumesByUser: async (_, { userId, limit, offset }, context) => {
      if (userId) {
        // If userId is provided, ensure it matches the authenticated user
        requireUserId(context, userId);
      } else {
        // If no userId provided, get resumes for the authenticated user
        const user = requireAuth(context);
        userId = user.sub || user.id || user.email;
      }
      
      return await getResumesByUserId(userId, limit, offset);
    },
    
    // Get current user's resumes (convenient shorthand)
    myResumes: async (_, { limit, offset }, context) => {
      const user = requireAuth(context);
      const userId = user.sub || user.id || user.email;
      return await getResumesByUserId(userId, limit, offset);
    },
  },
  
  Mutation: {
    createFileResume: async (_, { input }, context) => {
      const user = requireAuth(context);
      const userId = user.sub || user.id || user.email;
      
      // Ensure user can only create resumes for themselves
      if (input.user_id && input.user_id !== userId) {
        throw new Error('Cannot create resume for another user');
      }
      
      const resumeInput = {
        ...input,
        user_id: userId
      };
      
      return await createFileResume(resumeInput);
    },
    
    createPastedResume: async (_, { input }, context) => {
      const user = requireAuth(context);
      const userId = user.sub || user.id || user.email;
      
      // Ensure user can only create resumes for themselves
      if (input.user_id && input.user_id !== userId) {
        throw new Error('Cannot create resume for another user');
      }
      
      const resumeInput = {
        ...input,
        user_id: userId
      };
      
      return await createPastedResume(resumeInput);
    },
    
    updateResume: async (_, { id, input }, context) => {
      const user = requireAuth(context);
      const userId = user.sub || user.id || user.email;
      
      // First check if the resume exists and user owns it
      const existingResume = await getResumeById(id);
      if (!existingResume) {
        throw new Error('Resume not found');
      }
      
      if (existingResume.user_id !== userId) {
        throw new Error('Unauthorized: You can only update your own resumes');
      }
      
      return await updateResume(id, input);
    },
    
    deleteResume: async (_, { id }, context) => {
      const user = requireAuth(context);
      const userId = user.sub || user.id || user.email;
      
      // First check if the resume exists and user owns it
      const existingResume = await getResumeById(id);
      if (!existingResume) {
        throw new Error('Resume not found');
      }
      
      if (existingResume.user_id !== userId) {
        throw new Error('Unauthorized: You can only delete your own resumes');
      }
      
      return await deleteResume(id);
    },
  },
};
