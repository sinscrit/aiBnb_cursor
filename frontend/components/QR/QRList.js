import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import QRDisplay from './QRDisplay';
import { apiService, apiHelpers } from '../../utils/api';

const QRList = ({ itemId, propertyId, showFilters = true }) => {
  const [qrCodes, setQrCodes] = useState([]);
  const [items, setItems] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    itemId: itemId || '',
    propertyId: propertyId || '',
    status: 'all'
  });
  const [stats, setStats] = useState(null);

  const router = useRouter();

  useEffect(() => {
    fetchQRCodes();
    if (showFilters) {
      fetchProperties();
      fetchItems();
    }
  }, [filters.itemId, filters.propertyId, filters.status]);

  const fetchQRCodes = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (filters.itemId) params.itemId = filters.itemId;
      if (filters.propertyId) params.propertyId = filters.propertyId;
      if (filters.status !== 'all') params.status = filters.status;

      const response = await apiService.qrcodes.getAll(params);
      const result = apiHelpers.extractData(response);
      
      setQrCodes(result.qrCodes || []);
      setStats(result.statistics || null);
    } catch (err) {
      console.error('Fetch QR Codes Error:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message || 'Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await apiService.properties.getAll();
      const result = apiHelpers.extractData(response);
      setProperties(result.properties || []);
    } catch (err) {
      console.error('Fetch Properties Error:', err);
    }
  };

  const fetchItems = async () => {
    try {
      const params = {};
      if (filters.propertyId) params.propertyId = filters.propertyId;

      const response = await apiService.items.getAll(params);
      const result = apiHelpers.extractData(response);
      setItems(result.items || []);
    } catch (err) {
      console.error('Fetch Items Error:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      // Reset dependent filters
      ...(field === 'propertyId' && { itemId: '' })
    }));
  };

  const filteredItems = filters.propertyId 
    ? items.filter(item => item.property_id === filters.propertyId)
    : items;

  const getItemById = (itemId) => {
    return items.find(item => item.item_id === itemId);
  };

  const navigateToItemQR = (itemId) => {
    router.push(`/qrcodes/${itemId}`);
  };

  if (loading) {
    return (
      <div className="qr-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading QR codes...</p>
        <style jsx>{`
          .qr-list-loading {
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

          .qr-list-loading p {
            color: #6b7280;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="qr-list">
      {showFilters && (
        <div className="qr-filters">
          <h3>QR Code Filters</h3>
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="property-filter">Property:</label>
              <select
                id="property-filter"
                value={filters.propertyId}
                onChange={(e) => handleFilterChange('propertyId', e.target.value)}
              >
                <option value="">All Properties</option>
                {properties.map(property => (
                  <option key={property.property_id} value={property.property_id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="item-filter">Item:</label>
              <select
                id="item-filter"
                value={filters.itemId}
                onChange={(e) => handleFilterChange('itemId', e.target.value)}
                disabled={!filters.propertyId && filteredItems.length === 0}
              >
                <option value="">All Items</option>
                {filteredItems.map(item => (
                  <option key={item.item_id} value={item.item_id}>
                    {item.name} ({item.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="status-filter">Status:</label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="qr-statistics">
          <h3>QR Code Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total_count || 0}</div>
              <div className="stat-label">Total QR Codes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.active || 0}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.inactive || 0}</div>
              <div className="stat-label">Inactive</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.total_scans || 0}</div>
              <div className="stat-label">Total Scans</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      <div className="qr-codes-section">
        <div className="section-header">
          <h3>QR Codes ({qrCodes.length})</h3>
          {!itemId && (
            <button
              onClick={() => router.push('/items')}
              className="add-qr-btn"
            >
              📱 Generate New QR Code
            </button>
          )}
        </div>

        {qrCodes.length === 0 ? (
          <div className="no-qr-codes">
            <div className="no-qr-icon">📱</div>
            <h4>No QR Codes Found</h4>
            <p>
              {filters.itemId || filters.propertyId || filters.status !== 'all'
                ? 'No QR codes match your current filters. Try adjusting the filters above.'
                : 'No QR codes have been generated yet. Create items and generate QR codes to get started.'}
            </p>
            <div className="no-qr-actions">
              <button
                onClick={() => router.push('/items')}
                className="primary-btn"
              >
                Go to Items
              </button>
              {(filters.itemId || filters.propertyId || filters.status !== 'all') && (
                <button
                  onClick={() => setFilters({ itemId: '', propertyId: '', status: 'all' })}
                  className="secondary-btn"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="qr-codes-grid">
            {qrCodes.map(qrCode => {
              const item = getItemById(qrCode.item_id);
              return (
                <div key={qrCode.qr_id} className="qr-code-item">
                  <div className="qr-item-header">
                    <h4>
                      {item ? `${item.name} (${item.location})` : `Item ${qrCode.item_id}`}
                    </h4>
                    <button
                      onClick={() => navigateToItemQR(qrCode.item_id)}
                      className="manage-btn"
                    >
                      Manage
                    </button>
                  </div>
                  <QRDisplay 
                    qrCode={qrCode} 
                    item={item} 
                    size="small" 
                    showDetails={false}
                  />
                  <div className="qr-item-stats">
                    <span className="scan-count">
                      👁️ {qrCode.scan_count || 0} scans
                    </span>
                    <span className={`status ${qrCode.is_active ? 'active' : 'inactive'}`}>
                      {qrCode.is_active ? '✅ Active' : '⏸️ Inactive'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .qr-list {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .qr-filters {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .qr-filters h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .filter-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-group label {
          font-weight: 500;
          margin-bottom: 6px;
          color: #374151;
          font-size: 0.9rem;
        }

        .filter-group select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.9rem;
          background: white;
        }

        .filter-group select:disabled {
          background: #f9fafb;
          color: #9ca3af;
        }

        .qr-statistics {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .qr-statistics h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: #f8f9fa;
          border-radius: 6px;
          padding: 16px;
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
        }

        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: center;
        }

        .error-message p {
          color: #dc2626;
          margin: 0;
        }

        .qr-codes-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .section-header h3 {
          margin: 0;
          color: #333;
        }

        .add-qr-btn {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-qr-btn:hover {
          background: #2563eb;
        }

        .no-qr-codes {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .no-qr-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .no-qr-codes h4 {
          margin: 0 0 12px 0;
          color: #374151;
        }

        .no-qr-codes p {
          margin: 0 0 24px 0;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .no-qr-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .primary-btn, .secondary-btn {
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .primary-btn {
          background: #3b82f6;
          color: white;
        }

        .primary-btn:hover {
          background: #2563eb;
        }

        .secondary-btn {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .secondary-btn:hover {
          background: #e5e7eb;
        }

        .qr-codes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .qr-code-item {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          background: #fafafa;
        }

        .qr-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .qr-item-header h4 {
          margin: 0;
          font-size: 0.95rem;
          color: #333;
          flex: 1;
          margin-right: 12px;
        }

        .manage-btn {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 12px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .manage-btn:hover {
          background: #059669;
        }

        .qr-item-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          font-size: 0.8rem;
        }

        .scan-count {
          color: #6b7280;
        }

        .status.active {
          color: #059669;
          font-weight: 500;
        }

        .status.inactive {
          color: #f59e0b;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .qr-list {
            padding: 16px;
          }

          .filter-row {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .qr-codes-grid {
            grid-template-columns: 1fr;
          }

          .no-qr-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default QRList; 