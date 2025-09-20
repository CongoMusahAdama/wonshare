const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'Branch is required']
  },
  type: {
    type: String,
    required: [true, 'Payment type is required'],
    enum: ['attire_fee', 'donation', 'event_fee', 'membership_fee', 'other']
  },
  category: {
    type: String,
    enum: ['partial', 'half', 'full'],
    required: function() {
      return this.type === 'attire_fee';
    }
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'GHS',
    enum: ['GHS', 'USD']
  },
  description: {
    type: String,
    required: [true, 'Payment description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  paystackReference: {
    type: String,
    unique: true,
    sparse: true
  },
  paystackTransactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'mobile_money', 'bank_transfer', 'cash'],
    default: 'mobile_money'
  },
  metadata: {
    phone: String,
    email: String,
    cardLast4: String,
    cardBrand: String,
    bankName: String,
    accountNumber: String
  },
  receipt: {
    url: String,
    filename: String,
    uploadedAt: Date
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date,
  refundReason: String,
  refundedAt: Date,
  refundedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
paymentSchema.index({ user: 1 });
paymentSchema.index({ branch: 1 });
paymentSchema.index({ type: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paystackReference: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} ${this.amount.toFixed(2)}`;
});

// Virtual for payment status color
paymentSchema.virtual('statusColor').get(function() {
  const colors = {
    pending: 'orange',
    processing: 'blue',
    completed: 'green',
    failed: 'red',
    cancelled: 'gray',
    refunded: 'purple'
  };
  return colors[this.status] || 'gray';
});

// Method to mark as completed
paymentSchema.methods.markAsCompleted = function(processedBy) {
  this.status = 'completed';
  this.processedBy = processedBy;
  this.processedAt = new Date();
};

// Method to mark as failed
paymentSchema.methods.markAsFailed = function(reason) {
  this.status = 'failed';
  this.notes = reason;
};

// Method to process refund
paymentSchema.methods.processRefund = function(refundedBy, reason) {
  this.status = 'refunded';
  this.refundedBy = refundedBy;
  this.refundedAt = new Date();
  this.refundReason = reason;
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function(branchId, startDate, endDate) {
  const matchStage = {
    branch: mongoose.Types.ObjectId(branchId),
    status: 'completed'
  };
  
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        averageAmount: { $avg: '$amount' }
      }
    }
  ]);
  
  return stats;
};

// Static method to get user payment history
paymentSchema.statics.getUserPaymentHistory = async function(userId, limit = 10) {
  return await this.find({ user: userId })
    .populate('branch', 'name')
    .populate('event', 'title date')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Pre-save middleware to validate payment
paymentSchema.pre('save', function(next) {
  // Validate attire fee category
  if (this.type === 'attire_fee' && !this.category) {
    return next(new Error('Category is required for attire fees'));
  }
  
  // Validate amount based on category
  if (this.type === 'attire_fee' && this.category) {
    const baseAmount = 100; // Base attire fee amount
    const multipliers = {
      partial: 0.25,
      half: 0.5,
      full: 1.0
    };
    
    const expectedAmount = baseAmount * multipliers[this.category];
    if (Math.abs(this.amount - expectedAmount) > 0.01) {
      return next(new Error(`Amount does not match expected ${this.category} attire fee`));
    }
  }
  
  next();
});

// Ensure virtual fields are serialized
paymentSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Payment', paymentSchema);
