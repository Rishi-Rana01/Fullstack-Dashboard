import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

/**
 * Establishes a connection to MongoDB via Mongoose.
 * Uses a single persistent connection pool for the lifetime of the process.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
    
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    console.error(`❌ MongoDB connection error: ${err.message}`);
   
    process.exit(1);
  }
};


process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed (SIGINT)');
  process.exit(0);
});
