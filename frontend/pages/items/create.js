/**
 * Create Item Page
 * QR Code-Based Instructional System - New Item Creation Interface
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ItemForm from '../../components/Item/ItemForm';

const CreateItemPage = () => {
  const router = useRouter();
  const { propertyId } = router.query; // Support pre-selecting property via URL
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/properties', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProperties(data.data.properties || []);
      } else {
        throw new Error(data.message || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit new item
  const handleSubmit = async (itemData) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Success! Navigate back to items list or the specific property's items
        const createdItem = data.data.item;
        
        // Show success message
        alert(`Item "${createdItem.name}" was successfully created!`);
        
        // Navigate back to items list, filtering by property if we came from a specific property
        if (propertyId) {
          router.push(`/items?propertyId=${propertyId}`);
        } else {
          router.push('/items');
        }
      } else {
        throw new Error(data.message || 'Failed to create item');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Load properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Get selected property for breadcrumbs
  const selectedProperty = properties.find(p => p.id === propertyId);

  return (
    <DashboardLayout title="Create Item">
      <div className="create-item-page">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <button 
            onClick={() => router.push('/dashboard')}
            className="breadcrumb-link"
          >
            Dashboard
          </button>
          <span className="breadcrumb-separator">›</span>
          <button 
            onClick={() => router.push('/items')}
            className="breadcrumb-link"
          >
            Items
          </button>
          {selectedProperty && (
            <>
              <span className="breadcrumb-separator">›</span>
              <button 
                onClick={() => router.push(`/items?propertyId=${propertyId}`)}
                className="breadcrumb-link"
              >
                {selectedProperty.name}
              </button>
            </>
          )}
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Create</span>
        </nav>

        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Create New Item</h1>
            <p className="page-description">
              {selectedProperty 
                ? `Add a new item to ${selectedProperty.name}. This could be an appliance, instruction set, or any content you want to share with guests via QR codes.`
                : 'Add a new item to your property. This could be an appliance, instruction set, or any content you want to share with guests via QR codes.'
              }
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="error-dismiss"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* No Properties Notice */}
        {!loading && properties.length === 0 && (
          <div className="no-properties-notice">
            <div className="notice-content">
              <span className="notice-icon">ℹ️</span>
              <div className="notice-text">
                <strong>No Properties Found</strong>
                <p>You need to create a property before you can add items. Properties help organize your items by location.</p>
              </div>
              <button 
                onClick={() => router.push('/properties/create')}
                className="btn-primary"
              >
                Create Property
              </button>
            </div>
          </div>
        )}

        {/* Form Content */}
        {!loading && properties.length > 0 && (
          <div className="form-container">
            <ItemForm 
              properties={properties}
              defaultPropertyId={propertyId}
              onSubmit={handleSubmit}
              loading={submitting}
              onCancel={() => {
                if (propertyId) {
                  router.push(`/items?propertyId=${propertyId}`);
                } else {
                  router.push('/items');
                }
              }}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading properties...</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .create-item-page {
          max-width: 800px;
          margin: 0 auto;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }

        .breadcrumb-link {
          color: #3b82f6;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
          padding: 0;
          font-size: inherit;
        }

        .breadcrumb-link:hover {
          text-decoration: underline;
        }

        .breadcrumb-separator {
          color: #9ca3af;
        }

        .breadcrumb-current {
          color: #6b7280;
          font-weight: 500;
        }

        .page-header {
          margin-bottom: 2rem;
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
        }

        .error-banner {
          margin-bottom: 2rem;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #fee2e2;
          border: 1px solid #f87171;
          border-radius: 0.5rem;
          color: #dc2626;
        }

        .error-icon {
          font-size: 1.25rem;
        }

        .error-message {
          flex: 1;
          font-size: 0.875rem;
        }

        .error-dismiss {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-size: 1.25rem;
          padding: 0;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-dismiss:hover {
          background: rgba(239, 68, 68, 0.1);
          border-radius: 0.25rem;
        }

        .no-properties-notice {
          display: flex;
          justify-content: center;
          padding: 3rem 1rem;
        }

        .notice-content {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          max-width: 400px;
        }

        .notice-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .notice-text strong {
          display: block;
          font-size: 1.125rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .notice-text p {
          color: #6b7280;
          margin: 0 0 2rem 0;
          line-height: 1.5;
        }

        .btn-primary {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .form-container {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

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
          width: 2rem;
          height: 2rem;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        .loading-text {
          color: #6b7280;
          margin: 0;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .create-item-page {
            margin: 0 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .breadcrumbs {
            margin-bottom: 1rem;
          }

          .page-header {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default CreateItemPage;