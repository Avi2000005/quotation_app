import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is missing from .env!');
    }
    console.log('Connecting to MongoDB database...');
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB successfully connected!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
