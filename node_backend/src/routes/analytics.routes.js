const express = require('express');
const router = express.Router();
const { recordVisit, getAnalytics } = require('../controllers/analytics.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

// Public endpoint called on homepage load
router.post('/analytics/visit', recordVisit);

// Protected admin endpoint called on admin dashboard load
router.get('/admin/analytics', protect, requireAdmin, getAnalytics);

module.exports = router;
