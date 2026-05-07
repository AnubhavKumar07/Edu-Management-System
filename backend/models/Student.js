// Student model — stores academic data linked to a university
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add student name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add student email'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    course: {
      type: String,
      required: [true, 'Please add a course'],
      trim: true,
    },
    marks: {
      type: Number,
      required: [true, 'Please add marks'],
      min: [0, 'Marks cannot be negative'],
      max: [100, 'Marks cannot exceed 100'],
    },
    skills: {
      type: [String],
      default: [],
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'Please add university'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Optional placement data
    isPlaced: {
      type: Boolean,
      default: false,
    },
    placementCompany: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: calculate grade from marks
studentSchema.virtual('grade').get(function () {
  if (this.marks >= 90) return 'A+';
  if (this.marks >= 80) return 'A';
  if (this.marks >= 70) return 'B+';
  if (this.marks >= 60) return 'B';
  if (this.marks >= 50) return 'C';
  if (this.marks >= 40) return 'D';
  return 'F';
});

module.exports = mongoose.model('Student', studentSchema);
