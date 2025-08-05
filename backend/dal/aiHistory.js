import { connectToDatabase } from '../db/mongoose.js';
import AIHistory from '../models/aiHistory.js';

export async function saveAIHistory(entry) {
  await connectToDatabase();
  const result = await AIHistory.create({ ...entry, createdAt: new Date() });
  return result._id.toString();
}

export async function getAIHistoryByUser(userId, type = null) {
  await connectToDatabase();
  const query = { userId };
  if (type) query.type = type;

  const results = await AIHistory.find(query).sort({ createdAt: -1 }).lean();

  return results.map((doc) => ({
    ...doc,
    id: doc._id.toString(),
    createdAt: new Date(doc.createdAt).toISOString(), // ✅ Format here
  }));
}
