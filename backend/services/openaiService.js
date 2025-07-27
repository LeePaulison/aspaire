import { OpenAI } from 'openai';

export async function generateCompletion(prompt, model = 'gpt-4o') {
  if (!prompt) throw new Error('Missing prompt');

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // ✅ moved inside

  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
  });

  return completion.choices?.[0]?.message?.content || '';
}

export function streamCompletion(prompt, model = 'gpt-4o') {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  return openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });
}
