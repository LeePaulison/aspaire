import { createResume, getResumeById, getResumesByUserId, updateResume, deleteResume } from '@/dal/resumes';

export const resumeResolvers = {
  Query: {
    resume: async (_, { id }) => {
      const resume = await getResumeById(id);
      if (!resume) {
        throw new Error(`Resume with ID ${id} does not exist.`);
      }
      return resume;
    },
    resumesByUser: async (_, { userId }) => {
      return await getResumesByUserId(userId);
    },
  },
  Mutation: {
    createResume: async (_, { input }) => {
      // Check if a resume with the same S3 key already exists for the user
      const existingResumes = await getResumesByUserId(input.userId);
      const resumeWithSameS3Key = existingResumes.find((resume) => resume.s3Key === input.s3Key);

      if (resumeWithSameS3Key) {
        throw new Error(`A resume with the same S3 key already exists for user ID ${input.userId}.`);
      }

      return await createResume(input);
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
