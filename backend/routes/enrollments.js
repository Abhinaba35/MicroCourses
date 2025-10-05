const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { authenticateToken, requireUser, requireInstructor } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/enrollments
// @desc    Enroll student in a course
// @access  Private (Student/Admin only)
router.post('/', authenticateToken, [
  body('courseId').isMongoId().withMessage('Valid course ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { courseId } = req.body;
    const studentId = req.user._id;

    // Check if user is a student or admin
    if (req.user.role !== 'student' && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only students can enroll in courses'
      });
    }

    // Check if course exists and is active
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({
        message: 'Course not found or inactive'
      });
    }

    // Check if course is open for enrollment
    if (course.status !== 'open') {
      return res.status(400).json({
        message: 'Course is not open for enrollment'
      });
    }

    // Check if course is full
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({
        message: 'Course is full'
      });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      isActive: true
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: studentId,
      course: courseId
    });

    await enrollment.save();

    // Add student to course's enrolled students
    course.enrolledStudents.push(studentId);
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(studentId, {
      $addToSet: { enrolledCourses: courseId }
    });

    // Populate the enrollment
    await enrollment.populate([
      { path: 'student', select: 'firstName lastName email studentId' },
      { path: 'course', select: 'title code credits department' }
    ]);

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    // Send the error message in the response for easier debugging
    res.status(500).json({
      message: 'Server error during enrollment',
      error: error.message || error.toString()
    });
  }
});

// @route   DELETE /api/enrollments/:enrollmentId
// @desc    Drop course enrollment
// @access  Private (Student/Admin only)
router.delete('/:enrollmentId', authenticateToken, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) {
      return res.status(404).json({
        message: 'Enrollment not found'
      });
    }

    // Check if user is the student or admin
    if (req.user.role !== 'admin' && enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to drop this enrollment'
      });
    }

    // Update enrollment status
    enrollment.status = 'dropped';
    enrollment.isActive = false;
    await enrollment.save();

    // Remove student from course's enrolled students
    await Course.findByIdAndUpdate(enrollment.course, {
      $pull: { enrolledStudents: enrollment.student }
    });

    // Remove course from user's enrolled courses
    await User.findByIdAndUpdate(enrollment.student, {
      $pull: { enrolledCourses: enrollment.course }
    });

    res.json({
      message: 'Successfully dropped from course'
    });
  } catch (error) {
    console.error('Drop enrollment error:', error);
    res.status(500).json({
      message: 'Server error during course drop'
    });
  }
});

// @route   GET /api/enrollments/student/:studentId
// @desc    Get student's enrollments
// @access  Private
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if user is the student, instructor, or admin
    if (req.user.role !== 'admin' && req.user.role !== 'instructor' && studentId !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to view these enrollments'
      });
    }

    const enrollments = await Enrollment.find({
      student: studentId,
      isActive: true
    })
    .populate('course', 'title code credits department instructor schedule semester year')
    .populate('course.instructor', 'firstName lastName email')
    .sort({ enrollmentDate: -1 });

    res.json({ enrollments });
  } catch (error) {
    console.error('Get student enrollments error:', error);
    res.status(500).json({
      message: 'Server error while fetching enrollments'
    });
  }
});

// @route   GET /api/enrollments/course/:courseId
// @desc    Get course enrollments
// @access  Private (Instructor/Admin only)
router.get('/course/:courseId', authenticateToken, requireInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user is the instructor or admin
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to view these enrollments'
      });
    }

    const enrollments = await Enrollment.find({
      course: courseId,
      isActive: true
    })
    .populate('student', 'firstName lastName email studentId department year')
    .sort({ enrollmentDate: -1 });

    res.json({ enrollments });
  } catch (error) {
    console.error('Get course enrollments error:', error);
    res.status(500).json({
      message: 'Server error while fetching enrollments'
    });
  }
});

// @route   PUT /api/enrollments/:enrollmentId/grade
// @desc    Update student grade
// @access  Private (Instructor/Admin only)
router.put('/:enrollmentId/grade', authenticateToken, requireInstructor, [
  body('grade').isIn(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'P', 'NP']).withMessage('Invalid grade')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { grade } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate('course', 'instructor');

    if (!enrollment) {
      return res.status(404).json({
        message: 'Enrollment not found'
      });
    }

    // Check if user is the instructor or admin
    if (req.user.role !== 'admin' && enrollment.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to update this grade'
      });
    }

    enrollment.grade = grade;
    await enrollment.save();

    res.json({
      message: 'Grade updated successfully',
      enrollment
    });
  } catch (error) {
    console.error('Update grade error:', error);
    res.status(500).json({
      message: 'Server error while updating grade'
    });
  }
});

// @route   PUT /api/enrollments/:enrollmentId/attendance
// @desc    Update student attendance
// @access  Private (Instructor/Admin only)
router.put('/:enrollmentId/attendance', authenticateToken, requireInstructor, [
  body('totalClasses').isInt({ min: 0 }).withMessage('Total classes must be a non-negative integer'),
  body('attendedClasses').isInt({ min: 0 }).withMessage('Attended classes must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { totalClasses, attendedClasses } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate('course', 'instructor');

    if (!enrollment) {
      return res.status(404).json({
        message: 'Enrollment not found'
      });
    }

    // Check if user is the instructor or admin
    if (req.user.role !== 'admin' && enrollment.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to update this attendance'
      });
    }

    // Validate attendance data
    if (attendedClasses > totalClasses) {
      return res.status(400).json({
        message: 'Attended classes cannot exceed total classes'
      });
    }

    enrollment.attendance.totalClasses = totalClasses;
    enrollment.attendance.attendedClasses = attendedClasses;
    await enrollment.save();

    res.json({
      message: 'Attendance updated successfully',
      enrollment
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      message: 'Server error while updating attendance'
    });
  }
});

module.exports = router;
