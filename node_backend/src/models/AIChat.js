const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  method: { type: String, enum: ['groq', 'rule-engine'], default: 'groq' },
});

const aiChatSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [messageSchema],
    // Optional: link to logged-in user
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    metadata: {
      userAgent: String,
      ipAddress: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AIChat', aiChatSchema);
