const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getBranches,
  getBranch,
  createBranch,
  updateBranch,
  requestBranchMembership,
  approveMemberRequest,
  rejectMemberRequest,
  getBranchStats
} = require('../controllers/branchController');
const { protect, isBranchOfficerOrHigher, isExecutiveOrHigher, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Public routes
router.get('/', getBranches);
router.get('/:id', getBranch);

// Protected routes
router.use(protect); // All routes below this middleware are protected

// Branch management routes
router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Branch name must be between 2 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    body('location.address')
      .trim()
      .notEmpty()
      .withMessage('Branch address is required'),
    body('location.coordinates.latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Valid latitude is required'),
    body('location.coordinates.longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Valid longitude is required'),
    body('location.region')
      .trim()
      .notEmpty()
      .withMessage('Region is required'),
  ],
  handleValidationErrors,
  isExecutiveOrHigher,
  createBranch
);

router.put(
  '/:id',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Branch name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
  ],
  handleValidationErrors,
  updateBranch
);

// Membership request routes
router.post('/:id/request', requestBranchMembership);

router.put(
  '/:id/approve/:requestId',
  isBranchOfficerOrHigher,
  approveMemberRequest
);

router.put(
  '/:id/reject/:requestId',
  [
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Notes cannot exceed 200 characters'),
  ],
  handleValidationErrors,
  isBranchOfficerOrHigher,
  rejectMemberRequest
);

// Statistics route
router.get('/:id/stats', isBranchOfficerOrHigher, getBranchStats);

module.exports = router;
