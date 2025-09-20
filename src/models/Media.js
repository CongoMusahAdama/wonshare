const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Media title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Media type is required'],
    enum: ['image', 'video', 'document', 'audio']
  },
  category: {
    type: String,
    required: [true, 'Media category is required'],
    enum: ['event', 'masquerade', 'meeting', 'social', 'training', 'other']
  },
  scope: {
    type: String,
    enum: ['society_wide', 'branch_specific'],
    default: 'branch_specific'
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: function() {
      return this.scope === 'branch_specific';
    }
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  files: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    size: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    dimensions: {
      width: Number,
      height: Number
    },
    duration: Number, // For videos/audio
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
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
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
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
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'failed'],
    default: 'processing'
  },
  metadata: {
    location: {
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    dateTaken: Date,
    camera: String,
    settings: {
      iso: Number,
      aperture: String,
      shutterSpeed: String,
      focalLength: String
    }
  }
}, {
  timestamps: true
});

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Album title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Album category is required'],
    enum: ['event', 'masquerade', 'meeting', 'social', 'training', 'yearly', 'other']
  },
  scope: {
    type: String,
    enum: ['society_wide', 'branch_specific'],
    default: 'branch_specific'
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: function() {
      return this.scope === 'branch_specific';
    }
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  coverImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  dateRange: {
    start: Date,
    end: Date
  },
  statistics: {
    totalMedia: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
mediaSchema.index({ type: 1 });
mediaSchema.index({ category: 1 });
mediaSchema.index({ scope: 1 });
mediaSchema.index({ branch: 1 });
mediaSchema.index({ event: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ isPublic: 1 });
mediaSchema.index({ isFeatured: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ createdAt: -1 });

albumSchema.index({ category: 1 });
albumSchema.index({ scope: 1 });
albumSchema.index({ branch: 1 });
albumSchema.index({ event: 1 });
albumSchema.index({ createdBy: 1 });
albumSchema.index({ isPublic: 1 });
albumSchema.index({ isFeatured: 1 });
albumSchema.index({ tags: 1 });
albumSchema.index({ createdAt: -1 });

// Virtual for like count
mediaSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
mediaSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for view count
mediaSchema.virtual('viewCount').get(function() {
  return this.views.length;
});

// Virtual for primary file
mediaSchema.virtual('primaryFile').get(function() {
  return this.files.find(file => file.isPrimary) || this.files[0];
});

// Virtual for thumbnail
mediaSchema.virtual('thumbnail').get(function() {
  const primaryFile = this.primaryFile;
  return primaryFile ? (primaryFile.thumbnail || primaryFile.url) : null;
});

// Virtual for media count
albumSchema.virtual('mediaCount').get(function() {
  return this.media.length;
});

// Method to add like
mediaSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.equals(userId));
  if (!existingLike) {
    this.likes.push({ user: userId });
  }
};

// Method to remove like
mediaSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => !like.user.equals(userId));
};

// Method to add comment
mediaSchema.methods.addComment = function(authorId, content) {
  this.comments.push({
    author: authorId,
    content
  });
};

// Method to add view
mediaSchema.methods.addView = function(userId) {
  const existingView = this.views.find(view => 
    view.user && view.user.equals(userId)
  );
  if (!existingView) {
    this.views.push({ user: userId });
  }
};

// Method to set primary file
mediaSchema.methods.setPrimaryFile = function(fileId) {
  this.files.forEach(file => {
    file.isPrimary = file._id.equals(fileId);
  });
};

// Method to add media to album
albumSchema.methods.addMedia = function(mediaId) {
  if (!this.media.includes(mediaId)) {
    this.media.push(mediaId);
    this.statistics.totalMedia = this.media.length;
  }
};

// Method to remove media from album
albumSchema.methods.removeMedia = function(mediaId) {
  this.media = this.media.filter(id => !id.equals(mediaId));
  this.statistics.totalMedia = this.media.length;
};

// Method to set cover image
albumSchema.methods.setCoverImage = function(mediaId) {
  if (this.media.includes(mediaId)) {
    this.coverImage = mediaId;
  }
};

// Pre-save middleware to update album statistics
mediaSchema.pre('save', async function(next) {
  if (this.isNew && this.album) {
    const Album = mongoose.model('Album');
    await Album.findByIdAndUpdate(this.album, {
      $inc: { 'statistics.totalMedia': 1 }
    });
  }
  next();
});

// Pre-remove middleware to update album statistics
mediaSchema.pre('remove', async function(next) {
  if (this.album) {
    const Album = mongoose.model('Album');
    await Album.findByIdAndUpdate(this.album, {
      $inc: { 'statistics.totalMedia': -1 }
    });
  }
  next();
});

// Ensure virtual fields are serialized
mediaSchema.set('toJSON', {
  virtuals: true
});

albumSchema.set('toJSON', {
  virtuals: true
});

// Create models
const Media = mongoose.model('Media', mediaSchema);
const Album = mongoose.model('Album', albumSchema);

module.exports = { Media, Album };
