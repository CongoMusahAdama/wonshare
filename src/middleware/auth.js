const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// Check if user is branch officer or higher
const isBranchOfficerOrHigher = (req, res, next) => {
  const allowedRoles = ['branch_officer', 'executive', 'admin'];
  
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Branch officer role or higher required'
    });
  }

  next();
};

// Check if user is executive or higher
const isExecutiveOrHigher = (req, res, next) => {
  const allowedRoles = ['executive', 'admin'];
  
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Executive role or higher required'
    });
  }

  next();
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required'
    });
  }

  next();
};

// Check if user belongs to specific branch
const checkBranchAccess = (req, res, next) => {
  const branchId = req.params.branchId || req.body.branchId || req.query.branchId;

  if (!branchId) {
    return res.status(400).json({
      success: false,
      message: 'Branch ID is required'
    });
  }

  // Admin and executives can access any branch
  if (['admin', 'executive'].includes(req.user.role)) {
    return next();
  }

  // Branch officers and members can only access their own branch
  if (req.user.branch && req.user.branch.toString() === branchId.toString()) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. You can only access your own branch'
  });
};

// Check if user can manage specific branch
const checkBranchManagement = (req, res, next) => {
  const branchId = req.params.branchId || req.body.branchId || req.query.branchId;

  if (!branchId) {
    return res.status(400).json({
      success: false,
      message: 'Branch ID is required'
    });
  }

  // Admin and executives can manage any branch
  if (['admin', 'executive'].includes(req.user.role)) {
    return next();
  }

  // Branch officers can only manage their own branch
  if (req.user.role === 'branch_officer' && 
      req.user.branch && 
      req.user.branch.toString() === branchId.toString()) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. You can only manage your own branch'
  });
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token is invalid, but we continue without user
      req.user = null;
    }
  }

  next();
  
};

module.exports = {
  protect,
  authorize,
  isBranchOfficerOrHigher,
  isExecutiveOrHigher,
  isAdmin,
  checkBranchAccess,
  checkBranchManagement,
  optionalAuth
};
