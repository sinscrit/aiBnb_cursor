/**
 * Items Listing Page
 * QR Code-Based Instructional System - Item Management Interface with Property Filtering
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ItemList from '../../components/Item/ItemList';

const ItemsPage = () => {
  const router = useRouter();
  const { propertyId } = router.query; // Support direct property filtering via URL
  
  const [items, setItems] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch both items and properties
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch properties first (needed for filtering)
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
      const propertiesList = propertiesData.success ? (propertiesData.data.properties || []) : [];
      setProperties(propertiesList);

      // Fetch items - if we have properties, fetch items for the first property or all items
      let itemsUrl = 'http://localhost:3001/api/items';
      if (propertyId) {
        itemsUrl += `?propertyId=${propertyId}`;
      } else if (propertiesList.length > 0) {
        // Get items for all properties by making multiple requests or use the first property
        itemsUrl += `?propertyId=${propertiesList[0].id}`;
      }

      const itemsResponse = await fetch(itemsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!itemsResponse.ok) {
        throw new Error(`Failed to fetch items: ${itemsResponse.status}`);
      }

      const itemsData = await itemsResponse.json();
      
      if (itemsData.success) {
        // Enhance items with property names
        const itemsWithPropertyNames = (itemsData.data.items || []).map(item => ({
          ...item,
          property_name: propertiesList.find(p => p.id === item.property_id)?.name || 'Unknown Property'
        }));
        setItems(itemsWithPropertyNames);
      } else {
        throw new Error(itemsData.message || 'Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/items/${itemId}`, {
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
        // Remove the deleted item from the list
        setItems(prev => prev.filter(item => item.id !== itemId));
        
        // Show success message
        alert(`Item "${data.data.deleted_item.name}" was successfully deleted.`);
      } else {
        throw new Error(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error; // Re-throw to be handled by ItemCard component
    }
  };

  // Navigate to create item page
  const handleCreateItem = () => {
    if (propertyId) {
      router.push(`/items/create?propertyId=${propertyId}`);
    } else {
      router.push('/items/create');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [propertyId]); // Re-fetch when propertyId changes

  // Error state
  if (error && !loading) {
    return (
      <DashboardLayout title="Items">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Failed to Load Items</h3>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button 
                onClick={fetchData}
                className="btn-primary"
              >
                Try Again
              </button>
              <button 
                onClick={handleCreateItem}
                className="btn-secondary"
              >
                Create Item
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

  const selectedProperty = properties.find(p => p.id === propertyId);

  return (
    <DashboardLayout title="Items">
      <div className="items-page">
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">
                {selectedProperty ? `Items - ${selectedProperty.name}` : 'Item Management'}
              </h1>
              <p className="page-description">
                {selectedProperty 
                  ? `Manage items for ${selectedProperty.name}. Add appliances, instructions, or any content you want to share via QR codes.`
                  : 'Manage your rental items across all properties. Add appliances, instructions, or any content you want to share with guests via QR codes.'
                }
              </p>
            </div>
            <div className="header-actions">
              <button 
                onClick={handleCreateItem}
                className="btn-primary"
                disabled={loading || properties.length === 0}
              >
                <span className="btn-icon">+</span>
                Create Item
              </button>
            </div>
          </div>

          {selectedProperty && (
            <div className="property-indicator">
              <div className="indicator-content">
                <span className="indicator-icon">🏢</span>
                <span className="indicator-text">
                  Showing items for <strong>{selectedProperty.name}</strong>
                </span>
                <button 
                  onClick={() => router.push('/items')}
                  className="btn-outline-small"
                >
                  View All Items
                </button>
              </div>
            </div>
          )}

          {properties.length === 0 && !loading && (
            <div className="no-properties-notice">
              <span className="notice-icon">ℹ️</span>
              <span className="notice-text">
                You need to create a property first before adding items.
              </span>
              <button 
                onClick={() => router.push('/properties/create')}
                className="btn-outline"
              >
                Create Property
              </button>
            </div>
          )}
        </div>

        <div className="page-content">
          <ItemList 
            items={items}
            properties={properties}
            loading={loading}
            onDeleteItem={handleDeleteItem}
            selectedPropertyId={propertyId}
          />
        </div>

        {/* Refresh button for development */}
        <div className="page-footer">
          <button 
            onClick={fetchData}
            className="btn-outline"
            disabled={loading}
          >
            <span className="refresh-icon">🔄</span>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .items-page {
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

        .property-indicator {
          background: #dbeafe;
          border: 1px solid #3b82f6;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .indicator-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .indicator-icon {
          font-size: 1.25rem;
        }

        .indicator-text {
          flex: 1;
          color: #1d4ed8;
          font-size: 0.875rem;
        }

        .btn-outline-small, .btn-outline {
          padding: 0.5rem 1rem;
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-outline-small:hover, .btn-outline:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-outline:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-properties-notice {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #92400e;
        }

        .notice-icon {
          font-size: 1.25rem;
        }

        .notice-text {
          flex: 1;
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

          .indicator-content {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }

          .no-properties-notice {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ItemsPage; 