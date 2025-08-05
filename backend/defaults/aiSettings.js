export const DEFAULT_AI_SETTINGS = {
  promptStyle: 'default',
  temperature: 0.7,
  model: 'gpt-4o',
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  maxTokens: 750,

  promptInterview: `You are a behavioral interviewer using the STAR technique. Ask thoughtful, open-ended questions.`,
  promptCoverLetter: `You write clear, compelling cover letters tailored to the job description and company mission.`,
  promptSearchTerms: `You suggest alternate job titles and relevant search terms based on a resume's content.`,
};

export const PROMPT_STYLES = ['DEFAULT', 'BEHAVIORAL', 'CASUAL', 'TECHNICAL'];
