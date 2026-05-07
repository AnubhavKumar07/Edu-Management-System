// University routes
const express = require('express');
const router = express.Router();
const {
  getUniversities,
  getUniversity,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} = require('../controllers/universityController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(getUniversities)
  .post(authorize('admin'), createUniversity);

router
  .route('/:id')
  .get(getUniversity)
  .put(authorize('admin'), updateUniversity)
  .delete(authorize('admin'), deleteUniversity);

module.exports = router;
