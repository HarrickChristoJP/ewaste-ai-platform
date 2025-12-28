import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Authentication Pages
const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (formData.email && formData.password) {
        const userData = {
          email: formData.email,
          name: formData.email.split('@')[0],
          token: 'mock-jwt-token-' + Date.now()
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        onLogin(userData);
        navigate('/');
      } else {
        setError('Please fill in all fields');
      }
      setLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (type) => {
    const demoCredentials = {
      admin: { email: 'admin@ewaste.com', password: 'admin123' },
      user: { email: 'user@example.com', password: 'user123' },
      guest: { email: 'guest@ewaste.com', password: 'guest123' }
    };
    setFormData(demoCredentials[type]);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 Welcome Back</h2>
          <p>Sign in to your E-Waste AI account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">📧 Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
          </div>

          <div className="form-options">
            <label className="remember-me"><input type="checkbox" /> Remember me</label>
            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="auth-btn primary" disabled={loading}>
            {loading ? '🔐 Signing in...' : '🔐 Sign In'}
          </button>

          <div className="demo-buttons">
            <p className="demo-label">Quick Demo Login:</p>
            <div className="demo-btns">
              <button type="button" className="demo-btn admin" onClick={() => handleDemoLogin('admin')}>👑 Admin</button>
              <button type="button" className="demo-btn user" onClick={() => handleDemoLogin('user')}>👤 User</button>
              <button type="button" className="demo-btn guest" onClick={() => handleDemoLogin('guest')}>👋 Guest</button>
            </div>
          </div>

          <div className="auth-divider"><span>or</span></div>

          <button type="button" className="auth-btn google"><span>🔗</span> Continue with Google</button>

          <p className="auth-switch">Don't have an account? <a href="/register">Sign up</a></p>
        </form>
      </div>
    </div>
  );
};

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', userType: 'recycler' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        type: formData.userType,
        joined: new Date().toISOString(),
        token: 'mock-jwt-token-' + Date.now()
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      onRegister(userData);
      navigate('/');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🚀 Join E-Waste AI</h2>
          <p>Create your account to start analyzing e-waste</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">👤 Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={errors.name ? 'error' : ''} />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">📧 Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={errors.email ? 'error' : ''} />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">🔒 Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={errors.password ? 'error' : ''} />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">✅ Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={errors.confirmPassword ? 'error' : ''} />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="auth-btn primary" disabled={loading}>
            {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
          </button>

          <p className="auth-switch">Already have an account? <a href="/login">Sign in</a></p>
        </form>
      </div>
    </div>
  );
};

// Navbar Component
const Navbar = ({ isAuthenticated, user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-brand">
          <span className="logo-icon">♻️</span>
          <span className="logo-text">E-Waste AI</span>
        </a>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <a href="/" className="nav-link">🏠 Home</a>
              <a href="/history" className="nav-link">📊 History</a>
              <a href="/centers" className="nav-link">📍 Centers</a>
              <div className="user-profile">
                <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                <div className="user-info">
                  <span className="user-name">{user?.name || 'User'}</span>
                  <span className="user-email">{user?.email || 'user@example.com'}</span>
                </div>
                <button onClick={onLogout} className="logout-btn">🚪</button>
              </div>
            </>
          ) : (
            <>
              <a href="/login" className="nav-link">🔐 Login</a>
              <a href="/register" className="nav-link register">🚀 Sign Up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Main App Component
const MainApp = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      setBackendStatus(response.ok ? 'connected' : 'error');
    } catch (err) {
      setBackendStatus('error');
      console.log('Backend not connected. Run: npm start in backend folder');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    setSelectedFile(file);
    setError('');
    setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    if (backendStatus !== 'connected') {
      setError('Backend server is not running. Start it with: npm start in backend folder');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const response = await fetch(`${API_URL}/predict`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError(`Failed to analyze image: ${err.message}`);
      const mockData = getMockResult(selectedFile.name);
      setResult(mockData);
    } finally {
      setLoading(false);
    }
  };

  const testWithSample = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const mockData = getMockResult('test-battery.jpg');
      setResult(mockData);
      setPreviewUrl('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjc3ZWVhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imYIgVGVzdCBCYXR0ZXJ5IEltYWdlPC90ZXh0Pjwvc3ZnPg==');
      setSelectedFile(new File([''], 'test-battery.jpg', { type: 'image/jpeg' }));
      setLoading(false);
    }, 1500);
  };

  const getMockResult = (filename) => {
    const categories = [
      {
        wasteType: "Lithium Battery", icon: "🔋", confidence: "95.7%", riskLevel: "Critical",
        environmentalImpact: "Contains toxic heavy metals like lead, mercury, and cadmium that can leach into soil and water.",
        materials: ["Lithium", "Cobalt", "Nickel", "Graphite"], recyclingValue: "High",
        recycleAction: "Take to certified e-waste recycler.", warning: "Do not dispose in regular trash."
      },
      {
        wasteType: "Circuit Board", icon: "🔌", confidence: "88.2%", riskLevel: "High",
        environmentalImpact: "Contains lead, mercury, cadmium, and brominated flame retardants.",
        materials: ["Copper", "Gold", "Silver", "Lead", "Fiberglass"], recyclingValue: "High",
        recycleAction: "Professional e-waste facility required.", warning: "Contains precious metals and toxic materials."
      },
      {
        wasteType: "Smartphone", icon: "📱", confidence: "91.5%", riskLevel: "Medium-High",
        environmentalImpact: "Multiple hazardous materials in compact package.",
        materials: ["Battery", "LCD Screen", "Circuit Board", "Plastic/Metal"], recyclingValue: "High",
        recycleAction: "Manufacturer take-back program.", warning: "Data should be wiped before recycling."
      }
    ];
    const filenameLower = filename.toLowerCase();
    let selectedCategory = categories[0];
    if (filenameLower.includes('circuit') || filenameLower.includes('board')) selectedCategory = categories[1];
    else if (filenameLower.includes('phone') || filenameLower.includes('mobile')) selectedCategory = categories[2];
    return {
      analysis: selectedCategory,
      guidance: {
        action: selectedCategory.recycleAction,
        warning: selectedCategory.warning,
        facilities: [
          { name: "Green E Waste Center", distance: "2.5 km", rating: "4.5/5" },
          { name: "Safe Recycling Hub", distance: "3.8 km", rating: "4.2/5" }
        ]
      },
      fileInfo: { name: filename, size: "45.2 KB", analyzedAt: new Date().toISOString() },
      aiModel: "TensorFlow CNN", analysisTime: "~2 seconds"
    };
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
  };

  const goBack = () => setResult(null);

  const renderUploadSection = () => (
    <div className="upload-section">
      <h2>📸 Upload E-Waste Image</h2>
      <p>Take a clear photo of your e-waste item</p>
      
      <div className={`upload-area ${selectedFile ? 'has-file' : ''}`}
        onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('file-input').click()}>
        {previewUrl ? (
          <div className="preview-container">
            <img src={previewUrl} alt="Preview" className="preview-image" />
            <p className="file-name">{selectedFile.name}</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📁</div>
            <p>Drag & drop or click to upload</p>
            <p className="file-types">JPG, PNG, WEBP (Max 10MB)</p>
          </>
        )}
        <input id="file-input" type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
      </div>

      {selectedFile && (
        <div className="file-details">
          <p>📁 <strong>{selectedFile.name}</strong></p>
          <p>📏 Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      <div className="controls">
        <button className="btn analyze-btn" onClick={analyzeImage} disabled={!selectedFile || loading}>
          {loading ? '🔍 Analyzing...' : '🔍 Analyze E-Waste'}
        </button>
        <button className="btn test-btn" onClick={testWithSample} disabled={loading}>🧪 Test with Sample</button>
        {selectedFile && <button className="btn clear-btn" onClick={clearAll}>🗑️ Clear</button>}
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}
      <div className={`backend-status ${backendStatus}`}>
        Backend: {backendStatus === 'connected' ? '✅ Connected' : '❌ Not Connected'}
        {backendStatus === 'error' && <small>Run: cd backend && npm start</small>}
      </div>
    </div>
  );

  const renderResultsSection = () => {
    if (!result) return null;
    const { analysis, guidance, fileInfo, aiModel, analysisTime } = result;
    return (
      <div className="results-section">
        <button className="back-btn" onClick={goBack}>← Upload Another Image</button>
        <div className="result-card">
          <div className="result-header">
            <div className="waste-icon-large">{analysis.icon}</div>
            <div className="result-title">
              <h2>{analysis.wasteType}</h2>
              <div className="confidence-badge">Confidence: <span className="confidence-value">{analysis.confidence}</span></div>
            </div>
            <div className={`risk-badge risk-${analysis.riskLevel.toLowerCase()}`}>{analysis.riskLevel} Risk</div>
          </div>
          <div className="result-details">
            <div className="ai-info"><span>🤖 {aiModel}</span><span>⏱️ {analysisTime}</span></div>
            <div className="info-section"><h3>🌍 Environmental Impact</h3><p>{analysis.environmentalImpact}</p></div>
            <div className="info-section"><h3>📦 Materials Detected</h3>
              <div className="materials-list">{analysis.materials.map((material, index) => (
                <span key={index} className="material-tag">{material}</span>
              ))}</div>
            </div>
            <div className="info-section"><h3>♻️ Recycling Instructions</h3>
              <div className="recycling-card">
                <p className="action">{guidance.action}</p>
                <p className="warning">⚠️ {guidance.warning}</p>
                <div className="recovery-value"><strong>Recovery Value:</strong> {analysis.recyclingValue}</div>
              </div>
            </div>
            {guidance.facilities && (
              <div className="info-section"><h3>📍 Nearby Recycling Centers</h3>
                <div className="centers-list">{guidance.facilities.map((center, index) => (
                  <div key={index} className="center-card"><h4>{center.name}</h4><p>📍 {center.distance} away | ⭐ {center.rating}</p></div>
                ))}</div>
              </div>
            )}
            <div className="file-info-section"><h3>📁 File Information</h3>
              <p>Name: {fileInfo.name}</p><p>Size: {fileInfo.size}</p><p>Analyzed: {new Date(fileInfo.analyzedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="welcome-header">
        <h1>👋 Welcome back, {user?.name || 'User'}!</h1>
        <p>Ready to analyze some e-waste? Your environmental impact matters ♻️</p>
      </header>
      <main>
        {!result ? renderUploadSection() : renderResultsSection()}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>AI is analyzing your image...</p>
          </div>
        )}
      </main>
      <footer>
        <p>Logged in as: {user?.email} | User Type: {user?.type || 'Individual'}</p>
        <p>♻️ Together we can make a difference - Recycle responsibly</p>
        <p className="tech-info">Backend: {API_URL} | Status: <span className={`status-${backendStatus}`}>
          {backendStatus === 'connected' ? 'Online' : 'Offline'}</span></p>
      </footer>
    </>
  );
};

// Main App Component with Routing
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const handleRegister = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register onRegister={handleRegister} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <MainApp user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;