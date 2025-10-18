const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    enum: ['input', 'output', 'playout', 'admin', 'management']
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  color: {
    type: String,
    default: '#007bff',
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  icon: {
    type: String,
    default: 'folder'
  },
  permissions: [{
    type: String,
    enum: [
      'create_story', 'edit_story', 'delete_story', 'approve_story',
      'manage_users', 'view_analytics', 'broadcast_control',
      'schedule_management', 'content_review', 'workflow_management'
    ]
  }],
  workflow: {
    steps: [{
      name: String,
      description: String,
      order: Number,
      required: { type: Boolean, default: true },
      assignedRole: String,
      estimatedTime: Number, // in minutes
      autoAssign: { type: Boolean, default: false }
    }],
    autoAdvance: { type: Boolean, default: false },
    requireApproval: { type: Boolean, default: true }
  },
  settings: {
    maxStoriesPerUser: { type: Number, default: 10 },
    autoArchiveAfter: { type: Number, default: 30 }, // days
    allowBreakingNews: { type: Boolean, default: true },
    requireMedia: { type: Boolean, default: false },
    minWordCount: { type: Number, default: 100 },
    maxWordCount: { type: Number, default: 2000 }
  },
  notifications: {
    onStorySubmit: { type: Boolean, default: true },
    onStoryApprove: { type: Boolean, default: true },
    onStoryReject: { type: Boolean, default: true },
    onBreakingNews: { type: Boolean, default: true },
    onDeadlineApproach: { type: Boolean, default: true }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['member', 'senior', 'lead', 'manager'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  statistics: {
    totalStories: { type: Number, default: 0 },
    activeStories: { type: Number, default: 0 },
    completedStories: { type: Number, default: 0 },
    averageProcessingTime: { type: Number, default: 0 }, // in hours
    successRate: { type: Number, default: 0 } // percentage
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for member count
departmentSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for active member count
departmentSchema.virtual('activeMemberCount').get(function() {
  return this.members.filter(member => member.user && member.user.isActive).length;
});

// Update statistics
departmentSchema.methods.updateStatistics = async function() {
  const Story = mongoose.model('Story');
  
  const totalStories = await Story.countDocuments({ department: this.name });
  const activeStories = await Story.countDocuments({ 
    department: this.name, 
    status: { $in: ['draft', 'submitted', 'under_review'] } 
  });
  const completedStories = await Story.countDocuments({ 
    department: this.name, 
    status: { $in: ['approved', 'broadcasted'] } 
  });
  
  this.statistics.totalStories = totalStories;
  this.statistics.activeStories = activeStories;
  this.statistics.completedStories = completedStories;
  
  if (totalStories > 0) {
    this.statistics.successRate = Math.round((completedStories / totalStories) * 100);
  }
  
  return this.save();
};

// Add member to department
departmentSchema.methods.addMember = function(userId, role = 'member') {
  const existingMember = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (!existingMember) {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date()
    });
  }
  
  return this.save();
};

// Remove member from department
departmentSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => 
    member.user.toString() !== userId.toString()
  );
  
  return this.save();
};

module.exports = mongoose.model('Department', departmentSchema);