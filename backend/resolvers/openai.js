import { OpenAI } from 'openai';

export const openAIResolvers = {
  Subscription: {
    openAIStream: {
      subscribe: async function* (_, { prompt }) {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // ✅ Lazy init
        const stream = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) yield { openAIStream: { content, done: false } };
        }

        yield { openAIStream: { content: 'Stream Completed Successfully', done: true } };
      },
    },
  },
};
