/**
 * Create Item Page
 * QR Code-Based Instructional System - Create new items for properties
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ItemForm from '../../components/Item/ItemForm';
import { apiService, apiHelpers } from '../../utils/api';

const CreateItemPage = () => {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract propertyId from URL params if provided
  const { propertyId } = router.query;

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.properties.getAll();
      const data = apiHelpers.extractData(response);
      
      // Log properties for debugging
      console.log('Loaded properties:', data.properties);
      
      setProperties(data.properties || []);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError(apiHelpers.handleError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Log form data for debugging
      console.log('Submitting form data:', formData);
      
      const response = await apiService.items.create(formData);
      const data = apiHelpers.extractData(response);
      
      // Show success message
      alert(`Item "${data.item.name}" created successfully!`);
      
      // Navigate back to items list
      if (propertyId) {
        router.push(`/items?propertyId=${propertyId}`);
      } else {
        router.push('/items');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      throw error; // Re-throw to let ItemForm handle the error display
    }
  };

  const handleCancel = () => {
    if (propertyId) {
      router.push(`/items?propertyId=${propertyId}`);
    } else {
      router.push('/items');
    }
  };

  const getSelectedProperty = () => {
    if (!propertyId) return null;
    return properties.find(p => p.id === propertyId);
  };

  const selectedProperty = getSelectedProperty();

  if (error) {
  return (
      <DashboardLayout>
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Failed to Load Properties</h1>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button 
                onClick={loadProperties}
                className="btn-primary"
              >
                Try Again
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="btn-secondary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .error-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            padding: 2rem;
          }

          .error-content {
            text-align: center;
            max-width: 400px;
          }

          .error-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .error-title {
            font-size: 1.5rem;
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
            flex-wrap: wrap;
          }

          .btn-primary,
          .btn-secondary {
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
          }

          .btn-primary {
            background: #3b82f6;
            color: white;
          }

          .btn-primary:hover {
            background: #2563eb;
          }

          .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
          }

          .btn-secondary:hover {
            background: #e5e7eb;
          }
        `}</style>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading properties...</p>
          </div>
              </div>

        <style jsx>{`
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            padding: 2rem;
          }

          .loading-content {
            text-align: center;
          }

          .loading-spinner {
            width: 2rem;
            height: 2rem;
            border: 3px solid #f3f4f6;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem auto;
          }

          .loading-text {
            color: #6b7280;
            margin: 0;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </DashboardLayout>
    );
  }

  if (properties.length === 0) {
    return (
      <DashboardLayout>
        <div className="no-properties-container">
          <div className="no-properties-content">
            <div className="no-properties-icon">🏠</div>
            <h1 className="no-properties-title">No Properties Found</h1>
            <p className="no-properties-message">
              You need to create a property first before adding items. Properties help organize your items and QR codes.
            </p>
            <div className="no-properties-actions">
              <button 
                onClick={() => router.push('/properties/create')}
                className="btn-primary"
              >
                Create Property
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="btn-secondary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .no-properties-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            padding: 2rem;
          }

          .no-properties-content {
            text-align: center;
            max-width: 500px;
          }

          .no-properties-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.7;
          }

          .no-properties-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 0.5rem 0;
          }

          .no-properties-message {
            color: #6b7280;
            margin: 0 0 2rem 0;
            line-height: 1.6;
          }

          .no-properties-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          .btn-primary,
          .btn-secondary {
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
          }

          .btn-primary {
            background: #3b82f6;
            color: white;
          }

          .btn-primary:hover {
            background: #2563eb;
          }

          .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
          }

          .btn-secondary:hover {
            background: #e5e7eb;
          }
        `}</style>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="create-item-page">
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">Create New Item</h1>
              <p className="page-subtitle">
                Add a new item to generate QR codes and manage guest instructions
              </p>
          </div>
            <div className="header-actions">
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>

          {selectedProperty && (
            <div className="property-notice">
              <span className="property-icon">🏠</span>
              <span className="property-text">
                Adding item to: <strong>{selectedProperty.name}</strong>
              </span>
              <button
                onClick={() => router.push('/items/create')}
                className="change-property-btn"
              >
                Change Property
              </button>
          </div>
        )}
        </div>

        <div className="page-content">
          <ItemForm
            properties={properties}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            mode="create"
          />
        </div>
      </div>

      <style jsx>{`
        .create-item-page {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 1rem;
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

        .page-subtitle {
          color: #6b7280;
          margin: 0;
          font-size: 1rem;
          line-height: 1.5;
        }

        .header-actions {
          flex-shrink: 0;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .property-notice {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #ecfdf5;
          border: 1px solid #10b981;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #047857;
        }

        .property-icon {
          font-size: 1rem;
        }

        .property-text {
          flex: 1;
        }

        .change-property-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .change-property-btn:hover {
          background: #059669;
        }

        .page-content {
          min-height: 400px;
        }

        @media (max-width: 768px) {
          .create-item-page {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .property-notice {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
            text-align: center;
          }

          .change-property-btn {
            align-self: center;
            width: fit-content;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default CreateItemPage;