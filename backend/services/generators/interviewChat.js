import { OpenAI } from 'openai';

export async function interviewChat(message, history = []) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const formattedHistory = [
    {
      role: 'system',
      content: 'You are a helpful AI that conducts realistic mock job interviews.',
    },
    ...history.map(({ role, content }) => ({ role, content })),
    { role: 'user', content: message },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: formattedHistory,
  });

  return response.choices?.[0]?.message || { role: 'assistant', content: '' };
}
