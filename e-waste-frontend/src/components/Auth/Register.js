// src/components/Auth/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'recycler' // recycler, collector, business, individual
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userTypes = [
    { id: 'individual', label: '👤 Individual', desc: 'Personal e-waste disposal' },
    { id: 'recycler', label: '♻️ Recycler', desc: 'Professional recycling service' },
    { id: 'collector', label: '🏪 Collector', desc: 'Collection center/point' },
    { id: 'business', label: '🏢 Business', desc: 'Company/organization' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    // Mock registration for demo
    setTimeout(() => {
      // In real app: await fetch('/api/register', {...})
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
      
      if (onRegister) onRegister(userData);
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
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">📧 Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">🔒 Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">✅ Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>🎯 I am a...</label>
            <div className="user-type-grid">
              {userTypes.map((type) => (
                <label 
                  key={type.id}
                  className={`user-type-card ${formData.userType === type.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value={type.id}
                    checked={formData.userType === type.id}
                    onChange={handleChange}
                  />
                  <div className="type-content">
                    <div className="type-icon">{type.label.split(' ')[0]}</div>
                    <div className="type-info">
                      <strong>{type.label.split(' ')[1]}</strong>
                      <small>{type.desc}</small>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group terms">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>
          </div>

          <button 
            type="submit" 
            className="auth-btn primary"
            disabled={loading}
          >
            {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>

      <div className="auth-features">
        <h3>🎁 Account Benefits</h3>
        <div className="benefits">
          <div className="benefit">
            <div className="benefit-icon">📊</div>
            <div className="benefit-text">
              <strong>Analytics Dashboard</strong>
              <p>Track your recycling impact</p>
            </div>
          </div>
          
          <div className="benefit">
            <div className="benefit-icon">🏆</div>
            <div className="benefit-text">
              <strong>Earn Badges</strong>
              <p>Unlock achievements for recycling</p>
            </div>
          </div>
          
          <div className="benefit">
            <div className="benefit-icon">📱</div>
            <div className="benefit-text">
              <strong>Mobile Access</strong>
              <p>Use app on any device</p>
            </div>
          </div>
          
          <div className="benefit">
            <div className="benefit-icon">🔔</div>
            <div className="benefit-text">
              <strong>Notifications</strong>
              <p>Get recycling reminders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;