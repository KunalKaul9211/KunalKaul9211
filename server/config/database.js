const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/monkmedia-nrcs', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // User indexes
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ department: 1 });
    await mongoose.connection.db.collection('users').createIndex({ role: 1 });
    
    // Story indexes
    await mongoose.connection.db.collection('stories').createIndex({ status: 1 });
    await mongoose.connection.db.collection('stories').createIndex({ department: 1 });
    await mongoose.connection.db.collection('stories').createIndex({ createdAt: -1 });
    await mongoose.connection.db.collection('stories').createIndex({ priority: 1 });
    
    // Workflow indexes
    await mongoose.connection.db.collection('workflows').createIndex({ storyId: 1 });
    await mongoose.connection.db.collection('workflows').createIndex({ status: 1 });
    
    // Notification indexes
    await mongoose.connection.db.collection('notifications').createIndex({ userId: 1 });
    await mongoose.connection.db.collection('notifications').createIndex({ read: 1 });
    await mongoose.connection.db.collection('notifications').createIndex({ createdAt: -1 });
    
    console.log('📊 Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

module.exports = connectDB;