const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Branch name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Branch name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Branch description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Branch address is required']
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required']
      }
    },
    region: {
      type: String,
      required: [true, 'Region is required']
    }
  },
  officers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    position: {
      type: String,
      required: true,
      enum: ['president', 'vice_president', 'secretary', 'treasurer', 'organizer']
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  memberRequests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    notes: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  maxMembers: {
    type: Number,
    default: 50
  },
  meetingSchedule: {
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    time: String,
    venue: String
  },
  contactInfo: {
    phone: String,
    email: String,
    socialMedia: {
      facebook: String,
      whatsapp: String,
      instagram: String
    }
  },
  statistics: {
    totalMembers: {
      type: Number,
      default: 0
    },
    activeMembers: {
      type: Number,
      default: 0
    },
    totalEvents: {
      type: Number,
      default: 0
    },
    totalPayments: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
branchSchema.index({ name: 1 });
branchSchema.index({ 'location.region': 1 });
branchSchema.index({ isActive: 1 });

// Virtual for member count
branchSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for pending requests count
branchSchema.virtual('pendingRequestsCount').get(function() {
  return this.memberRequests.filter(request => request.status === 'pending').length;
});

// Method to add member
branchSchema.methods.addMember = function(userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    this.statistics.totalMembers = this.members.length;
    this.statistics.activeMembers = this.members.length;
  }
};

// Method to remove member
branchSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => !member.equals(userId));
  this.statistics.totalMembers = this.members.length;
  this.statistics.activeMembers = this.members.length;
};

// Method to add member request
branchSchema.methods.addMemberRequest = function(userId) {
  const existingRequest = this.memberRequests.find(
    request => request.user.equals(userId) && request.status === 'pending'
  );
  
  if (!existingRequest) {
    this.memberRequests.push({ user: userId });
  }
};

// Method to approve member request
branchSchema.methods.approveMemberRequest = function(requestId, reviewedBy) {
  const request = this.memberRequests.id(requestId);
  if (request && request.status === 'pending') {
    request.status = 'approved';
    request.reviewedBy = reviewedBy;
    request.reviewedAt = new Date();
    this.addMember(request.user);
  }
};

// Method to reject member request
branchSchema.methods.rejectMemberRequest = function(requestId, reviewedBy, notes) {
  const request = this.memberRequests.id(requestId);
  if (request && request.status === 'pending') {
    request.status = 'rejected';
    request.reviewedBy = reviewedBy;
    request.reviewedAt = new Date();
    if (notes) request.notes = notes;
  }
};

// Ensure virtual fields are serialized
branchSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Branch', branchSchema);
