const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ========== ROUTES ==========

// 1. Home page
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ E-Waste Backend API is running!',
    version: '1.0.0',
    endpoints: {
      'GET /': 'This message',
      'GET /health': 'Health check',
      'POST /predict': 'Upload image for analysis (multipart/form-data)'
    }
  });
});

// 2. Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'E-Waste Backend',
    port: PORT,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 3. Main prediction endpoint
app.post('/predict', upload.single('image'), async (req, res) => {
  try {
    console.log('📥 Received upload request');
    
    if (!req.file) {
      console.log('❌ No file received');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('✅ File received:', req.file.filename);
    console.log('📁 Saved to:', req.file.path);
    console.log('📏 Size:', (req.file.size / 1024).toFixed(2), 'KB');

    // MOCK RESPONSE
    const mockResponse = {
      class: "Battery",
      confidence: 95.7,
      risk: "High",
      impact: "Contains toxic heavy metals like lead, mercury, and cadmium that can leach into soil and water.",
      recycle: "Take to certified e-waste recycler. Do not dispose in regular trash."
    };

    console.log('📤 Sending response:', mockResponse.class);
    
    // Simulate AI processing
    setTimeout(() => {
      res.json(mockResponse);
    }, 1000);

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to process image',
      details: error.message
    });
  }
});

// 4. Error handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: ['GET /', 'GET /health', 'POST /predict']
  });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 Node.js backend running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ./uploads`);
  console.log(`\n📋 Test endpoints:`);
  console.log(`   curl http://localhost:${PORT}/`);
  console.log(`   curl http://localhost:${PORT}/health`);
  console.log(`   curl -X POST http://localhost:${PORT}/predict -F "image=@test.jpg"`);
});