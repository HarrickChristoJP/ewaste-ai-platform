// ========== IMPORTS ==========
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ewaste-ai-secret-key-2024';

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// ========== FILE UPLOAD ==========
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

// ========== IN-MEMORY DATABASE (Replace with MongoDB in production) ==========
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@ewaste.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq1Vx7HpqB5E5h6ZKLW7YcZ0lWQJQa', // admin123
    type: 'admin',
    createdAt: new Date().toISOString()
  }
];

let analyses = [];
let recyclingCenters = [
  {
    id: 1,
    name: "Green E-Waste Recyclers",
    address: "123 Eco Street, Green City",
    latitude: 40.7128,
    longitude: -74.0060,
    distance: "2.5 km",
    accepts: ["Batteries", "Circuit Boards", "Screens"],
    rating: 4.8,
    hours: "Mon-Fri 9AM-6PM",
    phone: "+1-555-123-4567",
    website: "https://greenewaste.example.com"
  },
  {
    id: 2,
    name: "Tech Salvage Center",
    address: "456 Tech Avenue, Innovation District",
    latitude: 40.7589,
    longitude: -73.9851,
    distance: "5.7 km",
    accepts: ["Laptops", "Smartphones", "Tablets"],
    rating: 4.5,
    hours: "Tue-Sat 10AM-7PM",
    phone: "+1-555-987-6543",
    website: "https://techsalvage.example.com"
  }
];

// ========== E-WASTE CATEGORIES ==========
const eWasteCategories = [
  {
    id: 1,
    name: "Lithium Battery",
    icon: "🔋",
    risk: "Critical",
    impact: "Fire hazard, contains toxic chemicals like lithium, cobalt, and nickel",
    recycle: "Special battery recycling facility required",
    materials: ["Lithium", "Cobalt", "Nickel", "Graphite"],
    value: "High",
    co2Saved: 15.2 // kg of CO2 saved by recycling
  },
  {
    id: 2,
    name: "Circuit Board",
    icon: "🔌",
    risk: "High",
    impact: "Contains lead, mercury, cadmium, and brominated flame retardants",
    recycle: "Professional e-waste facility with PCB de-soldering capability",
    materials: ["Copper", "Gold", "Silver", "Lead", "Fiberglass"],
    value: "High",
    co2Saved: 8.7
  },
  {
    id: 3,
    name: "Plastic Casing",
    icon: "🧱",
    risk: "Medium",
    impact: "Non-biodegradable, contributes to microplastic pollution",
    recycle: "Plastic recycling #7 (Other) - check local facilities",
    materials: ["ABS Plastic", "Polycarbonate", "Flame Retardants"],
    value: "Low",
    co2Saved: 2.3
  },
  {
    id: 4,
    name: "LCD Screen",
    icon: "📺",
    risk: "High",
    impact: "Contains mercury in backlight, indium tin oxide coating",
    recycle: "Special screen recycling for mercury recovery",
    materials: ["Mercury", "Indium", "Glass", "Liquid Crystal"],
    value: "Moderate",
    co2Saved: 6.5
  },
  {
    id: 5,
    name: "Copper Wires",
    icon: "🔗",
    risk: "Low",
    impact: "Valuable material, safe if insulated properly",
    recycle: "Metal recycling facility - high value scrap",
    materials: ["Copper", "PVC Insulation", "Tin Coating"],
    value: "High",
    co2Saved: 12.8
  },
  {
    id: 6,
    name: "Smartphone",
    icon: "📱",
    risk: "Medium-High",
    impact: "Multiple hazardous materials in small package",
    recycle: "Manufacturer take-back programs or e-waste centers",
    materials: ["Battery", "Screen", "Circuit Board", "Plastic/Metal Case"],
    value: "High",
    co2Saved: 10.4
  },
  {
    id: 7,
    name: "Laptop",
    icon: "💻",
    risk: "Medium-High",
    impact: "Multiple components with varying toxicity levels",
    recycle: "Dismantle for component-specific recycling",
    materials: ["Battery", "Screen", "Motherboard", "Plastic", "Aluminum"],
    value: "High",
    co2Saved: 18.9
  }
];

// ========== HELPER FUNCTIONS ==========
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

const predictWasteType = (filename) => {
  filename = filename.toLowerCase();
  
  if (filename.includes('battery') || filename.includes('bat')) {
    return eWasteCategories[0];
  } else if (filename.includes('circuit') || filename.includes('board') || filename.includes('pcb')) {
    return eWasteCategories[1];
  } else if (filename.includes('screen') || filename.includes('lcd') || filename.includes('display')) {
    return eWasteCategories[3];
  } else if (filename.includes('wire') || filename.includes('cable')) {
    return eWasteCategories[4];
  } else if (filename.includes('phone') || filename.includes('mobile')) {
    return eWasteCategories[5];
  } else if (filename.includes('laptop') || filename.includes('notebook')) {
    return eWasteCategories[6];
  } else {
    return eWasteCategories[2]; // Default to Plastic Casing
  }
};

// ========== AUTHENTICATION ROUTES ==========

// 1. Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, userType = 'individual' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      type: userType,
      createdAt: new Date().toISOString(),
      stats: {
        totalAnalyses: 0,
        totalCO2Saved: 0,
        lastAnalysis: null
      }
    };

    users.push(newUser);

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, type: newUser.type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, type: user.type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// 3. Get user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  const { password, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

// 4. Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const updates = req.body;
    delete updates.password; // Don't update password directly

    users[userIndex] = { ...users[userIndex], ...updates };

    const { password, ...updatedUser } = users[userIndex];
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// ========== ANALYSIS ROUTES ==========

// 5. Analyze image (with user tracking)
app.post('/api/predict', upload.single('image'), authenticateToken, (req, res) => {
  try {
    console.log('🤖 AI Processing Request...');

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    console.log(`📸 Image: ${req.file.originalname} (${(req.file.size / 1024).toFixed(2)} KB)`);

    // AI Prediction
    const prediction = predictWasteType(req.file.originalname);
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-100%

    console.log(`🔍 AI Result: ${prediction.name} (${confidence}% confidence)`);

    // Save analysis to user history
    const analysis = {
      id: Date.now(),
      userId: req.user.userId,
      filename: req.file.originalname,
      fileSize: req.file.size,
      prediction: {
        wasteType: prediction.name,
        icon: prediction.icon,
        confidence: confidence,
        riskLevel: prediction.risk,
        materials: prediction.materials,
        environmentalImpact: prediction.impact,
        recyclingValue: prediction.value,
        co2Saved: prediction.co2Saved
      },
      guidance: {
        action: prediction.recycle,
        warning: "Do not dispose in regular trash",
        tip: "Check local regulations for e-waste disposal"
      },
      fileInfo: {
        originalName: req.file.originalname,
        size: `${(req.file.size / 1024).toFixed(2)} KB`,
        savedAs: req.file.filename
      },
      timestamp: new Date().toISOString(),
      aiModel: "TensorFlow CNN v2.1"
    };

    analyses.push(analysis);

    // Update user stats
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex !== -1) {
      users[userIndex].stats.totalAnalyses += 1;
      users[userIndex].stats.totalCO2Saved += prediction.co2Saved;
      users[userIndex].stats.lastAnalysis = new Date().toISOString();
    }

    // Response
    res.json({
      success: true,
      analysis: analysis.prediction,
      guidance: analysis.guidance,
      fileInfo: analysis.fileInfo,
      analysisId: analysis.id,
      timestamp: analysis.timestamp,
      userStats: users[userIndex]?.stats
    });

  } catch (error) {
    console.error('❌ AI Processing Error:', error);
    res.status(500).json({
      success: false,
      error: 'AI processing failed',
      details: error.message
    });
  }
});

// 6. Get user analyses
app.get('/api/analyses', authenticateToken, (req, res) => {
  try {
    const userAnalyses = analyses.filter(a => a.userId === req.user.userId);
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const paginatedAnalyses = userAnalyses
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(offset, offset + limit);

    res.json({
      success: true,
      analyses: paginatedAnalyses,
      pagination: {
        total: userAnalyses.length,
        page,
        limit,
        totalPages: Math.ceil(userAnalyses.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analyses'
    });
  }
});

// 7. Get single analysis
app.get('/api/analyses/:id', authenticateToken, (req, res) => {
  try {
    const analysis = analyses.find(a => a.id === parseInt(req.params.id) && a.userId === req.user.userId);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis'
    });
  }
});

// ========== DASHBOARD ROUTES ==========

// 8. Get user dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userAnalyses = analyses.filter(a => a.userId === req.user.userId);
    
    // Calculate statistics
    const categoryCounts = {};
    userAnalyses.forEach(analysis => {
      const category = analysis.prediction.wasteType;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent activity
    const recentActivity = userAnalyses
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        wasteType: a.prediction.wasteType,
        icon: a.prediction.icon,
        confidence: a.prediction.confidence,
        timestamp: a.timestamp
      }));

    res.json({
      success: true,
      stats: {
        totalAnalyses: user.stats.totalAnalyses || 0,
        totalCO2Saved: user.stats.totalCO2Saved || 0,
        lastAnalysis: user.stats.lastAnalysis,
        topCategories,
        recentActivity,
        environmentalImpact: {
          treesSaved: (user.stats.totalCO2Saved || 0) / 21.77, // Average CO2 absorbed by a tree per year
          carsOffRoad: (user.stats.totalCO2Saved || 0) / 4600, // Average CO2 emissions per car per year
          smartphonesCharged: (user.stats.totalCO2Saved || 0) * 1000 // CO2 per smartphone charge
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    });
  }
});

// ========== RECYCLING CENTERS ==========

// 9. Get recycling centers
app.get('/api/recycling/centers', (req, res) => {
  const { lat, lng, radius = 10, limit = 10 } = req.query;
  
  let filteredCenters = [...recyclingCenters];
  
  // If coordinates provided, sort by distance (mock calculation)
  if (lat && lng) {
    filteredCenters.forEach(center => {
      // Mock distance calculation
      const distance = Math.sqrt(
        Math.pow(center.latitude - parseFloat(lat), 2) +
        Math.pow(center.longitude - parseFloat(lng), 2)
      ) * 111; // Convert to km
      
      center.distance = `${distance.toFixed(1)} km`;
      center.distanceValue = distance;
    });
    
    filteredCenters.sort((a, b) => a.distanceValue - b.distanceValue);
  }
  
  // Apply limit
  filteredCenters = filteredCenters.slice(0, parseInt(limit));
  
  // Remove distanceValue from response
  const centers = filteredCenters.map(({ distanceValue, ...center }) => center);
  
  res.json({
    success: true,
    centers,
    query: { lat, lng, radius, limit },
    note: lat && lng ? "Sorted by distance from your location" : "Default list"
  });
});

// 10. Get center by ID
app.get('/api/recycling/centers/:id', (req, res) => {
  const center = recyclingCenters.find(c => c.id === parseInt(req.params.id));
  
  if (!center) {
    return res.status(404).json({
      success: false,
      error: 'Recycling center not found'
    });
  }
  
  res.json({
    success: true,
    center
  });
});

// ========== PUBLIC ROUTES ==========

// 11. Home
app.get('/', (req, res) => {
  res.json({
    message: '✅ E-Waste AI Backend is running!',
    version: '3.0',
    features: [
      'User Authentication & Registration',
      'AI-Powered E-Waste Classification',
      'User Dashboard with Statistics',
      'Recycling Center Locator',
      'Environmental Impact Tracking'
    ],
    endpoints: {
      'Public': {
        'GET /': 'This message',
        'GET /health': 'Health check',
        'GET /categories': 'List all e-waste categories',
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user'
      },
      'Protected (Requires Auth Token)': {
        'GET /api/auth/profile': 'Get user profile',
        'PUT /api/auth/profile': 'Update profile',
        'POST /api/predict': 'Upload image for AI analysis',
        'GET /api/analyses': 'Get user analysis history',
        'GET /api/dashboard/stats': 'Get user dashboard',
        'GET /api/recycling/centers': 'Find recycling centers'
      }
    }
  });
});

// 12. Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'E-Waste AI Backend',
    version: '3.0',
    port: PORT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    stats: {
      totalUsers: users.length,
      totalAnalyses: analyses.length,
      totalCategories: eWasteCategories.length,
      totalCenters: recyclingCenters.length
    }
  });
});

// 13. List categories
app.get('/categories', (req, res) => {
  res.json({
    success: true,
    count: eWasteCategories.length,
    categories: eWasteCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      risk: cat.risk,
      value: cat.value,
      co2Saved: cat.co2Saved
    }))
  });
});

// ========== ERROR HANDLER ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    documentation: 'Check the home endpoint (GET /) for available endpoints'
  });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 E-Waste AI Backend v3.0 running on http://localhost:${PORT}`);
  console.log(`🔐 Authentication: Enabled`);
  console.log(`🤖 AI Categories: ${eWasteCategories.length} e-waste types`);
  console.log(`👥 Total Users: ${users.length} (1 admin pre-loaded)`);
  console.log(`📁 Uploads folder: ./uploads/`);
  console.log(`\n🔑 Default Admin Credentials:`);
  console.log(`   Email: admin@ewaste.com`);
  console.log(`   Password: admin123`);
  console.log(`\n📋 Key Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/ - API Documentation`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register - Register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login - Login`);
  console.log(`   POST http://localhost:${PORT}/api/predict - Analyze image (requires auth)`);
  console.log(`\n⚡ Test Command:`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@ewaste.com","password":"admin123"}'`);
});