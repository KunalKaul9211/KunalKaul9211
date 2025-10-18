// MongoDB initialization script
db = db.getSiblingDB('monkmedia_nrcs');

// Create application user
db.createUser({
  user: 'monkmedia_user',
  pwd: 'monkmedia_password',
  roles: [
    {
      role: 'readWrite',
      db: 'monkmedia_nrcs'
    }
  ]
});

// Create initial collections with indexes
db.createCollection('users');
db.createCollection('stories');
db.createCollection('departments');
db.createCollection('workflows');
db.createCollection('notifications');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ department: 1 });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });

db.stories.createIndex({ status: 1 });
db.stories.createIndex({ department: 1 });
db.stories.createIndex({ author: 1 });
db.stories.createIndex({ createdAt: -1 });
db.stories.createIndex({ priority: 1 });
db.stories.createIndex({ tags: 1 });
db.stories.createIndex({ 'scheduling.broadcastAt': 1 });

db.departments.createIndex({ name: 1 }, { unique: true });
db.departments.createIndex({ isActive: 1 });

db.workflows.createIndex({ storyId: 1 });
db.workflows.createIndex({ status: 1 });

db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ read: 1 });
db.notifications.createIndex({ createdAt: -1 });

// Insert default departments
db.departments.insertMany([
  {
    name: 'input',
    displayName: 'Input Department',
    description: 'Story creation and submission',
    color: '#1976d2',
    icon: 'input',
    permissions: ['create_story', 'edit_story'],
    workflow: {
      steps: [
        { name: 'creation', order: 1, required: true, assignedRole: 'reporter' },
        { name: 'review', order: 2, required: true, assignedRole: 'editor' },
        { name: 'approval', order: 3, required: true, assignedRole: 'editor' }
      ],
      autoAdvance: false,
      requireApproval: true
    },
    settings: {
      maxStoriesPerUser: 10,
      autoArchiveAfter: 30,
      allowBreakingNews: true,
      requireMedia: false,
      minWordCount: 100,
      maxWordCount: 2000
    },
    isActive: true,
    statistics: {
      totalStories: 0,
      activeStories: 0,
      completedStories: 0,
      averageProcessingTime: 0,
      successRate: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'output',
    displayName: 'Output Department',
    description: 'Editorial review and approval',
    color: '#ed6c02',
    icon: 'output',
    permissions: ['create_story', 'edit_story', 'approve_story', 'content_review'],
    workflow: {
      steps: [
        { name: 'review', order: 1, required: true, assignedRole: 'editor' },
        { name: 'approval', order: 2, required: true, assignedRole: 'editor' },
        { name: 'final_review', order: 3, required: true, assignedRole: 'producer' }
      ],
      autoAdvance: false,
      requireApproval: true
    },
    settings: {
      maxStoriesPerUser: 15,
      autoArchiveAfter: 30,
      allowBreakingNews: true,
      requireMedia: true,
      minWordCount: 200,
      maxWordCount: 5000
    },
    isActive: true,
    statistics: {
      totalStories: 0,
      activeStories: 0,
      completedStories: 0,
      averageProcessingTime: 0,
      successRate: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'playout',
    displayName: 'Playout Department',
    description: 'Broadcast management and scheduling',
    color: '#d32f2f',
    icon: 'playout',
    permissions: ['create_story', 'edit_story', 'approve_story', 'broadcast_control', 'schedule_management'],
    workflow: {
      steps: [
        { name: 'scheduling', order: 1, required: true, assignedRole: 'producer' },
        { name: 'broadcast_prep', order: 2, required: true, assignedRole: 'producer' },
        { name: 'live_broadcast', order: 3, required: true, assignedRole: 'director' }
      ],
      autoAdvance: false,
      requireApproval: false
    },
    settings: {
      maxStoriesPerUser: 20,
      autoArchiveAfter: 7,
      allowBreakingNews: true,
      requireMedia: true,
      minWordCount: 50,
      maxWordCount: 1000
    },
    isActive: true,
    statistics: {
      totalStories: 0,
      activeStories: 0,
      completedStories: 0,
      averageProcessingTime: 0,
      successRate: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'admin',
    displayName: 'Admin Department',
    description: 'System administration and management',
    color: '#7b1fa2',
    icon: 'admin',
    permissions: ['create_story', 'edit_story', 'delete_story', 'approve_story', 'manage_users', 'view_analytics', 'manage_departments', 'broadcast_control', 'schedule_management', 'content_review'],
    workflow: {
      steps: [
        { name: 'admin_review', order: 1, required: true, assignedRole: 'admin' }
      ],
      autoAdvance: true,
      requireApproval: false
    },
    settings: {
      maxStoriesPerUser: 100,
      autoArchiveAfter: 90,
      allowBreakingNews: true,
      requireMedia: false,
      minWordCount: 10,
      maxWordCount: 10000
    },
    isActive: true,
    statistics: {
      totalStories: 0,
      activeStories: 0,
      completedStories: 0,
      averageProcessingTime: 0,
      successRate: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('MonkMedia NRCS database initialized successfully!');