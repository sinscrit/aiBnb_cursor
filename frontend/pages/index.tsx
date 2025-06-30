/**
 * Homepage Component
 * QR Code-Based Instructional System - Dashboard Homepage
 */

import { useState } from 'react';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    // Navigate to properties page (will be implemented later)
    setTimeout(() => {
      setIsLoading(false);
      alert('Properties page will be implemented in upcoming tasks!');
    }, 1000);
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            QR Code Instructional System
          </h1>
          <p className="hero-subtitle">
            Create properties, add items, generate QR codes, and provide instant access to instructions for your rental guests.
          </p>
          <p className="demo-notice">
            🚀 <strong>Demo Mode:</strong> You're using a demonstration version with a hardcoded demo user. Full authentication will be added in later sprints.
          </p>
          
          <div className="hero-actions">
            <button 
              className="btn-primary"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Get Started'}
            </button>
            <button className="btn-secondary">
              View Documentation
            </button>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2>What you can do:</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🏠 Property Management</h3>
            <p>Create and manage your rental properties with detailed information.</p>
          </div>
          <div className="feature-card">
            <h3>📦 Item Registration</h3>
            <p>Add items to properties with location tracking and descriptions.</p>
          </div>
          <div className="feature-card">
            <h3>📱 QR Code Generation</h3>
            <p>Generate unique QR codes for each item with instant content access.</p>
          </div>
          <div className="feature-card">
            <h3>🔗 Dynamic Content</h3>
            <p>Mobile-optimized pages that load instantly when QR codes are scanned.</p>
          </div>
        </div>
      </div>
      
      <div className="status-section">
        <h2>System Status</h2>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">Backend API:</span>
            <span className="status-value">Running</span>
          </div>
          <div className="status-item">
            <span className="status-label">Database:</span>
            <span className="status-value">Connected</span>
          </div>
          <div className="status-item">
            <span className="status-label">Demo User:</span>
            <span className="status-value">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 