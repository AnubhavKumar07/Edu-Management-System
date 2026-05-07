// University controller — CRUD with student counts
const University = require('../models/University');
const Student = require('../models/Student');

// @desc    Get all universities
// @route   GET /api/universities
// @access  Private
const getUniversities = async (req, res, next) => {
  try {
    let query = {};

    // Search by name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Filter by location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    const universities = await University.find(query)
      .populate('studentCount')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: universities.length,
      data: universities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single university
// @route   GET /api/universities/:id
// @access  Private
const getUniversity = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id).populate(
      'studentCount'
    );

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
      });
    }

    res.status(200).json({
      success: true,
      data: university,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create university
// @route   POST /api/universities
// @access  Private (admin)
const createUniversity = async (req, res, next) => {
  try {
    const university = await University.create(req.body);

    res.status(201).json({
      success: true,
      data: university,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update university
// @route   PUT /api/universities/:id
// @access  Private (admin)
const updateUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
      });
    }

    res.status(200).json({
      success: true,
      data: university,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete university
// @route   DELETE /api/universities/:id
// @access  Private (admin)
const deleteUniversity = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
      });
    }

    // Check if university has students
    const studentCount = await Student.countDocuments({
      universityId: req.params.id,
    });

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — university has ${studentCount} students. Remove students first.`,
      });
    }

    await University.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'University deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUniversities,
  getUniversity,
  createUniversity,
  updateUniversity,
  deleteUniversity,
};
