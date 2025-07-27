import { OpenAI } from 'openai';

export async function generateCoverLetter({ jobDescription, resumeContent }) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that writes professional cover letters.',
      },
      {
        role: 'user',
        content: `Here is the job description:\n${jobDescription}\n\nAnd my resume:\n${resumeContent}`,
      },
    ],
  });

  return response.choices?.[0]?.message?.content || '';
}
