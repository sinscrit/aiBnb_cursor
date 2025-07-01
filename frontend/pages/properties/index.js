/**
 * Properties Listing Page
 * QR Code-Based Instructional System - Property Management Interface
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PropertyList from '../../components/Property/PropertyList';
import { apiService, apiHelpers } from '../../utils/api';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, API_BASE_URL, API_ENDPOINTS } from '../../utils/constants';

const PropertiesPage = () => {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log('=== PROPERTIES PAGE STATE UPDATE ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Properties count:', properties.length);
    console.log('Retry count:', retryCount);
    console.log('================================');
  }, [loading, error, properties, retryCount]);

  // Fetch properties from API using centralized service
  const fetchProperties = async () => {
    try {
      console.log('=== FETCH PROPERTIES START ===');
      console.log('Attempt:', retryCount + 1);
      console.log('Timestamp:', new Date().toISOString());
      
      setLoading(true);
      setError(null);

      const response = await apiService.properties.getAll();
      const data = apiHelpers.extractData(response);
      
      if (data && Array.isArray(data.properties)) {
        setProperties(data.properties);
        setRetryCount(0); // Reset retry count on success
        
        console.log('=== FETCH PROPERTIES SUCCESS ===');
        console.log('Properties loaded:', data.properties.length);
      } else {
        throw new Error('Invalid data format received from API');
      }
    } catch (error) {
      console.error('=== FETCH PROPERTIES ERROR ===');
      const errorInfo = apiHelpers.handleError(error);
      
      setError(errorInfo);
      setRetryCount(prev => prev + 1);
      setProperties([]); // Reset properties on error
      
      console.error('Error details:', errorInfo);
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
      setProperties(prev => prev.filter(property => property.id !== propertyId));
        
      // Show success message
      alert(SUCCESS_MESSAGES.PROPERTY_DELETED);
    } catch (error) {
      const errorInfo = apiHelpers.handleError(error);
      alert(errorInfo.message);
    }
  };

  // Navigate to create property page
  const handleCreateProperty = () => {
    router.push('/properties/create');
  };

  // Load properties on component mount and retry on error
  useEffect(() => {
    fetchProperties();
  }, []); // Only run on mount

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Properties">
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h3 className="loading-text">Loading Properties...</h3>
          </div>
          
          <style jsx>{`
            .loading-container {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 400px;
            }

            .loading-content {
              text-align: center;
            }

            .loading-spinner {
              border: 4px solid #f3f3f3;
              border-top: 4px solid #3b82f6;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto 1rem;
            }

            .loading-text {
              color: #666;
              font-size: 1.1rem;
              margin: 0;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <DashboardLayout title="Properties">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Failed to Load Properties</h3>
            <p className="error-message">{error.message}</p>
            <div className="error-details">
              <p>Status: {error.status}</p>
              {error.details && (
                <p>Details: {JSON.stringify(error.details)}</p>
              )}
            </div>
            <div className="error-actions">
              <button 
                onClick={fetchProperties}
                className="btn-primary"
                disabled={loading}
              >
                Try Again ({retryCount})
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
              max-width: 500px;
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
              margin: 0 0 1rem 0;
              line-height: 1.5;
            }

            .error-details {
              background: #f9fafb;
              padding: 1rem;
              border-radius: 0.375rem;
              margin-bottom: 2rem;
              text-align: left;
              font-family: monospace;
              font-size: 0.875rem;
            }

            .error-details p {
              margin: 0.25rem 0;
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

            .btn-primary:disabled {
              background-color: #93c5fd;
              cursor: not-allowed;
            }

            .btn-secondary {
              background-color: #f3f4f6;
              color: #1f2937;
            }

            .btn-secondary:hover {
              background-color: #e5e7eb;
            }
          `}</style>
        </div>
      </DashboardLayout>
    );
  }

  // Success state
  return (
    <DashboardLayout title="Properties">
      <PropertyList 
        properties={properties}
        onDelete={handleDeleteProperty}
        onCreate={handleCreateProperty}
      />
    </DashboardLayout>
  );
};

export default PropertiesPage; 