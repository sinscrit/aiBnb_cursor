/**
 * Edit Item Page
 * QR Code-Based Instructional System - Item Editing Interface
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import ItemForm from '../../../components/Item/ItemForm';
import { apiService, apiHelpers } from '../../../utils/api';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../utils/constants';

const EditItemPage = () => {
  const router = useRouter();
  const { id } = router.query; // Item ID from URL
  
  const [item, setItem] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch item details and properties
  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch properties and item details in parallel
      const [propertiesResponse, itemResponse] = await Promise.all([
        apiService.properties.getAll(),
        apiService.items.getById(id)
      ]);

      const propertiesResult = apiHelpers.extractData(propertiesResponse);
      const itemResult = apiHelpers.extractData(itemResponse);

      setProperties(propertiesResult.properties || []);
      setItem(itemResult.item);
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorInfo = apiHelpers.handleError(error);
      setError(errorInfo.message || 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  // Submit item updates
  const handleSubmit = async (itemData) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await apiService.items.update(id, itemData);
      const result = apiHelpers.extractData(response);
      
        // Success! Navigate back to items list
      router.push({
        pathname: '/items',
        query: { 
          message: SUCCESS_MESSAGES.ITEM_UPDATED,
          propertyId: result.item.property_id
        }
      });
    } catch (error) {
      console.error('Error updating item:', error);
      const errorInfo = apiHelpers.handleError(error);
      setError(errorInfo.message || 'Failed to update item');
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/items');
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [id]);

  // Get property name for breadcrumbs
  const property = item && properties.find(p => p.id === item.property_id);

  if (loading) {
    return (
      <>
        <Head>
          <title>Edit Item - aiBnb Management</title>
        </Head>
        
        <DashboardLayout>
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading item...</p>
        </div>

        <style jsx>{`
          .loading-container {
            display: flex;
              flex-direction: column;
              align-items: center;
            justify-content: center;
              padding: 60px 20px;
            text-align: center;
          }

          .loading-spinner {
              width: 40px;
              height: 40px;
              border: 4px solid #f3f4f6;
              border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
              margin-bottom: 16px;
          }

          @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            .loading-container p {
              color: #6b7280;
              margin: 0;
          }
        `}</style>
      </DashboardLayout>
      </>
    );
  }

  // Error state
  if (error && !item) {
    return (
      <DashboardLayout title="Error">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Failed to Load Item</h3>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button 
                onClick={fetchData}
                className="btn-primary"
              >
                Try Again
              </button>
              <button 
                onClick={() => router.push('/items')}
                className="btn-secondary"
              >
                Back to Items
              </button>
            </div>
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
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Edit ${item?.name || 'Item'}`}>
      <div className="edit-item-page">
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
          {property && (
            <>
              <span className="breadcrumb-separator">›</span>
              <button 
                onClick={() => router.push(`/items?propertyId=${property.id}`)}
                className="breadcrumb-link"
              >
                {property.name}
              </button>
            </>
          )}
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{item?.name || 'Edit'}</span>
        </nav>

        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">Edit Item</h1>
              <p className="page-description">
                Update the details for "{item?.name}"{property && ` in ${property.name}`}.
              </p>
            </div>
            <div className="header-actions">
              <button 
                onClick={handleDelete}
                className="btn-danger"
                disabled={submitting}
              >
                Delete Item
              </button>
            </div>
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

        {/* Form Content */}
        {item && (
          <div className="form-container">
            <ItemForm 
              item={item}
              properties={properties}
              onSubmit={handleSubmit}
              loading={submitting}
              onCancel={() => router.push(`/items?propertyId=${item.property_id}`)}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .edit-item-page {
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
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-danger {
          padding: 0.75rem 1.5rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-danger:hover:not(:disabled) {
          background: #b91c1c;
        }

        .btn-danger:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        .form-container {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .edit-item-page {
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

          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
          }

          .btn-danger {
            width: 100%;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default EditItemPage;