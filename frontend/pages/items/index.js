/**
 * Items Listing Page
 * QR Code-Based Instructional System - Manage all items and generate QR codes
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ItemList from '../../components/Item/ItemList';
import { apiService, apiHelpers } from '../../utils/api';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../utils/constants';

const ItemsPage = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract propertyId filter from URL params
  const { propertyId } = router.query;

  useEffect(() => {
    loadData();
  }, [propertyId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load properties first for the filter dropdown
      const propertiesResponse = await apiService.properties.getAll();
      const propertiesData = apiHelpers.extractData(propertiesResponse);
      const availableProperties = propertiesData.properties || [];
      setProperties(availableProperties);

      if (availableProperties.length === 0) {
        setItems([]);
        setError('No properties available. Please create a property first.');
        setLoading(false);
        return;
      }

      // Determine which property to load items for
      let effectivePropertyId = propertyId;
      
      // Only fallback to first property if no propertyId is provided
      if (!effectivePropertyId) {
        effectivePropertyId = availableProperties[0].id;
        // Update URL only if no propertyId was provided
        router.replace(`/items?propertyId=${effectivePropertyId}`, undefined, { shallow: true });
      } else if (!availableProperties.find(p => p.id === effectivePropertyId)) {
        // If provided propertyId is invalid, show error
        setError(`Property with ID ${effectivePropertyId} not found.`);
        setItems([]);
        setLoading(false);
        return;
      }

      // Load items for the selected property
      const itemsResponse = await apiService.items.getAll(effectivePropertyId);
      const itemsData = apiHelpers.extractData(itemsResponse);
      
      // Enhance items with property information
      const enhancedItems = (itemsData.items || []).map(item => ({
        ...item,
        property: availableProperties.find(p => p.id === item.property_id),
        qr_count: item.qr_count || 0
      }));
      setItems(enhancedItems);

    } catch (err) {
      console.error('Error loading data:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = () => {
    if (propertyId) {
      router.push(`/items/create?propertyId=${propertyId}`);
    } else {
      router.push('/items/create');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await apiService.items.delete(itemId);
      const data = apiHelpers.extractData(response);
      
      // Remove the deleted item from the list
      setItems(prevItems => prevItems.filter(item => item.item_id !== itemId));
      
      // Show success message
      alert(SUCCESS_MESSAGES.ITEM_DELETED);
    } catch (error) {
      console.error('Error deleting item:', error);
      const errorInfo = apiHelpers.handleError(error);
      alert(`Failed to delete item: ${errorInfo.message}`);
      throw error; // Re-throw to let ItemCard handle the error display
    }
  };

  const handleGenerateQR = async (itemId) => {
    try {
      const response = await apiService.qrcodes.create({
        itemId: itemId,
        format: 'png',
        size: 256
      });
      const data = apiHelpers.extractData(response);
      
      // Update the item's QR count
      setItems(prevItems => 
        prevItems.map(item => 
          item.item_id === itemId 
            ? { ...item, qr_count: (item.qr_count || 0) + 1 }
            : item
        )
      );
      
      // Show success message with option to download
      const downloadQR = confirm(
        `${SUCCESS_MESSAGES.QR_GENERATED}\n\nWould you like to download the QR code now?`
      );
      
      if (downloadQR) {
        // Download QR code using the API service
        const downloadResponse = await apiService.qrcodes.download(data.qrCode.qr_id);
        const blob = downloadResponse.data;
        apiHelpers.downloadFile(blob, `qr-code-${data.qrCode.qr_id}.png`);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      const errorInfo = apiHelpers.handleError(error);
      alert(`Failed to generate QR code: ${errorInfo.message}`);
      throw error; // Re-throw to let ItemCard handle the error display
    }
  };

  const getFilteredPropertyName = () => {
    if (!propertyId) return null;
    const property = properties.find(p => p.property_id === propertyId);
    return property?.name;
  };

  const filteredPropertyName = getFilteredPropertyName();

  if (error) {
    return (
      <DashboardLayout>
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Failed to Load Items</h1>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button 
                onClick={loadData}
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

  return (
    <DashboardLayout>
      <div className="items-page">
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">
                {filteredPropertyName ? `Items - ${filteredPropertyName}` : 'Items'}
              </h1>
              <p className="page-subtitle">
                Manage items and generate QR codes for guest instructions
              </p>
            </div>
            <div className="header-actions">
              <button 
                onClick={handleCreateItem}
                className="btn-primary"
              >
                + Create Item
              </button>
            </div>
          </div>

          {filteredPropertyName && (
            <div className="filter-notice">
              <span className="filter-icon">🔍</span>
              <span className="filter-text">
                Showing items for: <strong>{filteredPropertyName}</strong>
              </span>
              <button 
                onClick={() => router.push('/items')}
                className="clear-filter-btn"
              >
                Show All Items
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
            onGenerateQR={handleGenerateQR}
          />
        </div>
      </div>

      <style jsx>{`
        .items-page {
          width: 100%;
          max-width: 1200px;
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

        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .filter-notice {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #dbeafe;
          border: 1px solid #3b82f6;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #1d4ed8;
        }

        .filter-icon {
          font-size: 1rem;
        }

        .filter-text {
          flex: 1;
        }

        .clear-filter-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .clear-filter-btn:hover {
          background: #2563eb;
        }

        .page-content {
          min-height: 400px;
        }

        @media (max-width: 768px) {
          .items-page {
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

          .filter-notice {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
            text-align: center;
          }

          .clear-filter-btn {
            align-self: center;
            width: fit-content;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ItemsPage; 