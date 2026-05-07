// Student controller — CRUD operations + bulk upload
const Student = require('../models/Student');
const csv = require('csv-parser');
const fs = require('fs');

// @desc    Get all students (admin) or university's students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res, next) => {
  try {
    let query = {};

    // University users can only see their own students
    if (req.user.role === 'university') {
      query.universityId = req.user.universityId;
    }

    // Student users can only see themselves
    if (req.user.role === 'student') {
      query.userId = req.user._id;
    }

    // Filter by university if provided in query
    if (req.query.universityId) {
      query.universityId = req.query.universityId;
    }

    // Filter by course if provided
    if (req.query.course) {
      query.course = { $regex: req.query.course, $options: 'i' };
    }

    // Search by name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('universityId', 'name location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      'universityId',
      'name location'
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // University users can only view their own students
    if (
      req.user.role === 'university' &&
      student.universityId._id.toString() !== req.user.universityId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this student',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private (admin, university)
const createStudent = async (req, res, next) => {
  try {
    // If university user, auto-assign their universityId
    if (req.user.role === 'university') {
      req.body.universityId = req.user.universityId;
    }

    const student = await Student.create(req.body);

    const populated = await Student.findById(student._id).populate(
      'universityId',
      'name location'
    );

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (admin, university)
const updateStudent = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // University users can only update their own students
    if (
      req.user.role === 'university' &&
      student.universityId.toString() !== req.user.universityId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this student',
      });
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('universityId', 'name location');

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (admin, university)
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // University users can only delete their own students
    if (
      req.user.role === 'university' &&
      student.universityId.toString() !== req.user.universityId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this student',
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Student deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk upload students from CSV
// @route   POST /api/students/bulk-upload
// @access  Private (admin, university)
const bulkUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a CSV file',
      });
    }

    const students = [];
    const errors = [];

    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
          // Map CSV columns to student fields
          const student = {
            name: row.name || row.Name,
            email: row.email || row.Email,
            course: row.course || row.Course,
            marks: parseFloat(row.marks || row.Marks) || 0,
            skills: (row.skills || row.Skills || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            universityId:
              req.user.role === 'university'
                ? req.user.universityId
                : row.universityId,
            isPlaced:
              (row.isPlaced || row.IsPlaced || 'false').toLowerCase() ===
              'true',
            placementCompany: row.placementCompany || row.PlacementCompany || null,
          };
          students.push(student);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Insert students, collecting errors for invalid ones
    const results = [];
    for (const studentData of students) {
      try {
        const student = await Student.create(studentData);
        results.push(student);
      } catch (err) {
        errors.push({
          data: studentData,
          error: err.message,
        });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: `${results.length} students uploaded successfully`,
      data: {
        uploaded: results.length,
        failed: errors.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  bulkUpload,
};
