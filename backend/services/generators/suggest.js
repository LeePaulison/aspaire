import { OpenAI } from 'openai';

export async function suggestSearchTerms(resumeText) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `
You are an AI job coach. Analyze a resume and suggest search terms that will help the user find jobs that match their experience. Respond in structured JSON:
{
  "titles": [...],
  "skills": [...],
  "industries": [...],
  "locations": [...]
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: resumeText },
    ],
    temperature: 0.4,
  });

  const content = response.choices?.[0]?.message?.content;
  try {
    return JSON.parse(content);
  } catch {
    throw new Error('Failed to parse OpenAI response');
  }
}
