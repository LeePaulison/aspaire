import { OpenAI } from 'openai';
import crypto from 'crypto';
import { logAIHistory } from '../../lib/logAIHistory.js';

export async function* streamChat(prompt, model = 'gpt-4o') {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const stream = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      yield { openAIStream: { content, done: false } };
    }
  }

  yield { openAIStream: { content: 'Stream Completed Successfully', done: true } };

  await logAIHistory({
    conversationId: 'c-' + crypto.randomUUID(),
    userId: 'mock-user-id',
    type: 'chat',
    title: 'Chat Stream',
    input: { prompt },
    output: { content: 'Stream Completed Successfully' },
  });
}
