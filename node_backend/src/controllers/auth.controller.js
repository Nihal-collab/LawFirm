const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token');

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

module.exports = { login, refreshToken, logout, getProfile, changePassword, listUsers, deleteUser, updateUserRole };
