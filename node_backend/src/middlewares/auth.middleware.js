const { verifyAccessToken } = require('../utils/token');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Attach user to request if valid JWT provided
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ detail: 'Authentication credentials were not provided.' });
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ detail: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Token is invalid or has expired.' });
  }
});

// Require ADMIN or SUPERADMIN role
const requireAdmin = (req, res, next) => {
  if (!req.user || !['ADMIN', 'SUPERADMIN'].includes(req.user.role)) {
    return res.status(403).json({ detail: 'You do not have permission to perform this action.' });
  }
  next();
};

// Require SUPERADMIN role only
const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'SUPERADMIN') {
    return res.status(403).json({ detail: 'Superadmin access required.' });
  }
  next();
};

module.exports = { protect, requireAdmin, requireSuperAdmin };
