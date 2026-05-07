// Analytics routes
const express = require('express');
const router = express.Router();
const {
  getOverview,
  getCourseDistribution,
  getUniversityComparison,
  getSkillsDistribution,
  getPerformanceTrends,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/overview', authorize('admin', 'university'), getOverview);
router.get('/course-distribution', authorize('admin', 'university'), getCourseDistribution);
router.get('/university-comparison', authorize('admin'), getUniversityComparison);
router.get('/skills', authorize('admin', 'university'), getSkillsDistribution);
router.get('/performance-trends', authorize('admin', 'university'), getPerformanceTrends);

module.exports = router;
