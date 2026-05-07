// Main server entry point — with comprehensive security
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const sanitizeInput = require('./middleware/sanitize');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ==============================
// SECURITY MIDDLEWARE
// ==============================

// Set security HTTP headers (XSS protection, content-type sniffing, clickjacking, etc.)
app.use(helmet());

// CORS — restrict origins in production
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers with size limits — prevents large payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize data — prevents NoSQL injection attacks ($gt, $ne, etc.)
app.use(mongoSanitize());

// Prevent HTTP parameter pollution
app.use(hpp());

// Custom input sanitization — strips HTML/script tags from all inputs
app.use(sanitizeInput);

// Global rate limiter — 100 requests per 15 minutes per IP
app.use('/api', apiLimiter);

// ==============================
// ROUTES
// ==============================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/universities', require('./routes/universityRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Data Management API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler middleware (must be after routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔒 Security: Helmet, CORS, Rate Limiting, Sanitization enabled`);
});
