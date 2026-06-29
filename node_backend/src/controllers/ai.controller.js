const { v4: uuidv4 } = require('uuid');
const AIChat = require('../models/AIChat');
const { callAI } = require('../ai/groq.service');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/ai/chat
const chat = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  // Use provided sessionId or generate a new one
  const sid = sessionId || uuidv4();

  // Load existing conversation from DB
  let chatSession = await AIChat.findOne({ sessionId: sid });
  const history = chatSession ? chatSession.messages : [];

  // Call Groq AI (with conversation history for context)
  const { response, method } = await callAI(message.trim(), history);

  // Save messages to DB
  if (!chatSession) {
    chatSession = new AIChat({
      sessionId: sid,
      userId: req.user?._id || null,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      messages: [],
    });
  }

  chatSession.messages.push({ role: 'user', content: message.trim() });
  chatSession.messages.push({ role: 'assistant', content: response, method });
  await chatSession.save();

  res.status(200).json({
    response,
    method,
    sessionId: sid,
  });
});

// GET /api/ai/history/:sessionId
const getHistory = asyncHandler(async (req, res) => {
  const chatSession = await AIChat.findOne({ sessionId: req.params.sessionId });

  if (!chatSession) {
    return res.status(404).json({ detail: 'Session not found.' });
  }

  res.status(200).json({
    sessionId: chatSession.sessionId,
    messages: chatSession.messages,
    createdAt: chatSession.createdAt,
  });
});

// GET /api/ai/sessions — Admin: list all chat sessions
const listSessions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [sessions, total] = await Promise.all([
    AIChat.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('sessionId messages createdAt updatedAt userId'),
    AIChat.countDocuments(),
  ]);

  res.status(200).json({
    sessions: sessions.map((s) => ({
      sessionId: s.sessionId,
      messageCount: s.messages.length,
      lastMessage: s.messages[s.messages.length - 1]?.content?.slice(0, 100),
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    })),
    pagination: { total, page: parseInt(page), limit: parseInt(limit) },
  });
});

// DELETE /api/ai/sessions/:sessionId — Admin: delete a session
const deleteSession = asyncHandler(async (req, res) => {
  await AIChat.findOneAndDelete({ sessionId: req.params.sessionId });
  res.status(200).json({ detail: 'Session deleted.' });
});

module.exports = { chat, getHistory, listSessions, deleteSession };
