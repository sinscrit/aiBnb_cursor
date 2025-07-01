/**
 * Loading Overlay Component
 * QR Code-Based Instructional System - Full-Screen Loading
 */

import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { LoadingTypes, LoadingMessages } from '../../utils/loadingState';

const LoadingOverlay = ({ 
  type = LoadingTypes.PAGE,
  message = LoadingMessages.default,
  transparent = false,
  blur = false,
  className = ''
}) => {
  return (
    <div className={`loading-overlay ${transparent ? 'transparent' : ''} ${blur ? 'blur' : ''} ${className}`}>
      <div className="loading-content">
        <LoadingSpinner 
          type={type}
          message={message}
          size="large"
        />
      </div>

      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.9);
          z-index: 9999;
          transition: all 0.3s ease;
        }

        .loading-overlay.transparent {
          background-color: rgba(255, 255, 255, 0.5);
        }

        .loading-overlay.blur {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .loading-content {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        @media (max-width: 640px) {
          .loading-content {
            padding: 1.5rem;
            margin: 1rem;
          }
        }

        @media (prefers-reduced-motion) {
          .loading-overlay {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay; 