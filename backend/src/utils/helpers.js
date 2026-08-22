const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Send a standardized success response
 */
const sendSuccess = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({ success: true, message, ...data });
};

/**
 * Send a standardized error response
 */
const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

module.exports = { generateToken, sendSuccess, sendError };
