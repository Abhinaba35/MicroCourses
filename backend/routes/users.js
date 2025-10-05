const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, requireAdmin, requireInstructor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/', authenticateToken, requireAdmin, [
  query('role').optional().isIn(['student', 'instructor', 'admin']),
  query('department').optional().trim(),
  query('year').optional().isIn(['1st', '2nd', '3rd', '4th', 'Graduate']),
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
      role,
      department,
      year,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (year) filter.year = year;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password')
      .populate('enrolledCourses', 'title code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Server error while fetching users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses', 'title code credits department');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check if user is authorized to view this profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        message: 'Not authorized to view this profile'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Server error while fetching user'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('role').optional().isIn(['student', 'instructor', 'admin']).withMessage('Invalid role'),
  body('studentId').optional().trim(),
  body('department').optional().trim(),
  body('year').optional().isIn(['1st', '2nd', '3rd', '4th', 'Graduate']).withMessage('Invalid year'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({
          message: 'User with this email already exists'
        });
      }
    }

    // Check if studentId is being changed and if it already exists
    if (req.body.studentId && req.body.studentId !== user.studentId) {
      const existingStudentId = await User.findOne({ studentId: req.body.studentId });
      if (existingStudentId) {
        return res.status(400).json({
          message: 'Student ID already exists'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      message: 'Server error while updating user'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: 'Cannot delete your own account'
      });
    }

    // Soft delete by setting isActive to false
    user.isActive = false;
    await user.save();

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: 'Server error while deleting user'
    });
  }
});

// @route   GET /api/users/students/enrolled/:courseId
// @desc    Get students enrolled in a specific course
// @access  Private (Instructor/Admin only)
router.get('/students/enrolled/:courseId', authenticateToken, requireInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;

    const students = await User.find({
      enrolledCourses: courseId,
      role: 'student',
      isActive: true
    })
    .select('firstName lastName email studentId department year')
    .sort({ lastName: 1, firstName: 1 });

    res.json({ students });
  } catch (error) {
    console.error('Get enrolled students error:', error);
    res.status(500).json({
      message: 'Server error while fetching enrolled students'
    });
  }
});

// @route   GET /api/users/instructors
// @desc    Get all instructors
// @access  Public
router.get('/instructors', async (req, res) => {
  try {
    const instructors = await User.find({
      role: 'instructor',
      isActive: true
    })
    .select('firstName lastName email department')
    .sort({ lastName: 1, firstName: 1 });

    res.json({ instructors });
  } catch (error) {
    console.error('Get instructors error:', error);
    res.status(500).json({
      message: 'Server error while fetching instructors'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics (Admin only)
// @access  Private (Admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalInstructors = await User.countDocuments({ role: 'instructor', isActive: true });
    const totalAdmins = await User.countDocuments({ role: 'admin', isActive: true });

    // Get department-wise student count
    const departmentStats = await User.aggregate([
      { $match: { role: 'student', isActive: true, department: { $exists: true, $ne: null } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get year-wise student count
    const yearStats = await User.aggregate([
      { $match: { role: 'student', isActive: true, year: { $exists: true, $ne: null } } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
      totalAdmins,
      departmentStats,
      yearStats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching user statistics'
    });
  }
});

// @route   POST /api/users/create-instructor
// @desc    Admin creates a new instructor with email and password
// @access  Private (Admin only)
router.post('/create-instructor', authenticateToken, requireAdmin, [
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('department').trim().isLength({ min: 1 }).withMessage('Department is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const { firstName, lastName, email, password, department } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }
    // Create instructor
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      department,
      role: 'instructor',
      isActive: true
    });
    await user.save();
    res.status(201).json({
      message: 'Instructor created successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Create instructor error:', error);
    res.status(500).json({
      message: 'Server error while creating instructor'
    });
  }
});

module.exports = router;
