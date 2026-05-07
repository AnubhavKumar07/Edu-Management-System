// Announcement controller — admin-to-university communication
const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res, next) => {
  try {
    let query = {};

    // University users see only announcements targeted to them (or broadcast)
    if (req.user.role === 'university' && req.user.universityId) {
      query = {
        $or: [
          { targetUniversities: { $size: 0 } }, // Broadcast
          { targetUniversities: req.user.universityId }, // Targeted
        ],
      };
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .populate('targetUniversities', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (admin)
const createAnnouncement = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;

    const announcement = await Announcement.create(req.body);

    const populated = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name')
      .populate('targetUniversities', 'name');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (admin)
const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };
