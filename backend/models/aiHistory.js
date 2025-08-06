import mongoose from 'mongoose';

const AIHistorySchema = new mongoose.Schema({
  conversationId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: ['summary', 'cover_letter', 'search_term_suggestion', 'interview_chat', 'chat'],
  },
  title: { type: String, required: true },
  input: { type: mongoose.Schema.Types.Mixed, required: true },
  output: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

const AIHistory = mongoose.models.AIHistory || mongoose.model('AIHistory', AIHistorySchema);
export default AIHistory;
