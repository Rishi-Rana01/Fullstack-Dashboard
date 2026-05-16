import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection URI from environment — never hardcode credentials
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
      // These options suppress deprecation warnings and improve connection reliability
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    console.error(`❌ MongoDB connection error: ${err.message}`);
    // Exit the process so the container/process manager can restart it
    process.exit(1);
  }
};

// Gracefully close the connection when the process receives a termination signal
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed (SIGINT)');
  process.exit(0);
});
