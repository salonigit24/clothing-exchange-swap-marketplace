const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  const localUri = 'mongodb://localhost:27017/clothing_swap_db';
  const mongoUri = process.env.MONGO_URI || localUri;

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (mongoUri === localUri || !process.env.MONGO_URI) {
      try {
        const memoryMongo = await MongoMemoryServer.create();
        const memoryUri = memoryMongo.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`MongoDB Connected (fallback): ${conn.connection.host}`);
        return;
      } catch (memoryError) {
        console.error(`Fallback MongoDB connection failed: ${memoryError.message}`);
      }
    }

    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
