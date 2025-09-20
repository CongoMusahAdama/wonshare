const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Event title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['masquerade', 'meeting', 'fundraiser', 'social', 'training', 'other']
  },
  category: {
    type: String,
    enum: ['society_wide', 'branch_specific'],
    default: 'society_wide'
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: function() {
      return this.category === 'branch_specific';
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event organizer is required']
  },
  date: {
    start: {
      type: Date,
      required: [true, 'Event start date is required']
    },
    end: {
      type: Date,
      required: [true, 'Event end date is required']
    }
  },
  location: {
    name: {
      type: String,
      required: [true, 'Event location name is required']
    },
    address: {
      type: String,
      required: [true, 'Event address is required']
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
    }
  },
  route: {
    waypoints: [{
      latitude: Number,
      longitude: Number,
      name: String,
      order: Number
    }],
    isLive: {
      type: Boolean,
      default: false
    },
    currentLocation: {
      latitude: Number,
      longitude: Number,
      timestamp: Date
    }
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['attending', 'maybe', 'not_attending'],
      default: 'attending'
    },
    rsvpAt: {
      type: Date,
      default: Date.now
    },
    checkInAt: Date,
    location: {
      latitude: Number,
      longitude: Number
    }
  }],
  capacity: {
    type: Number,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  requiresPayment: {
    type: Boolean,
    default: false
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  attire: {
    type: String,
    enum: ['casual', 'formal', 'traditional', 'masquerade', 'uniform'],
    default: 'casual'
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  reminders: [{
    type: {
      type: String,
      enum: ['1_day', '1_hour', '30_minutes', 'custom'],
      required: true
    },
    sentAt: Date,
    recipients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  statistics: {
    totalRsvps: {
      type: Number,
      default: 0
    },
    attendingCount: {
      type: Number,
      default: 0
    },
    checkedInCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ branch: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ status: 1 });

// Virtual for attendance rate
eventSchema.virtual('attendanceRate').get(function() {
  if (this.statistics.totalRsvps === 0) return 0;
  return (this.statistics.attendingCount / this.statistics.totalRsvps) * 100;
});

// Method to add attendee
eventSchema.methods.addAttendee = function(userId, status = 'attending') {
  const existingAttendee = this.attendees.find(
    attendee => attendee.user.equals(userId)
  );
  
  if (existingAttendee) {
    existingAttendee.status = status;
    existingAttendee.rsvpAt = new Date();
  } else {
    this.attendees.push({ user: userId, status });
  }
  
  this.updateStatistics();
};

// Method to remove attendee
eventSchema.methods.removeAttendee = function(userId) {
  this.attendees = this.attendees.filter(
    attendee => !attendee.user.equals(userId)
  );
  this.updateStatistics();
};

// Method to check in attendee
eventSchema.methods.checkInAttendee = function(userId, location) {
  const attendee = this.attendees.find(
    attendee => attendee.user.equals(userId)
  );
  
  if (attendee) {
    attendee.checkInAt = new Date();
    if (location) {
      attendee.location = location;
    }
    this.updateStatistics();
  }
};

// Method to update statistics
eventSchema.methods.updateStatistics = function() {
  this.statistics.totalRsvps = this.attendees.length;
  this.statistics.attendingCount = this.attendees.filter(
    attendee => attendee.status === 'attending'
  ).length;
  this.statistics.checkedInCount = this.attendees.filter(
    attendee => attendee.checkInAt
  ).length;
};

// Method to start live tracking
eventSchema.methods.startLiveTracking = function() {
  this.route.isLive = true;
  this.status = 'ongoing';
};

// Method to stop live tracking
eventSchema.methods.stopLiveTracking = function() {
  this.route.isLive = false;
  this.status = 'completed';
};

// Method to update current location
eventSchema.methods.updateCurrentLocation = function(latitude, longitude) {
  this.route.currentLocation = {
    latitude,
    longitude,
    timestamp: new Date()
  };
};

// Pre-save middleware to update statistics
eventSchema.pre('save', function(next) {
  this.updateStatistics();
  next();
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Event', eventSchema);
