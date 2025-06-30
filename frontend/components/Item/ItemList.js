/**
 * Item List Component
 * QR Code-Based Instructional System - Item Grid Display with Property Filtering
 */

import { useState, useMemo } from 'react';
import ItemCard from './ItemCard';

const ItemList = ({ 
  items = [], 
  properties = [], 
  loading = false, 
  onDeleteItem,
  selectedPropertyId = null 
}) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState(selectedPropertyId || '');

  const sortedAndFilteredItems = useMemo(() => {
    let filtered = items;

    // Filter by property
    if (propertyFilter) {
      filtered = items.filter(item => item.property_id === propertyFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.location && item.location.toLowerCase().includes(term)) ||
        (item.property_name && item.property_name.toLowerCase().includes(term)) ||
        (item.media_type && item.media_type.toLowerCase().includes(term))
      );
    }

    // Sort items
    return filtered.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'created_at':
          valueA = new Date(a.created_at);
          valueB = new Date(b.created_at);
          break;
        case 'updated_at':
          valueA = new Date(a.updated_at);
          valueB = new Date(b.updated_at);
          break;
        case 'property':
          valueA = a.property_name || '';
          valueB = b.property_name || '';
          break;
        case 'location':
          valueA = a.location || '';
          valueB = b.location || '';
          break;
        case 'media_type':
          valueA = a.media_type || 'text';
          valueB = b.media_type || 'text';
          break;
        case 'qr_status':
          valueA = a.has_qr_code ? 1 : 0;
          valueB = b.has_qr_code ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortBy, sortOrder, searchTerm, propertyFilter]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getPropertyStats = () => {
    const totalItems = items.length;
    const itemsWithQR = items.filter(item => item.has_qr_code).length;
    const uniqueProperties = new Set(items.map(item => item.property_id)).size;
    const filteredCount = sortedAndFilteredItems.length;

    return { totalItems, itemsWithQR, uniqueProperties, filteredCount };
  };

  const stats = getPropertyStats();

  if (loading) {
    return (
      <div className="item-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading items...</p>
        </div>
        <style jsx>{`
          .item-list {
            width: 100%;
          }

          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            text-align: center;
          }

          .loading-spinner {
            width: 2rem;
            height: 2rem;
            border: 3px solid #f3f4f6;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
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
      </div>
    );
  }

  return (
    <div className="item-list">
      <div className="list-header">
        <div className="list-info">
          <h2 className="list-title">
            {searchTerm || propertyFilter ? 
              `Filtered Items (${stats.filteredCount})` : 
              `Items (${stats.totalItems})`
            }
          </h2>
          {stats.totalItems > 0 && (
            <div className="list-stats">
              <span className="stat-item">
                <span className="stat-value">{stats.itemsWithQR}</span> with QR codes
              </span>
              <span className="stat-separator">•</span>
              <span className="stat-item">
                <span className="stat-value">{stats.uniqueProperties}</span> properties
              </span>
            </div>
          )}
        </div>
      </div>

      {stats.totalItems > 0 && (
        <div className="list-controls">
          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">Property:</label>
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Properties</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-group">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="sort-controls">
            <label className="sort-label">Sort by:</label>
            <div className="sort-buttons">
              {[
                { value: 'name', label: 'Name' },
                { value: 'property', label: 'Property' },
                { value: 'location', label: 'Location' },
                { value: 'media_type', label: 'Media Type' },
                { value: 'qr_status', label: 'QR Status' },
                { value: 'created_at', label: 'Created' },
                { value: 'updated_at', label: 'Updated' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`sort-button ${sortBy === option.value ? 'active' : ''}`}
                >
                  {option.label}
                  {sortBy === option.value && (
                    <span className="sort-direction">
                      {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="list-content">
        {sortedAndFilteredItems.length === 0 ? (
          <div className="empty-state">
            {searchTerm || propertyFilter ? (
              <>
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No items found</h3>
                <p className="empty-text">
                  No items match your current filters. Try adjusting your search or property filter.
                </p>
                <div className="empty-actions">
                  {searchTerm && (
                    <button 
                      className="btn-secondary"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </button>
                  )}
                  {propertyFilter && (
                    <button 
                      className="btn-secondary"
                      onClick={() => setPropertyFilter('')}
                    >
                      Show All Properties
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="empty-icon">📦</div>
                <h3 className="empty-title">No items yet</h3>
                <p className="empty-text">
                  Create your first item to start building your QR code system. Items can be appliances, instructions, or any content you want to share with guests.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="items-grid">
            {sortedAndFilteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .item-list {
          width: 100%;
        }

        .list-header {
          margin-bottom: 2rem;
        }

        .list-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .list-stats {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-value {
          font-weight: 600;
          color: #374151;
        }

        .stat-separator {
          color: #d1d5db;
        }

        .list-controls {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .filter-controls {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .filter-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          background: white;
          transition: border-color 0.2s;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-group {
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .sort-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .sort-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .sort-button {
          padding: 0.375rem 0.75rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #374151;
        }

        .sort-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .sort-button.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .sort-direction {
          font-weight: bold;
        }

        .list-content {
          min-height: 200px;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 1.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .empty-text {
          color: #6b7280;
          margin: 0 0 1.5rem 0;
          line-height: 1.5;
        }

        .empty-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-secondary {
          padding: 0.5rem 1rem;
          background: #6b7280;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-secondary:hover {
          background: #4b5563;
        }

        @media (max-width: 768px) {
          .items-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .filter-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group {
            min-width: auto;
          }

          .sort-controls {
            flex-direction: column;
            align-items: flex-start;
          }

          .sort-buttons {
            width: 100%;
            justify-content: flex-start;
          }

          .empty-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn-secondary {
            width: 200px;
          }
        }

        @media (max-width: 480px) {
          .empty-state {
            padding: 2rem 1rem;
          }

          .empty-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemList; 