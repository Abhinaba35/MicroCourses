const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Course = require('../models/Course');
const User = require('../models/User');
const { authenticateToken, requireInstructor, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses with optional filtering
// @access  Public
router.get('/', [
  query('department').optional().trim(),
  query('semester').optional().isIn(['Fall', 'Spring', 'Summer']),
  query('year').optional().isInt({ min: 2020 }),
  query('status').optional().isIn(['open', 'closed', 'cancelled']),
  query('instructor').optional().isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      department,
      semester,
      year,
      status,
      instructor,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (year) filter.year = parseInt(year);
    if (status) filter.status = status;
    if (instructor) filter.instructor = instructor;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get courses with pagination
    const courses = await Course.find(filter)
      .populate('instructor', 'firstName lastName email')
      .populate('prerequisites', 'title code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Course.countDocuments(filter);

    res.json({
      courses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      message: 'Server error while fetching courses'
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email department')
      .populate('prerequisites', 'title code description')
      .populate('enrolledStudents', 'firstName lastName email studentId');

    if (!course) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      message: 'Server error while fetching course'
    });
  }
});

// @route   POST /api/courses
// @desc    Create new course
// @access  Private (Instructor/Admin only)
router.post('/', authenticateToken, requireInstructor, [
  body('title').trim().isLength({ min: 1 }).withMessage('Course title is required'),
  body('code').trim().matches(/^[A-Z]{2,4}\d{3,4}$/).withMessage('Course code must be in format like CS101'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('credits').isInt({ min: 1, max: 6 }).withMessage('Credits must be between 1 and 6'),
  body('department').trim().isLength({ min: 1 }).withMessage('Department is required'),
  body('maxStudents').isInt({ min: 1, max: 200 }).withMessage('Max students must be between 1 and 200'),
  body('semester').isIn(['Fall', 'Spring', 'Summer']).withMessage('Invalid semester'),
  body('year').isInt({ min: 2020 }).withMessage('Year must be 2020 or later'),
  body('schedule.days').isArray({ min: 1 }).withMessage('At least one day is required'),
  body('schedule.time.start').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time'),
  body('schedule.time.end').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const courseData = {
      ...req.body,
      instructor: req.user.role === 'admin' ? (req.body.instructor || req.user._id) : req.user._id
    };

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code: courseData.code });
    if (existingCourse) {
      return res.status(400).json({
        message: 'Course with this code already exists'
      });
    }

    const course = new Course(courseData);
    await course.save();

    // Populate the created course
    await course.populate('instructor', 'firstName lastName email');

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      message: 'Server error while creating course'
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Instructor/Admin only)
router.put('/:id', authenticateToken, requireInstructor, [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Course title cannot be empty'),
  body('code').optional().trim().matches(/^[A-Z]{2,4}\d{3,4}$/).withMessage('Course code must be in format like CS101'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('credits').optional().isInt({ min: 1, max: 6 }).withMessage('Credits must be between 1 and 6'),
  body('department').optional().trim().isLength({ min: 1 }).withMessage('Department cannot be empty'),
  body('maxStudents').optional().isInt({ min: 1, max: 200 }).withMessage('Max students must be between 1 and 200'),
  body('semester').optional().isIn(['Fall', 'Spring', 'Summer']).withMessage('Invalid semester'),
  body('year').optional().isInt({ min: 2020 }).withMessage('Year must be 2020 or later'),
  body('status').optional().isIn(['open', 'closed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    // Check if user is the instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to update this course'
      });
    }

    // Check if course code is being changed and if it already exists
    if (req.body.code && req.body.code !== course.code) {
      const existingCourse = await Course.findOne({ code: req.body.code });
      if (existingCourse) {
        return res.status(400).json({
          message: 'Course with this code already exists'
        });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName email');

    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      message: 'Server error while updating course'
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    // Soft delete by setting isActive to false
    course.isActive = false;
    await course.save();

    res.json({
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      message: 'Server error while deleting course'
    });
  }
});

// @route   GET /api/courses/instructor/:instructorId
// @desc    Get courses by instructor
// @access  Public
router.get('/instructor/:instructorId', async (req, res) => {
  try {
    const courses = await Course.find({ 
      instructor: req.params.instructorId,
      isActive: true 
    })
    .populate('instructor', 'firstName lastName email')
    .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({
      message: 'Server error while fetching instructor courses'
    });
  }
});

module.exports = router;
