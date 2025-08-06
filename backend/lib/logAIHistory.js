import { saveAIHistory } from '../dal/aihistory.js';

export async function logAIHistory({ conversationId, userId, type, title, input, output }) {
  return await saveAIHistory({
    conversationId,
    userId,
    type,
    title,
    input,
    output,
  });
}
