/**
 * Application Entry Point
 * QR Code-Based Instructional System - Main App Component
 */

import ErrorBoundary from '../components/Common/ErrorBoundary';
import { logError } from '../utils/errorHandling';

// Global error handler for unhandled errors
if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    logError(error || new Error(message), {
      source,
      lineno,
      colno,
      type: 'window.onerror'
    });
  };

  window.onunhandledrejection = (event) => {
    logError(event.reason, {
      type: 'unhandledrejection',
      promise: event.promise
    });
  };
}

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp; 