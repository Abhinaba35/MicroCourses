const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{2,4}\d{3,4}$/, 'Course code must be in format like CS101, MATH201']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    max: [6, 'Credits cannot exceed 6']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  maxStudents: {
    type: Number,
    required: [true, 'Maximum students is required'],
    min: [1, 'Maximum students must be at least 1'],
    max: [200, 'Maximum students cannot exceed 200']
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    time: {
      start: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      },
      end: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      }
    },
    room: {
      type: String,
      trim: true
    }
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: ['Fall', 'Spring', 'Summer']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [2020, 'Year must be 2020 or later']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'cancelled'],
    default: 'open'
  }
}, {
  timestamps: true
});

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function() {
  return Array.isArray(this.enrolledStudents) ? this.enrolledStudents.length : 0;
});

// Virtual for available spots
courseSchema.virtual('availableSpots').get(function() {
  return this.maxStudents - (Array.isArray(this.enrolledStudents) ? this.enrolledStudents.length : 0);
});

// Virtual for enrollment status
courseSchema.virtual('isFull').get(function() {
  return Array.isArray(this.enrolledStudents) ? this.enrolledStudents.length >= this.maxStudents : false;
});

// Ensure virtual fields are serialized
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

// Index for better query performance
courseSchema.index({ code: 1 });
courseSchema.index({ department: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ semester: 1, year: 1 });

module.exports = mongoose.model('Course', courseSchema);
