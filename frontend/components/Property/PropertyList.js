/**
 * Property List Component
 * QR Code-Based Instructional System - Property Grid Display
 */

import { useState, useMemo } from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties = [], loading = false, onDeleteProperty }) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedAndFilteredProperties = useMemo(() => {
    let filtered = properties;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = properties.filter(property => 
        property.name.toLowerCase().includes(term) ||
        (property.description && property.description.toLowerCase().includes(term)) ||
        (property.address && property.address.toLowerCase().includes(term)) ||
        (property.property_type && property.property_type.toLowerCase().includes(term))
      );
    }

    // Sort properties
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
        case 'type':
          valueA = a.property_type || 'other';
          valueB = b.property_type || 'other';
          break;
        case 'items':
          valueA = a.item_count || 0;
          valueB = b.item_count || 0;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [properties, sortBy, sortOrder, searchTerm]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="property-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading properties...</p>
        </div>
        <style jsx>{`
          .property-list {
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
    <div className="property-list">
      <div className="list-header">
        <div className="list-info">
          <h2 className="list-title">
            {searchTerm ? `Search Results (${sortedAndFilteredProperties.length})` : `Properties (${properties.length})`}
          </h2>
          {properties.length > 0 && (
            <p className="list-subtitle">
              Manage your rental properties and their associated items
            </p>
          )}
        </div>
      </div>

      {properties.length > 0 && (
        <div className="list-controls">
          <div className="search-controls">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sort-controls">
            <label className="sort-label">Sort by:</label>
            <div className="sort-buttons">
              {[
                { value: 'name', label: 'Name' },
                { value: 'created_at', label: 'Created' },
                { value: 'updated_at', label: 'Updated' },
                { value: 'type', label: 'Type' },
                { value: 'items', label: 'Items' }
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
        {sortedAndFilteredProperties.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? (
              <>
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No properties found</h3>
                <p className="empty-text">
                  No properties match your search for "{searchTerm}". Try adjusting your search terms.
                </p>
                <button 
                  className="btn-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon">🏠</div>
                <h3 className="empty-title">No properties yet</h3>
                <p className="empty-text">
                  Create your first property to start managing items and generating QR codes.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="properties-grid">
            {sortedAndFilteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={onDeleteProperty}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .property-list {
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
          color: #6b7280;
          margin: 0;
          font-size: 0.875rem;
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

        .search-controls {
          display: flex;
          gap: 1rem;
        }

        .search-input {
          flex: 1;
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

        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
          .properties-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .list-controls {
            padding: 1rem;
          }

          .sort-controls {
            flex-direction: column;
            align-items: flex-start;
          }

          .sort-buttons {
            width: 100%;
            justify-content: flex-start;
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

export default PropertyList; 