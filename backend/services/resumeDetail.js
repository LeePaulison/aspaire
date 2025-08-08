import { getResumeById } from '../dal/resumes.js';
import { getResumeAIResults } from '../dal/resumeAIResult.js';

export const getResumeDetail = async (resumeId) => {
  try {
    const resume = await getResumeById(resumeId);
    console.log('Fetched resume with resumeId:', resumeId, resume);
    const aiResults = await getResumeAIResults(resumeId);
    console.log('Fetched AI results for resumeId:', resumeId, aiResults);

    return {
      resume,
      aiResults,
    };
  } catch (error) {
    console.error('Error fetching resume detail:', error);
    throw new Error('Failed to fetch resume detail');
  }
};
