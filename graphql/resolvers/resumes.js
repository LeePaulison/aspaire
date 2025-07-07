import {
  createFileResume,
  createPastedResume,
  getResumeById,
  getResumesByUserId,
  updateResume,
  deleteResume,
} from '@/dal/resumes';

export const resumeResolvers = {
  Query: {
    resume: async (_, { id }) => {
      const resume = await getResumeById(id);
      if (!resume) {
        throw new Error(`Resume with ID ${id} does not exist.`);
      }
      return resume;
    },

    resumesByUser: async (_, { userId, limit, offset }) => {
      return await getResumesByUserId(userId, limit, offset);
    },
  },

  Mutation: {
    createFileResume: async (_, { input }) => {
      const existingResumes = await getResumesByUserId(input.userId);
      const resumeWithSameS3Key = existingResumes.find((resume) => resume.s3Key === input.s3Key);

      if (resumeWithSameS3Key) {
        throw new Error(`A resume with the same S3 key already exists for user ID ${input.userId}.`);
      }

      if (input.sourceType !== 'file') {
        throw new Error(`Invalid sourceType for file resume.`);
      }

      return await createFileResume(input);
    },

    createPastedResume: async (_, { input }) => {
      if (input.sourceType !== 'partial') {
        throw new Error(`Invalid sourceType for pasted resume.`);
      }

      return await createPastedResume(input);
    },

    updateResume: async (_, { id, input }) => {
      const existing = await getResumeById(id);
      if (!existing) {
        throw new Error(`Resume with ID ${id} does not exist.`);
      }

      return await updateResume(id, input);
    },

    deleteResume: async (_, { id }) => {
      const existing = await getResumeById(id);
      if (!existing) {
        throw new Error(`Resume with ID ${id} does not exist.`);
      }

      await deleteResume(id);

      return {
        success: true,
        message: `Resume with ID ${id} was deleted.`,
      };
    },
  },
};
