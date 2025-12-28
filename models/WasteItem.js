const mongoose = require('mongoose');

const wasteItemSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileSize: Number,
  filePath: String,
  prediction: {
    class: String,
    confidence: Number,
    risk: String,
    impact: String,
    recycle: String
  },
  userId: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WasteItem', wasteItemSchema);