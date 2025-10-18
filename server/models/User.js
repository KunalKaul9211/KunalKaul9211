const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['input', 'output', 'playout', 'admin', 'management'],
    default: 'input'
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['reporter', 'editor', 'producer', 'director', 'admin', 'manager'],
    default: 'reporter'
  },
  permissions: [{
    type: String,
    enum: [
      'create_story', 'edit_story', 'delete_story', 'approve_story',
      'manage_users', 'view_analytics', 'manage_departments',
      'broadcast_control', 'schedule_management', 'content_review'
    ]
  }],
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      desktop: { type: Boolean, default: true }
    },
    dashboard: {
      layout: { type: String, default: 'default' },
      widgets: [{ type: String }]
    }
  },
  workSchedule: {
    timezone: { type: String, default: 'UTC' },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' }
    },
    workingDays: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Get user permissions based on role
userSchema.methods.getPermissions = function() {
  const rolePermissions = {
    reporter: ['create_story', 'edit_story'],
    editor: ['create_story', 'edit_story', 'approve_story', 'content_review'],
    producer: ['create_story', 'edit_story', 'approve_story', 'content_review', 'schedule_management'],
    director: ['create_story', 'edit_story', 'approve_story', 'content_review', 'schedule_management', 'broadcast_control'],
    admin: ['create_story', 'edit_story', 'delete_story', 'approve_story', 'manage_users', 'view_analytics', 'manage_departments', 'broadcast_control', 'schedule_management', 'content_review'],
    manager: ['create_story', 'edit_story', 'approve_story', 'view_analytics', 'content_review', 'schedule_management']
  };
  
  return [...(rolePermissions[this.role] || []), ...this.permissions];
};

module.exports = mongoose.model('User', userSchema);