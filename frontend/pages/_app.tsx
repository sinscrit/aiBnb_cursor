/**
 * Next.js App Component
 * QR Code-Based Instructional System - Main App Setup
 */

import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>QR Instructional System</h1>
            <span className="demo-badge">Demo Mode</span>
          </div>
        </nav>
      </header>
      
      <main className="app-main">
        <Component {...pageProps} />
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2025 QR Code Instructional System - Demo Version</p>
      </footer>
    </div>
  );
}

export default MyApp; 