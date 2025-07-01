/**
 * Error Boundary Component
 * QR Code-Based Instructional System - Error Handling
 */

import React from 'react';
import { getErrorBoundaryProps } from '../../utils/errorHandling';
import ErrorDisplay from './ErrorDisplay';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      error: null,
      errorInfo: null,
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      error,
      hasError: true 
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
      hasError: true
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('=== ERROR BOUNDARY CAUGHT ERROR ===');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('================================');
    }
  }

  handleRetry = () => {
    this.setState({ 
      error: null,
      errorInfo: null,
      hasError: false 
    });
  };

  render() {
    if (this.state.hasError) {
      const errorProps = getErrorBoundaryProps(this.state.error);
      
      return (
        <div className="error-boundary">
          <ErrorDisplay 
            {...errorProps}
            onRetry={this.handleRetry}
          />

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="error-details">
              <summary>Error Details</summary>
              <pre>{this.state.error?.toString()}</pre>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}

          <style jsx>{`
            .error-boundary {
              padding: 2rem;
              max-width: 800px;
              margin: 0 auto;
            }

            .error-details {
              margin-top: 2rem;
              padding: 1rem;
              background: #f9fafb;
              border-radius: 0.375rem;
              border: 1px solid #e5e7eb;
            }

            .error-details summary {
              cursor: pointer;
              color: #4b5563;
              font-weight: 500;
              margin-bottom: 1rem;
            }

            .error-details pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-size: 0.875rem;
              line-height: 1.5;
              color: #6b7280;
              margin: 0.5rem 0;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 