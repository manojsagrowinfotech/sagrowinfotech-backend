const rateLimit = require('express-rate-limit');

// Generic limiter
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                // 300 requests
  standardHeaders: true,
  legacyHeaders: false
});

// Login brute-force protection
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                  // 5 attempts
  message: {
    message: 'Too many login attempts. Try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Refresh token abuse protection
exports.refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: 'Too many refresh requests. Please login again.'
  }
});

// Forgot password abuse protection
exports.forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    message: 'Too many password reset requests. Try later.'
  }
});
