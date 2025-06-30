/**
 * Edit Item Page
 * QR Code-Based Instructional System - Item Editing Interface
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import ItemForm from '../../../components/Item/ItemForm';

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

      // Fetch properties first
      const propertiesResponse = await fetch('http://localhost:3001/api/properties', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!propertiesResponse.ok) {
        throw new Error(`Failed to fetch properties: ${propertiesResponse.status}`);
      }

      const propertiesData = await propertiesResponse.json();
      if (!propertiesData.success) {
        throw new Error(propertiesData.message || 'Failed to fetch properties');
      }

      setProperties(propertiesData.data.properties || []);

      // Fetch item details
      const itemResponse = await fetch(`http://localhost:3001/api/items/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!itemResponse.ok) {
        if (itemResponse.status === 404) {
          throw new Error('Item not found');
        }
        throw new Error(`Failed to fetch item: ${itemResponse.status}`);
      }

      const itemData = await itemResponse.json();
      if (!itemData.success) {
        throw new Error(itemData.message || 'Failed to fetch item');
      }

      setItem(itemData.data.item);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit item updates
  const handleSubmit = async (itemData) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`http://localhost:3001/api/items/${id}`, {
        method: 'PUT',
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
        // Success! Navigate back to items list
        const updatedItem = data.data.item;
        
        // Show success message
        alert(`Item "${updatedItem.name}" was successfully updated!`);
        
        // Navigate back to items list, filtering by property
        router.push(`/items?propertyId=${updatedItem.property_id}`);
      } else {
        throw new Error(data.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete item
  const handleDelete = async () => {
    if (!item) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`http://localhost:3001/api/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Success! Navigate back to items list
        alert(`Item "${item.name}" was successfully deleted.`);
        router.push(`/items?propertyId=${item.property_id}`);
      } else {
        throw new Error(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [id]);

  // Get property name for breadcrumbs
  const property = item && properties.find(p => p.id === item.property_id);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading item details...</p>
          </div>
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
        `}</style>
      </DashboardLayout>
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