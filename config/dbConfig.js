const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI; // Load URI from environment
    if (!dbURI) {
      throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(dbURI); // No need for useNewUrlParser or useUnifiedTopology
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
