const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI env variable is missing');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('[db] MongoDB ulandi');
}

module.exports = connectDB;
