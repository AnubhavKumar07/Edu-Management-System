// University model — represents a university entity
const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add university name'],
      unique: true,
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please add location'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: get student count for this university
universitySchema.virtual('studentCount', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'universityId',
  count: true,
});

module.exports = mongoose.model('University', universitySchema);
