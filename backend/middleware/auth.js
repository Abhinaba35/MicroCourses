const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token - user not found' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Account is deactivated' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired' 
      });
    }
    return res.status(500).json({ 
      message: 'Token verification failed' 
    });
  }
};

// Middleware to check user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = authorize('admin');

// Middleware to check if user is instructor or admin
const requireInstructor = authorize('instructor', 'admin');

// Middleware to check if user is student, instructor, or admin
const requireUser = authorize('student', 'instructor', 'admin');

module.exports = {
  authenticateToken,
  authorize,
  requireAdmin,
  requireInstructor,
  requireUser
};
