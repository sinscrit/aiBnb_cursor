/**
 * Error Display Component
 * QR Code-Based Instructional System - Error Presentation
 */

import React from 'react';

const ErrorDisplay = ({ 
  icon = '⚠️',
  title = 'Error',
  message = 'An unexpected error occurred.',
  retryable = true,
  onRetry,
  details,
  className = ''
}) => {
  return (
    <div className={`error-display ${className}`}>
      <div className="error-content">
        <div className="error-icon">{icon}</div>
        <h3 className="error-title">{title}</h3>
        <p className="error-message">{message}</p>
        
        {details && (
          <div className="error-details">
            <pre>{JSON.stringify(details, null, 2)}</pre>
          </div>
        )}

        <div className="error-actions">
          {retryable && onRetry && (
            <button 
              onClick={onRetry}
              className="btn-primary"
            >
              Try Again
            </button>
          )}
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-secondary"
          >
            Go to Home
          </button>
        </div>
      </div>

      <style jsx>{`
        .error-display {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          width: 100%;
        }

        .error-content {
          text-align: center;
          background: white;
          padding: 3rem 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          max-width: 500px;
          width: 100%;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .error-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .error-message {
          color: #6b7280;
          margin: 0 0 1.5rem 0;
          line-height: 1.5;
        }

        .error-details {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .error-details pre {
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #4b5563;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background-color: #2563eb;
        }

        .btn-secondary {
          background-color: #f3f4f6;
          color: #1f2937;
        }

        .btn-secondary:hover {
          background-color: #e5e7eb;
        }

        @media (max-width: 640px) {
          .error-content {
            padding: 2rem 1rem;
            margin: 1rem;
          }

          .error-icon {
            font-size: 2.5rem;
          }

          .error-actions {
            flex-direction: column;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ErrorDisplay; 