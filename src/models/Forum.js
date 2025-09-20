const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'Branch is required']
  },
  title: {
    type: String,
    required: [true, 'Forum title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowMemberPosts: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    allowAnonymous: {
      type: Boolean,
      default: false
    }
  },
  statistics: {
    totalPosts: {
      type: Number,
      default: 0
    },
    totalComments: {
      type: Number,
      default: 0
    },
    activeMembers: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  forum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
    required: [true, 'Forum is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  type: {
    type: String,
    enum: ['discussion', 'announcement', 'question', 'poll', 'event'],
    default: 'discussion'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'pending_approval', 'rejected'],
    default: 'published'
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
    filename: String,
    size: Number
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
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
      thumbnail: String
    }],
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      likedAt: {
        type: Date,
        default: Date.now
      }
    }],
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: [true, 'Reply content is required'],
        maxlength: [500, 'Reply cannot exceed 500 characters']
      },
      likes: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        likedAt: {
          type: Date,
          default: Date.now
        }
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: Date,
  rejectionReason: String
}, {
  timestamps: true
});

// Index for better query performance
forumSchema.index({ branch: 1 });
forumSchema.index({ isActive: 1 });

postSchema.index({ forum: 1 });
postSchema.index({ author: 1 });
postSchema.index({ type: 1 });
postSchema.index({ status: 1 });
postSchema.index({ isPinned: -1, createdAt: -1 });
postSchema.index({ 'likes.user': 1 });
postSchema.index({ tags: 1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for view count
postSchema.virtual('viewCount').get(function() {
  return this.views.length;
});

// Method to add like
postSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.equals(userId));
  if (!existingLike) {
    this.likes.push({ user: userId });
  }
};

// Method to remove like
postSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => !like.user.equals(userId));
};

// Method to add comment
postSchema.methods.addComment = function(authorId, content, media = []) {
  this.comments.push({
    author: authorId,
    content,
    media
  });
};

// Method to add reply to comment
postSchema.methods.addReplyToComment = function(commentIndex, authorId, content) {
  if (this.comments[commentIndex]) {
    this.comments[commentIndex].replies.push({
      author: authorId,
      content
    });
  }
};

// Method to add view
postSchema.methods.addView = function(userId) {
  const existingView = this.views.find(view => 
    view.user && view.user.equals(userId)
  );
  if (!existingView) {
    this.views.push({ user: userId });
  }
};

// Method to approve post
postSchema.methods.approvePost = function(approvedBy) {
  this.status = 'published';
  this.approvedBy = approvedBy;
  this.approvedAt = new Date();
};

// Method to reject post
postSchema.methods.rejectPost = function(rejectedBy, reason) {
  this.status = 'rejected';
  this.rejectedBy = rejectedBy;
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
};

// Method to pin/unpin post
postSchema.methods.togglePin = function() {
  this.isPinned = !this.isPinned;
};

// Method to lock/unlock post
postSchema.methods.toggleLock = function() {
  this.isLocked = !this.isLocked;
};

// Pre-save middleware to update forum statistics
postSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Forum = mongoose.model('Forum');
    await Forum.findByIdAndUpdate(this.forum, {
      $inc: { 'statistics.totalPosts': 1 }
    });
  }
  next();
});

// Pre-remove middleware to update forum statistics
postSchema.pre('remove', async function(next) {
  const Forum = mongoose.model('Forum');
  await Forum.findByIdAndUpdate(this.forum, {
    $inc: { 
      'statistics.totalPosts': -1,
      'statistics.totalComments': -this.comments.length
    }
  });
  next();
});

// Ensure virtual fields are serialized
postSchema.set('toJSON', {
  virtuals: true
});

// Create models
const Forum = mongoose.model('Forum', forumSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { Forum, Post };
