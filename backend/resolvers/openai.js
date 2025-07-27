import { generateCoverLetter } from '../services/generators/coverLetter.js';
import { suggestSearchTerms } from '../services/generators/suggest.js';
import { summarizeResume } from '../services/generators/resumeSummary.js';
import { interviewChat } from '../services/generators/interviewChat.js';
import { streamChat } from '../services/generators/streamChat.js';
import { streamInterviewChat } from '../services/generators/interviewChatStream.js';

export const openAIResolvers = {
  Subscription: {
    openAIStream: {
      subscribe: (_, { prompt }) => streamChat(prompt),
    },
    interviewChatStream: {
      subscribe: (_, { message, history }) => streamInterviewChat(message, history),
    },
  },
  Mutation: {
    generateCoverLetter: async (_, { jobDescription, resumeContent }) => {
      return await generateCoverLetter({ jobDescription, resumeContent });
    },
    suggestSearchTerms: async (_, { resume }) => {
      return await suggestSearchTerms(resume);
    },
    resumeSummary: async (_, { resume }) => {
      return await summarizeResume(resume);
    },
    interviewChat: async (_, { message, history }) => {
      return await interviewChat(message, history);
    },
  },
};
