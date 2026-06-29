const express = require('express');
const router = express.Router();
const { chat, getHistory, listSessions, deleteSession } = require('../controllers/ai.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');
const { aiLimiter } = require('../middlewares/rateLimiter.middleware');

// Public — AI chat (with rate limiting)
// sessionId is optional; if provided, conversation context is preserved
router.post('/chat', aiLimiter, chat);
router.post('/assistant', aiLimiter, chat);
router.post('/assistant/', aiLimiter, chat);

// Public — retrieve a specific chat history by sessionId
router.get('/history/:sessionId', getHistory);

// Admin — list and manage all AI chat sessions
router.get('/sessions', protect, requireAdmin, listSessions);
router.delete('/sessions/:sessionId', protect, requireAdmin, deleteSession);

module.exports = router;
