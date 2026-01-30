const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs for auth
    message: { error: 'Too many login attempts, please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP to 100 requests per 15 mins for general API
    message: { error: 'Too many requests, please slow down.', code: 'RATE_LIMIT_EXCEEDED' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Slightly looser for public viewing to allow navigation
const publicLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60,
    message: { error: 'Too many requests.', code: 'RATE_LIMIT_EXCEEDED' },
});

module.exports = { authLimiter, apiLimiter, publicLimiter };
