const Branch = require('../models/Branch');
const User = require('../models/User');
const { sendNotificationToBranch } = require('../utils/notifications');

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true })
      .populate('officers.user', 'firstName lastName profileImage')
      .select('-memberRequests');

    res.json({
      success: true,
      count: branches.length,
      data: branches
    });
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching branches'
    });
  }
};

// @desc    Get single branch
// @route   GET /api/branches/:id
// @access  Public
const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id)
      .populate('officers.user', 'firstName lastName profileImage position')
      .populate('members', 'firstName lastName profileImage role')
      .populate('memberRequests.user', 'firstName lastName email phone');

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.json({
      success: true,
      data: branch
    });
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching branch'
    });
  }
};

// @desc    Create new branch
// @route   POST /api/branches
// @access  Private (Admin/Executive)
const createBranch = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      maxMembers,
      meetingSchedule,
      contactInfo
    } = req.body;

    // Check if branch name already exists
    const existingBranch = await Branch.findOne({ name });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'Branch with this name already exists'
      });
    }

    const branch = await Branch.create({
      name,
      description,
      location,
      maxMembers: maxMembers || 50,
      meetingSchedule,
      contactInfo,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch
    });
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating branch'
    });
  }
};

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private (Admin/Executive/Branch Officer)
const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isExecutive = req.user.role === 'executive';
    const isBranchOfficer = req.user.role === 'branch_officer' && 
                           branch.officers.some(officer => officer.user.equals(req.user.id));

    if (!isAdmin && !isExecutive && !isBranchOfficer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this branch'
      });
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('officers.user', 'firstName lastName profileImage');

    res.json({
      success: true,
      message: 'Branch updated successfully',
      data: updatedBranch
    });
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating branch'
    });
  }
};

// @desc    Request branch membership
// @route   POST /api/branches/:id/request
// @access  Private
const requestBranchMembership = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Check if user already has a branch
    if (req.user.branch) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of a branch'
      });
    }

    // Check if user already has a pending request
    const existingRequest = branch.memberRequests.find(
      request => request.user.equals(req.user.id) && request.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this branch'
      });
    }

    // Add membership request
    branch.addMemberRequest(req.user.id);
    await branch.save();

    // Update user's branch request
    await User.findByIdAndUpdate(req.user.id, {
      branchRequest: branch._id
    });

    // Notify branch officers
    try {
      await sendNotificationToBranch(
        branch._id,
        'New Membership Request',
        `${req.user.fullName} has requested to join ${branch.name}`,
        {
          type: 'membership_request',
          branchId: branch._id,
          userId: req.user.id
        }
      );
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.json({
      success: true,
      message: 'Membership request submitted successfully'
    });
  } catch (error) {
    console.error('Request membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting membership request'
    });
  }
};

// @desc    Approve member request
// @route   PUT /api/branches/:id/approve/:requestId
// @access  Private (Branch Officer/Admin/Executive)
const approveMemberRequest = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isExecutive = req.user.role === 'executive';
    const isBranchOfficer = req.user.role === 'branch_officer' && 
                           branch.officers.some(officer => officer.user.equals(req.user.id));

    if (!isAdmin && !isExecutive && !isBranchOfficer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve membership requests'
      });
    }

    // Approve the request
    branch.approveMemberRequest(req.params.requestId, req.user.id);
    await branch.save();

    // Update user's branch
    const request = branch.memberRequests.id(req.params.requestId);
    if (request) {
      await User.findByIdAndUpdate(request.user, {
        branch: branch._id,
        branchRequest: null
      });

      // Notify the user
      try {
        await sendNotificationToUser(
          request.user,
          'Membership Approved',
          `Your request to join ${branch.name} has been approved!`,
          {
            type: 'membership_approved',
            branchId: branch._id
          }
        );
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    }

    res.json({
      success: true,
      message: 'Membership request approved successfully'
    });
  } catch (error) {
    console.error('Approve membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while approving membership request'
    });
  }
};

// @desc    Reject member request
// @route   PUT /api/branches/:id/reject/:requestId
// @access  Private (Branch Officer/Admin/Executive)
const rejectMemberRequest = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isExecutive = req.user.role === 'executive';
    const isBranchOfficer = req.user.role === 'branch_officer' && 
                           branch.officers.some(officer => officer.user.equals(req.user.id));

    if (!isAdmin && !isExecutive && !isBranchOfficer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject membership requests'
      });
    }

    const { notes } = req.body;

    // Reject the request
    branch.rejectMemberRequest(req.params.requestId, req.user.id, notes);
    await branch.save();

    // Update user's branch request
    const request = branch.memberRequests.id(req.params.requestId);
    if (request) {
      await User.findByIdAndUpdate(request.user, {
        branchRequest: null
      });

      // Notify the user
      try {
        await sendNotificationToUser(
          request.user,
          'Membership Request Rejected',
          `Your request to join ${branch.name} has been rejected. ${notes ? 'Reason: ' + notes : ''}`,
          {
            type: 'membership_rejected',
            branchId: branch._id
          }
        );
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    }

    res.json({
      success: true,
      message: 'Membership request rejected successfully'
    });
  } catch (error) {
    console.error('Reject membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting membership request'
    });
  }
};

// @desc    Get branch statistics
// @route   GET /api/branches/:id/stats
// @access  Private (Branch Officer/Admin/Executive)
const getBranchStats = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isExecutive = req.user.role === 'executive';
    const isBranchOfficer = req.user.role === 'branch_officer' && 
                           branch.officers.some(officer => officer.user.equals(req.user.id));

    if (!isAdmin && !isExecutive && !isBranchOfficer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view branch statistics'
      });
    }

    const stats = {
      totalMembers: branch.members.length,
      activeMembers: branch.members.length, // You can add logic to determine active members
      pendingRequests: branch.memberRequests.filter(req => req.status === 'pending').length,
      totalOfficers: branch.officers.length,
      maxMembers: branch.maxMembers,
      memberUtilization: (branch.members.length / branch.maxMembers) * 100
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get branch stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching branch statistics'
    });
  }
};

module.exports = {
  getBranches,
  getBranch,
  createBranch,
  updateBranch,
  requestBranchMembership,
  approveMemberRequest,
  rejectMemberRequest,
  getBranchStats
};
