// Analytics controller — provides data insights for the admin dashboard
const Student = require('../models/Student');
const University = require('../models/University');
const User = require('../models/User');

// @desc    Get overview stats
// @route   GET /api/analytics/overview
// @access  Private (admin)
const getOverview = async (req, res, next) => {
  try {
    const [totalStudents, totalUniversities, totalUsers] = await Promise.all([
      Student.countDocuments(),
      University.countDocuments(),
      User.countDocuments(),
    ]);

    // Calculate average marks
    const avgResult = await Student.aggregate([
      { $group: { _id: null, avgMarks: { $avg: '$marks' } } },
    ]);
    const avgMarks = avgResult.length > 0 ? Math.round(avgResult[0].avgMarks * 100) / 100 : 0;

    // Placement stats
    const placedCount = await Student.countDocuments({ isPlaced: true });
    const placementRate =
      totalStudents > 0
        ? Math.round((placedCount / totalStudents) * 100 * 100) / 100
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalUniversities,
        totalUsers,
        avgMarks,
        placedCount,
        placementRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course-wise distribution
// @route   GET /api/analytics/course-distribution
// @access  Private (admin, university)
const getCourseDistribution = async (req, res, next) => {
  try {
    let matchStage = {};

    // University users see only their data
    if (req.user.role === 'university' && req.user.universityId) {
      matchStage = { universityId: req.user.universityId };
    }

    // Optional filter by university
    if (req.query.universityId) {
      const mongoose = require('mongoose');
      matchStage.universityId = new mongoose.Types.ObjectId(req.query.universityId);
    }

    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 },
          avgMarks: { $avg: '$marks' },
        },
      },
      { $sort: { count: -1 } },
    ];

    const distribution = await Student.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: distribution.map((d) => ({
        course: d._id,
        count: d.count,
        avgMarks: Math.round(d.avgMarks * 100) / 100,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get university-wise comparison
// @route   GET /api/analytics/university-comparison
// @access  Private (admin)
const getUniversityComparison = async (req, res, next) => {
  try {
    const comparison = await Student.aggregate([
      {
        $group: {
          _id: '$universityId',
          totalStudents: { $sum: 1 },
          avgMarks: { $avg: '$marks' },
          placedCount: {
            $sum: { $cond: ['$isPlaced', 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'universities',
          localField: '_id',
          foreignField: '_id',
          as: 'university',
        },
      },
      { $unwind: '$university' },
      {
        $project: {
          universityName: '$university.name',
          location: '$university.location',
          totalStudents: 1,
          avgMarks: { $round: ['$avgMarks', 2] },
          placedCount: 1,
          placementRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$placedCount', '$totalStudents'] },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
      { $sort: { totalStudents: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skills distribution
// @route   GET /api/analytics/skills
// @access  Private (admin, university)
const getSkillsDistribution = async (req, res, next) => {
  try {
    let matchStage = {};

    if (req.user.role === 'university' && req.user.universityId) {
      matchStage = { universityId: req.user.universityId };
    }

    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ];

    const skills = await Student.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: skills.map((s) => ({
        skill: s._id,
        count: s.count,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get performance trends (marks distribution)
// @route   GET /api/analytics/performance-trends
// @access  Private (admin, university)
const getPerformanceTrends = async (req, res, next) => {
  try {
    let matchStage = {};

    if (req.user.role === 'university' && req.user.universityId) {
      matchStage = { universityId: req.user.universityId };
    }

    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $bucket: {
          groupBy: '$marks',
          boundaries: [0, 20, 40, 60, 80, 100, 101],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            students: { $push: '$name' },
          },
        },
      },
    ];

    const trends = await Student.aggregate(pipeline);

    // Map bucket boundaries to labels
    const labels = ['0-19', '20-39', '40-59', '60-79', '80-99', '100'];
    const formattedTrends = trends.map((t, i) => ({
      range: labels[i] || `${t._id}+`,
      count: t.count,
    }));

    res.status(200).json({
      success: true,
      data: formattedTrends,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getCourseDistribution,
  getUniversityComparison,
  getSkillsDistribution,
  getPerformanceTrends,
};
