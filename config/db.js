# Replace your config/db.js with this:
@'
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove the deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ewaste-db');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
'@ | Out-File -FilePath config/db.js -Encoding UTF8 -Force