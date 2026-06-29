const express = require('express');
const router = express.Router();
const {
  listActiveVideos,
  listAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} = require('../controllers/video.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');
const { apiLimiter } = require('../middlewares/rateLimiter.middleware');

// Public endpoints (rate limited)
router.get('/', apiLimiter, listActiveVideos);

// Admin-only endpoints (protected and require admin role)
router.get('/all', protect, requireAdmin, listAllVideos);
router.post('/', protect, requireAdmin, createVideo);
router.put('/:id', protect, requireAdmin, updateVideo);
router.delete('/:id', protect, requireAdmin, deleteVideo);

module.exports = router;
