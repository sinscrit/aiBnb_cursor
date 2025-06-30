/**
 * Properties Listing Page
 * QR Code-Based Instructional System - Property Management Interface
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PropertyList from '../../components/Property/PropertyList';
import { apiService, apiHelpers } from '../../utils/api';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../utils/constants';

const PropertiesPage = () => {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch properties from API using centralized service
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.properties.getAll();
      const data = apiHelpers.extractData(response);
      
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      const errorInfo = apiHelpers.handleError(error);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete property using centralized service
  const handleDeleteProperty = async (propertyId) => {
    try {
      const response = await apiService.properties.delete(propertyId);
      const data = apiHelpers.extractData(response);

        // Remove the deleted property from the list
      setProperties(prev => prev.filter(property => property.property_id !== propertyId));
        
        // Show success message
      alert(`Property "${data.deleted_property?.name || 'Property'}" was successfully deleted.`);
    } catch (error) {
      console.error('Error deleting property:', error);
      const errorInfo = apiHelpers.handleError(error);
      alert(`Failed to delete property: ${errorInfo.message}`);
      throw error; // Re-throw to be handled by PropertyCard component
    }
  };

  // Navigate to create property page
  const handleCreateProperty = () => {
    router.push('/properties/create');
  };

  // Load properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Error state
  if (error && !loading) {
    return (
      <DashboardLayout title="Properties">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Failed to Load Properties</h3>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button 
                onClick={fetchProperties}
                className="btn-primary"
              >
                Try Again
              </button>
              <button 
                onClick={handleCreateProperty}
                className="btn-secondary"
              >
                Create Property
              </button>
            </div>
          </div>
          
          <style jsx>{`
            .error-container {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 400px;
            }

            .error-content {
              text-align: center;
              background: white;
              padding: 3rem 2rem;
              border-radius: 0.5rem;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
              border: 1px solid #e5e7eb;
              max-width: 400px;
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
              margin: 0 0 2rem 0;
              line-height: 1.5;
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
              background: #3b82f6;
              color: white;
            }

            .btn-primary:hover {
              background: #2563eb;
            }

            .btn-secondary {
              background: #6b7280;
              color: white;
            }

            .btn-secondary:hover {
              background: #4b5563;
            }
          `}</style>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Properties">
      <div className="properties-page">
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">Property Management</h1>
              <p className="page-description">
                Manage your rental properties and their associated items. Create new properties to start organizing your QR code system.
              </p>
            </div>
            <div className="header-actions">
              <button 
                onClick={handleCreateProperty}
                className="btn-primary"
                disabled={loading}
              >
                <span className="btn-icon">+</span>
                Create Property
              </button>
            </div>
          </div>
        </div>

        <div className="page-content">
          <PropertyList 
            properties={properties}
            loading={loading}
            onDeleteProperty={handleDeleteProperty}
          />
        </div>

        {/* Refresh button for development */}
        <div className="page-footer">
          <button 
            onClick={fetchProperties}
            className="btn-outline"
            disabled={loading}
          >
            <span className="refresh-icon">🔄</span>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .properties-page {
          max-width: 100%;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .header-text {
          flex: 1;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .page-description {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
          font-size: 1rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 1rem;
          font-weight: bold;
        }

        .page-content {
          margin-bottom: 2rem;
        }

        .page-footer {
          display: flex;
          justify-content: center;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-outline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-outline:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-outline:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .refresh-icon {
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
          }

          .btn-primary {
            width: 100%;
            justify-content: center;
          }

          .page-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default PropertiesPage; 