const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['enrolled', 'dropped', 'completed', 'failed'],
    default: 'enrolled'
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'P', 'NP', null], // allow null
    default: null
  },
  attendance: {
    totalClasses: {
      type: Number,
      default: 0
    },
    attendedClasses: {
      type: Number,
      default: 0
    },
    attendancePercentage: {
      type: Number,
      default: 0
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique enrollment per student-course combination
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Index for better query performance
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ status: 1 });

// Virtual for attendance percentage calculation
enrollmentSchema.virtual('calculatedAttendancePercentage').get(function() {
  if (this.attendance.totalClasses === 0) return 0;
  return Math.round((this.attendance.attendedClasses / this.attendance.totalClasses) * 100);
});

// Pre-save middleware to update attendance percentage
enrollmentSchema.pre('save', function(next) {
  if (this.attendance.totalClasses > 0) {
    this.attendance.attendancePercentage = this.calculatedAttendancePercentage;
  }
  next();
});

// Ensure virtual fields are serialized
enrollmentSchema.set('toJSON', { virtuals: true });
enrollmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
