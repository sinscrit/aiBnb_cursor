/**
 * Navigation Component
 * QR Code-Based Instructional System - Common Navigation Menu
 */

import { useRouter } from 'next/router';
import Link from 'next/link';

const Navigation = () => {
  const router = useRouter();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/properties', label: 'Properties', icon: '🏢' },
    { path: '/items', label: 'Items', icon: '📦' },
    { path: '/qrcodes', label: 'QR Codes', icon: '📱' }
  ];

  const isActivePath = (path) => {
    if (path === '/dashboard') {
      return router.pathname === '/dashboard';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link href="/">
          <span className="nav-logo">QR System</span>
        </Link>
      </div>
      
      <div className="nav-links">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="nav-user">
        <div className="demo-user-indicator">
          <span className="user-icon">👤</span>
          <span className="user-name">Demo User</span>
          <span className="demo-badge">DEMO</span>
        </div>
      </div>

      <style jsx>{`
        .navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .nav-brand {
          font-weight: bold;
          font-size: 1.25rem;
          color: #1f2937;
        }

        .nav-logo {
          cursor: pointer;
          transition: color 0.2s;
        }

        .nav-logo:hover {
          color: #3b82f6;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: #6b7280;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }

        .nav-link:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .nav-link.active {
          background: #dbeafe;
          color: #1d4ed8;
          font-weight: 500;
        }

        .nav-icon {
          font-size: 1rem;
        }

        .nav-label {
          font-size: 0.875rem;
        }

        .nav-user {
          display: flex;
          align-items: center;
        }

        .demo-user-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .user-icon {
          font-size: 1rem;
        }

        .user-name {
          color: #92400e;
          font-weight: 500;
        }

        .demo-badge {
          background: #f59e0b;
          color: white;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .navigation {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .nav-links {
            flex-wrap: wrap;
            justify-content: center;
          }

          .nav-label {
            display: none;
          }

          .nav-link {
            padding: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation; 