// src/components/Auth/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication for demo
    setTimeout(() => {
      // In real app, call your backend API
      // const response = await fetch('/api/login', {...})
      
      if (formData.email && formData.password) {
        // Store user data in localStorage
        const userData = {
          email: formData.email,
          name: formData.email.split('@')[0],
          token: 'mock-jwt-token-' + Date.now()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        if (onLogin) onLogin(userData);
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
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="auth-btn primary"
            disabled={loading}
          >
            {loading ? '🔐 Signing in...' : '🔐 Sign In'}
          </button>

          <div className="demo-buttons">
            <p className="demo-label">Quick Demo Login:</p>
            <div className="demo-btns">
              <button 
                type="button" 
                className="demo-btn admin"
                onClick={() => handleDemoLogin('admin')}
              >
                👑 Admin
              </button>
              <button 
                type="button" 
                className="demo-btn user"
                onClick={() => handleDemoLogin('user')}
              >
                👤 User
              </button>
              <button 
                type="button" 
                className="demo-btn guest"
                onClick={() => handleDemoLogin('guest')}
              >
                👋 Guest
              </button>
            </div>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button type="button" className="auth-btn google">
            <span>🔗</span> Continue with Google
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>

      <div className="auth-features">
        <h3>🌟 Why Create an Account?</h3>
        <ul>
          <li>📊 Save your analysis history</li>
          <li>📈 Track your environmental impact</li>
          <li>🏆 Earn recycling badges</li>
          <li>📍 Save favorite recycling centers</li>
          <li>📱 Access from multiple devices</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;