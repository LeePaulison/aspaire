import { OpenAI } from 'openai';
import crypto from 'crypto';
import { logAIHistory } from '../../lib/logAIHistory.js';

export async function* streamInterviewChat(message, history = [], model = 'gpt-4o') {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const formattedMessages = [
    {
      role: 'system',
      content: 'You are a helpful and realistic AI conducting a mock job interview.',
    },
    ...history.map(({ role, content }) => ({ role, content })),
    { role: 'user', content: message },
  ];

  const stream = await openai.chat.completions.create({
    model,
    messages: formattedMessages,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      yield { interviewChatStream: { content, done: false } };
    }
  }

  yield { interviewChatStream: { content: 'Stream Completed Successfully', done: true } };

  await logAIHistory({
    conversationId: 'c-' + crypto.randomUUID(),
    userId: 'mock-user-id',
    type: 'interview_chat',
    title: 'Interview Chat Stream',
    input: { message, history },
    output: { content: 'Stream Completed Successfully' },
  });
}
