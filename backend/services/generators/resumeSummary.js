import { OpenAI } from 'openai';

export async function summarizeResume(resume) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You summarize resumes into short professional bios.',
      },
      {
        role: 'user',
        content: `Please summarize this resume in 3 sentences:\n\n${resume}`,
      },
    ],
  });

  return response.choices?.[0]?.message?.content || '';
}
