// Input validation middleware — validates auth inputs using express-validator
const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map((e) => e.msg).join(', '),
      errors: errors.array(),
    });
  }
  next();
};

// Validate registration input
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
    .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Name can only contain letters, spaces, dots, hyphens, and apostrophes'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),

  body('role')
    .optional()
    .isIn(['admin', 'university', 'student']).withMessage('Invalid role specified'),

  // Honeypot field — should be empty (bots fill hidden fields)
  body('company_url_field_hp')
    .optional()
    .custom((value) => {
      if (value && value.length > 0) {
        throw new Error('Bot detected');
      }
      return true;
    }),

  handleValidationErrors,
];

// Validate login input
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  // Honeypot field
  body('company_url_field_hp')
    .optional()
    .custom((value) => {
      if (value && value.length > 0) {
        throw new Error('Bot detected');
      }
      return true;
    }),

  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin };
