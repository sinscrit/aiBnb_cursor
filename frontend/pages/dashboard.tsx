/**
 * Dashboard Page
 * QR Code-Based Instructional System - Main Dashboard
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/Layout/DashboardLayout';

const Dashboard = () => {
  const router = useRouter();
  const [systemStatus, setSystemStatus] = useState({
    backend: 'checking',
    database: 'checking',
    items: 'checking',
    properties: 'checking'
  });

  useEffect(() => {
    // Check system status
    const checkSystemStatus = async () => {
      try {
        // Check backend health
        const healthResponse = await fetch('http://localhost:3001/health');
        const backendStatus = healthResponse.ok ? 'online' : 'offline';

        // Check properties API
        const propertiesResponse = await fetch('http://localhost:3001/api/properties');
        const propertiesStatus = propertiesResponse.ok ? 'online' : 'offline';

        // Check items API
        const itemsResponse = await fetch('http://localhost:3001/api/items?propertyId=550e8400-e29b-41d4-a716-446655440001');
        const itemsStatus = itemsResponse.ok ? 'online' : 'offline';

        setSystemStatus({
          backend: backendStatus,
          database: backendStatus === 'online' ? 'connected' : 'disconnected',
          items: itemsStatus,
          properties: propertiesStatus
        });
      } catch (error) {
        setSystemStatus({
          backend: 'offline',
          database: 'disconnected',
          items: 'offline',
          properties: 'offline'
        });
      }
    };

    checkSystemStatus();
  }, []);

  const quickActions = [
    {
      title: 'Manage Properties',
      description: 'Create and manage your rental properties',
      icon: '🏢',
      action: () => router.push('/properties'),
      status: systemStatus.properties
    },
    {
      title: 'Manage Items',
      description: 'Add items to properties and track locations',
      icon: '📦',
      action: () => router.push('/items'),
      status: systemStatus.items
    },
    {
      title: 'Generate QR Codes',
      description: 'Create QR codes for instant access to instructions',
      icon: '📱',
      action: () => router.push('/qrcodes'),
      status: 'pending'
    },
    {
      title: 'View Content',
      description: 'See how your QR codes appear to guests',
      icon: '🔗',
      action: () => alert('Content display coming soon!'),
      status: 'pending'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
        return '#10b981';
      case 'offline':
      case 'disconnected':
        return '#ef4444';
      case 'checking':
        return '#f59e0b';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'checking':
        return 'Checking...';
      case 'pending':
        return 'Coming Soon';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="dashboard">
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome to QR Instructional System</h2>
          <p className="welcome-text">
            Manage your rental properties, add items, and create QR codes for instant guest access to instructions.
          </p>
          <div className="demo-notice">
            <span className="demo-icon">🚀</span>
            <span className="demo-text">
              <strong>Demo Mode:</strong> You're using a demonstration version with sample data
            </span>
          </div>
        </div>

        <div className="quick-actions-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="action-card"
                onClick={action.action}
              >
                <div className="action-header">
                  <span className="action-icon">{action.icon}</span>
                  <div 
                    className="action-status"
                    style={{ color: getStatusColor(action.status) }}
                  >
                    {getStatusText(action.status)}
                  </div>
                </div>
                <h4 className="action-title">{action.title}</h4>
                <p className="action-description">{action.description}</p>
                <div className="action-button">
                  {action.status === 'pending' ? 'Coming Soon' : 'Access →'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="system-status-section">
          <h3 className="section-title">System Status</h3>
          <div className="status-grid">
            <div className="status-card">
              <div className="status-header">
                <span className="status-label">Backend API</span>
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(systemStatus.backend) }}
                ></div>
              </div>
              <div className="status-value">{getStatusText(systemStatus.backend)}</div>
            </div>
            
            <div className="status-card">
              <div className="status-header">
                <span className="status-label">Database</span>
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(systemStatus.database) }}
                ></div>
              </div>
              <div className="status-value">{getStatusText(systemStatus.database)}</div>
            </div>
            
            <div className="status-card">
              <div className="status-header">
                <span className="status-label">Properties API</span>
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(systemStatus.properties) }}
                ></div>
              </div>
              <div className="status-value">{getStatusText(systemStatus.properties)}</div>
            </div>
            
            <div className="status-card">
              <div className="status-header">
                <span className="status-label">Items API</span>
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(systemStatus.items) }}
                ></div>
              </div>
              <div className="status-value">{getStatusText(systemStatus.items)}</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 100%;
        }

        .welcome-section {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .welcome-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .welcome-text {
          color: #6b7280;
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }

        .demo-notice {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .demo-text {
          color: #92400e;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1.5rem 0;
        }

        .quick-actions-section {
          margin-bottom: 2rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .action-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid #e5e7eb;
        }

        .action-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .action-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .action-icon {
          font-size: 2rem;
        }

        .action-status {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .action-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .action-description {
          color: #6b7280;
          margin: 0 0 1rem 0;
          line-height: 1.4;
        }

        .action-button {
          color: #3b82f6;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .status-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .status-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .status-indicator {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
        }

        .status-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .welcome-section {
            padding: 1.5rem;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .status-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Dashboard; 