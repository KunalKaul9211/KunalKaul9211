const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Story content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  summary: {
    type: String,
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['breaking', 'politics', 'business', 'sports', 'entertainment', 'technology', 'health', 'world', 'local', 'weather'],
    default: 'local'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent', 'breaking'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'scheduled', 'broadcasted', 'archived'],
    default: 'draft'
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['input', 'output', 'playout'],
    default: 'input'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    comments: String,
    reviewedAt: Date
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  media: {
    images: [{
      url: String,
      caption: String,
      alt: String,
      order: Number
    }],
    videos: [{
      url: String,
      caption: String,
      duration: Number,
      thumbnail: String
    }],
    audio: [{
      url: String,
      caption: String,
      duration: Number
    }],
    documents: [{
      url: String,
      name: String,
      type: String,
      size: Number
    }]
  },
  metadata: {
    wordCount: { type: Number, default: 0 },
    readingTime: { type: Number, default: 0 },
    language: { type: String, default: 'en' },
    location: {
      city: String,
      state: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    source: {
      type: String,
      enum: ['original', 'wire', 'press_release', 'social_media', 'interview', 'press_conference'],
      default: 'original'
    },
    externalId: String,
    externalUrl: String
  },
  scheduling: {
    publishAt: Date,
    broadcastAt: Date,
    duration: Number, // in minutes
    channel: String,
    segment: String
  },
  workflow: {
    currentStep: { type: String, default: 'creation' },
    steps: [{
      step: String,
      status: { type: String, enum: ['pending', 'in_progress', 'completed', 'skipped'], default: 'pending' },
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      startedAt: Date,
      completedAt: Date,
      comments: String
    }],
    estimatedCompletion: Date,
    actualCompletion: Date
  },
  analytics: {
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    feedback: {
      positive: { type: Number, default: 0 },
      negative: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 }
    }
  },
  isBreaking: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date,
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    content: String,
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    modifiedAt: Date,
    reason: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full status
storySchema.virtual('fullStatus').get(function() {
  return {
    status: this.status,
    department: this.department,
    priority: this.priority,
    isBreaking: this.isBreaking
  };
});

// Generate slug before saving
storySchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Update word count and reading time
storySchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const words = this.content.trim().split(/\s+/).length;
    this.metadata.wordCount = words;
    this.metadata.readingTime = Math.ceil(words / 200); // Assuming 200 words per minute
  }
  next();
});

// Index for better query performance
storySchema.index({ status: 1, department: 1 });
storySchema.index({ createdAt: -1 });
storySchema.index({ priority: 1, status: 1 });
storySchema.index({ author: 1 });
storySchema.index({ tags: 1 });
storySchema.index({ 'scheduling.broadcastAt': 1 });

module.exports = mongoose.model('Story', storySchema);