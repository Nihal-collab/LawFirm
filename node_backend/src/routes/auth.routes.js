const express = require('express');
const router = express.Router();
const {
  login, refreshToken, logout, getProfile, changePassword,
  listUsers, deleteUser, updateUserRole,
} = require('../controllers/auth.controller');
const { protect, requireAdmin, requireSuperAdmin } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');

// Public routes
router.post('/login', authLimiter, login);
router.post('/refresh', authLimiter, refreshToken);

// Protected routes (requires valid JWT)
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.post('/change-password', protect, changePassword);

// Admin routes — manage users
router.get('/users', protect, requireAdmin, listUsers);
router.delete('/users/:id', protect, requireSuperAdmin, deleteUser);
router.patch('/users/:id/role', protect, requireSuperAdmin, updateUserRole);

module.exports = router;
