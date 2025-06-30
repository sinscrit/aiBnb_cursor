/**
 * Dashboard Layout Component
 * QR Code-Based Instructional System - Main Layout Structure
 */

import Navigation from '../Common/Navigation';

const DashboardLayout = ({ children, title = 'QR Instructional System' }) => {
  return (
    <div className="dashboard-layout">
      <div className="layout-header">
        <Navigation />
      </div>
      
      <main className="layout-main">
        <div className="layout-container">
          {title && (
            <div className="page-header">
              <h1 className="page-title">{title}</h1>
            </div>
          )}
          <div className="page-content">
            {children}
          </div>
        </div>
      </main>

      <footer className="layout-footer">
        <div className="footer-content">
          <div className="footer-section">
            <p className="footer-text">
              QR Code Instructional System - Demo Version
            </p>
            <p className="footer-subtext">
              Built for rental property management
            </p>
          </div>
          <div className="footer-section">
            <div className="footer-links">
              <span className="footer-link">Documentation</span>
              <span className="footer-link">Support</span>
              <span className="footer-link">About</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .dashboard-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f9fafb;
        }

        .layout-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: white;
        }

        .layout-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .layout-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem;
          flex: 1;
        }

        .page-header {
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .page-content {
          flex: 1;
        }

        .layout-footer {
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          padding: 2rem 0;
          margin-top: auto;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .footer-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin: 0;
        }

        .footer-subtext {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer-link {
          font-size: 0.875rem;
          color: #6b7280;
          cursor: pointer;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: #374151;
        }

        @media (max-width: 768px) {
          .layout-container {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .footer-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            padding: 0 1rem;
          }

          .footer-links {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout; 