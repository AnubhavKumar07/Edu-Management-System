// Auth routes — with validation and rate limiting
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validators');
const { authLimiter, loginLimiter } = require('../middleware/rateLimiter');

// Rate limit + validate + handler
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;
