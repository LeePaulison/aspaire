import { getResumeDetail } from '../services/resumeDetail.js';

export const resumeDetailResolvers = {
  Query: {
    getResumeDetail: async (_, { resumeId }) => {
      return getResumeDetail(resumeId);
    },
  },
};
