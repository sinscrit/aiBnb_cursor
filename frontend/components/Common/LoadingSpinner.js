/**
 * Loading Spinner Component
 * QR Code-Based Instructional System - Loading Indicator
 */

import React from 'react';
import { LoadingTypes, LoadingConfig, LoadingMessages } from '../../utils/loadingState';

const LoadingSpinner = ({ 
  type = LoadingTypes.COMPONENT,
  message = LoadingMessages.default,
  size = 'medium',
  className = ''
}) => {
  const config = LoadingConfig[type];
  const showMessage = config.message && message;

  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return {
          width: '20px',
          height: '20px',
          border: '2px'
        };
      case 'large':
        return {
          width: '48px',
          height: '48px',
          border: '4px'
        };
      default: // medium
        return {
          width: '32px',
          height: '32px',
          border: '3px'
        };
    }
  };

  const spinnerSize = getSpinnerSize();

  return (
    <div className={`loading-spinner ${className}`}>
      {config.spinner && (
        <div 
          className="spinner"
          style={{
            width: spinnerSize.width,
            height: spinnerSize.height,
            borderWidth: spinnerSize.border
          }}
        />
      )}
      
      {showMessage && (
        <p className="message">{message}</p>
      )}

      <style jsx>{`
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .spinner {
          border-style: solid;
          border-color: #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .message {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner; 