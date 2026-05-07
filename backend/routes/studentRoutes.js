// Student routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  bulkUpload,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for CSV uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
});

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(getStudents)
  .post(authorize('admin', 'university'), createStudent);

router
  .route('/bulk-upload')
  .post(authorize('admin', 'university'), upload.single('file'), bulkUpload);

router
  .route('/:id')
  .get(getStudent)
  .put(authorize('admin', 'university'), updateStudent)
  .delete(authorize('admin', 'university'), deleteStudent);

module.exports = router;
