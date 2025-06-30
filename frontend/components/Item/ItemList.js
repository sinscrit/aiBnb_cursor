/**
 * Item List Component
 * QR Code-Based Instructional System - Item Grid Display
 */

import { useState, useMemo } from 'react';
import ItemCard from './ItemCard';

const ItemList = ({ items = [], properties = [], loading = false, onDeleteItem, onGenerateQR }) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProperty, setFilterProperty] = useState('');

  const sortedAndFilteredItems = useMemo(() => {
    let filtered = items;

    // Filter by property
    if (filterProperty) {
      filtered = items.filter(item => item.property_id === filterProperty);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.location && item.location.toLowerCase().includes(term)) ||
        (item.property?.name && item.property.name.toLowerCase().includes(term))
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
        case 'location':
          valueA = a.location || '';
          valueB = b.location || '';
          break;
        case 'property':
          valueA = a.property?.name || '';
          valueB = b.property?.name || '';
          break;
        case 'qr_count':
          valueA = a.qr_count || 0;
          valueB = b.qr_count || 0;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortBy, sortOrder, searchTerm, filterProperty]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getItemStats = () => {
    const total = items.length;
    const withQR = items.filter(item => (item.qr_count || 0) > 0).length;
    const withoutQR = total - withQR;

    return { total, withQR, withoutQR };
  };

  const stats = getItemStats();

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
            {searchTerm || filterProperty ? 
              `Filtered Items (${sortedAndFilteredItems.length})` : 
              `Items (${items.length})`
            }
          </h2>
          {items.length > 0 && (
            <div className="list-subtitle">
              <p className="subtitle-text">
                Manage items and generate QR codes for instructions
              </p>
              <div className="stats-summary">
              <span className="stat-item">
                  <span className="stat-number">{stats.withQR}</span> with QR codes
              </span>
              <span className="stat-separator">•</span>
              <span className="stat-item">
                  <span className="stat-number">{stats.withoutQR}</span> without QR codes
              </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="list-controls">
          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">Property:</label>
              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
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
                { value: 'created_at', label: 'Created' },
                { value: 'updated_at', label: 'Updated' },
                { value: 'location', label: 'Location' },
                { value: 'property', label: 'Property' },
                { value: 'qr_count', label: 'QR Codes' }
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
            {searchTerm || filterProperty ? (
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
                  {filterProperty && (
                    <button 
                      className="btn-secondary"
                      onClick={() => setFilterProperty('')}
                    >
                      Clear Property Filter
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="empty-icon">📦</div>
                <h3 className="empty-title">No items yet</h3>
                <p className="empty-text">
                  Create your first item to start generating QR codes and managing instructions.
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
                onGenerateQR={onGenerateQR}
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

        .list-subtitle {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .subtitle-text {
          color: #6b7280;
          margin: 0;
          font-size: 0.875rem;
        }

        .stats-summary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-number {
          font-weight: 600;
          color: #6b7280;
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
          gap: 1.5rem;
        }

        .filter-controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
        }

        .search-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          min-width: 250px;
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
          color: #374151;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          width: 100%;
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
          white-space: nowrap;
        }

        .sort-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .sort-button {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .sort-button:hover {
          background: #f3f4f6;
        }

        .sort-button.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .sort-direction {
          font-weight: bold;
        }

        .list-content {
          min-height: 400px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .empty-text {
          color: #6b7280;
          margin: 0 0 1.5rem 0;
          max-width: 400px;
          line-height: 1.5;
        }

        .empty-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn-secondary {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f3f4f6;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .filter-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group,
          .search-group {
            min-width: auto;
          }

          .sort-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .sort-buttons {
            justify-content: center;
          }

          .items-grid {
            grid-template-columns: 1fr;
          }

          .empty-actions {
            flex-direction: column;
            align-items: stretch;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemList; 