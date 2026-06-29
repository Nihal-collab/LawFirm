const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token');
const crypto = require('crypto');
const { sendEmail } = require('../services/email.service');

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ detail: 'Email and password are required.' });
  }

  // Explicitly select password (it is excluded by default)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ detail: 'Invalid email or password.' });
  }

  const access = generateAccessToken(user._id, user.role);
  const refresh = generateRefreshToken(user._id);

  // Store refresh token in DB
  user.refreshToken = refresh;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    access,
    refresh,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

// POST /api/auth/refresh
const refreshToken = asyncHandler(async (req, res) => {
  const { refresh } = req.body;

  if (!refresh) {
    return res.status(400).json({ detail: 'Refresh token is required.' });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refresh);
  } catch {
    return res.status(401).json({ detail: 'Invalid or expired refresh token.' });
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user || user.refreshToken !== refresh) {
    return res.status(401).json({ detail: 'Refresh token is invalid or has been revoked.' });
  }

  const access = generateAccessToken(user._id, user.role);

  res.status(200).json({ access });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  // Clear refresh token from DB
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.status(200).json({ detail: 'Logout successful.' });
});

// GET /api/auth/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    id: user._id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    createdAt: user.createdAt,
  });
});

// POST /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { old_password, new_password } = req.body;

  if (!old_password || !new_password) {
    return res.status(400).json({ detail: 'Both old and new password are required.' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ detail: 'New password must be at least 6 characters.' });
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(old_password))) {
    return res.status(400).json({ old_password: ['Wrong password.'] });
  }

  user.password = new_password;
  await user.save();

  res.status(200).json({ detail: 'Password updated successfully.' });
});

// GET /api/auth/users — Admin only
const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json(users);
});

// DELETE /api/auth/users/:id — SuperAdmin only
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ detail: 'User not found.' });
  }
  if (user.role === 'SUPERADMIN') {
    return res.status(400).json({ detail: 'Cannot delete superadmin account.' });
  }
  await user.deleteOne();
  res.status(200).json({ detail: 'User deleted.' });
});

// PATCH /api/auth/users/:id/role — SuperAdmin only
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['ADMIN', 'CLIENT'].includes(role)) {
    return res.status(400).json({ detail: 'Invalid role.' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ detail: 'User not found.' });
  res.status(200).json(user);
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ detail: 'Email is required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  
  // Generic response for email privacy
  const genericResponse = { detail: 'If that email address is registered, a password reset link has been sent.' };

  if (!user) {
    return res.status(200).json(genericResponse);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expires

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.headers.origin || 'http://localhost:5173'}/reset-password/${resetToken}`;
  const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n`;

  await sendEmail({
    to: user.email,
    subject: 'SR4IPR Partners - Password Reset',
    text: message
  });

  res.status(200).json(genericResponse);
});

// POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirm_password } = req.body;

  if (!password) {
    return res.status(400).json({ detail: 'New password is required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ detail: 'Password must be at least 6 characters.' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ detail: 'Passwords do not match.' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ detail: 'Password reset token is invalid or has expired.' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ detail: 'Password reset successful.' });
});

module.exports = { login, refreshToken, logout, getProfile, changePassword, listUsers, deleteUser, updateUserRole, forgotPassword, resetPassword };
