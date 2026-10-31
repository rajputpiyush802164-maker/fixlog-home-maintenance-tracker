const mongoose = require('mongoose');

module.exports = async function connect() {
  const uri = process.env.MONGO_URI;
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log('✔ MongoDB connected');
      return false;
    } catch { console.log('! MongoDB not found, switching to temporary in-memory database...'); }
  }
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri());
  console.log('✔ In-memory DB ready (data restart par reset hoga)');
  return true;
};
