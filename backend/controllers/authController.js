// Authentication controller — handles register, login, and profile
// Includes: account lockout, login attempt tracking, input validation
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory login attempt tracker (use Redis in production)
const loginAttempts = new Map();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Check if account is locked
const isAccountLocked = (email) => {
  const attempts = loginAttempts.get(email);
  if (!attempts) return false;

  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeSinceLock = Date.now() - attempts.lastAttempt;
    if (timeSinceLock < LOCKOUT_DURATION) {
      return true;
    }
    // Lockout expired — reset
    loginAttempts.delete(email);
    return false;
  }
  return false;
};

// Record failed login attempt
const recordFailedAttempt = (email) => {
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(email, attempts);
  return attempts;
};

// Clear login attempts on successful login
const clearAttempts = (email) => {
  loginAttempts.delete(email);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, universityId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user (password is validated by the validator middleware)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'student',
      universityId: universityId || null,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check account lockout
    if (isAccountLocked(normalizedEmail)) {
      const attempts = loginAttempts.get(normalizedEmail);
      const remainingMs = LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt);
      const remainingMinutes = Math.ceil(remainingMs / 60000);

      return res.status(429).json({
        success: false,
        message: `Account temporarily locked due to ${MAX_LOGIN_ATTEMPTS} failed attempts. Try again in ${remainingMinutes} minute(s).`,
        lockout: true,
        remainingMinutes,
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      recordFailedAttempt(normalizedEmail);
      // Generic message to prevent email enumeration
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      const attempts = recordFailedAttempt(normalizedEmail);
      const remaining = MAX_LOGIN_ATTEMPTS - attempts.count;

      if (remaining <= 0) {
        return res.status(429).json({
          success: false,
          message: `Account locked due to too many failed attempts. Try again in 30 minutes.`,
          lockout: true,
          remainingMinutes: 30,
        });
      }

      return res.status(401).json({
        success: false,
        message: `Invalid email or password. ${remaining} attempt(s) remaining.`,
        attemptsRemaining: remaining,
      });
    }

    // Successful login — clear failed attempts
    clearAttempts(normalizedEmail);

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('universityId');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
