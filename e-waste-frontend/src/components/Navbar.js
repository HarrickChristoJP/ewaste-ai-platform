import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">♻️</span>
          <span className="logo-text">E-Waste AI</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">
                🏠 Home
              </Link>
              <Link to="/history" className="nav-link">
                📊 History
              </Link>
              <Link to="/centers" className="nav-link">
                📍 Centers
              </Link>
              <Link to="/dashboard" className="nav-link">
                📈 Dashboard
              </Link>
              
              {/* User Profile */}
              <div className="user-profile">
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name || 'User'}</span>
                  <span className="user-email">{user?.email || 'user@example.com'}</span>
                </div>
                <div className="dropdown">
                  <button className="dropdown-toggle">
                    ⏷
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      👤 Profile
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      ⚙️ Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button 
                      onClick={handleLogout} 
                      className="dropdown-item logout"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                🔐 Login
              </Link>
              <Link to="/register" className="nav-link register">
                🚀 Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;