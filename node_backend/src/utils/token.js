const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret_here') {
  throw new Error('FATAL ERROR: JWT_SECRET environment variable is not defined or is set to insecure placeholder.');
}

if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'your_jwt_refresh_secret_here') {
  throw new Error('FATAL ERROR: JWT_REFRESH_SECRET environment variable is not defined or is set to insecure placeholder.');
}

const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
