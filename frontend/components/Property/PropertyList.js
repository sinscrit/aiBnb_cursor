/**
 * Property List Component
 * QR Code-Based Instructional System - Property Grid Display
 */

import { useState, useMemo } from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties = [], onDelete, onCreate }) => {
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

  return (
    <div className="property-list">
      <div className="list-header">
        <div className="list-info">
          <h1 className="list-title">Property Management</h1>
          <p className="list-subtitle">
            Manage your rental properties and their associated items. Create new properties to start organizing your QR code system.
          </p>
        </div>
        <div className="list-actions">
          <button 
            onClick={onCreate}
            className="btn-primary"
          >
            <span className="btn-icon">+</span>
            Create Property
          </button>
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
                <button 
                  className="btn-primary"
                  onClick={onCreate}
                >
                  Create Property
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="properties-grid">
            {sortedAndFilteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={() => onDelete(property.id)}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .property-list {
          width: 100%;
          max-width: 100%;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 2rem;
        }

        .list-info {
          flex: 1;
        }

        .list-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .list-subtitle {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .list-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background-color: #2563eb;
        }

        .btn-icon {
          font-size: 1.25rem;
          font-weight: bold;
        }

        .list-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .search-controls {
          flex: 1;
          min-width: 250px;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sort-label {
          color: #6b7280;
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .sort-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .sort-button {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sort-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .sort-button.active {
          background: #f3f4f6;
          border-color: #9ca3af;
          font-weight: 500;
        }

        .sort-direction {
          display: inline-block;
          margin-left: 0.25rem;
          font-weight: bold;
        }

        .list-content {
          width: 100%;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .empty-icon {
          font-size: 3rem;
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
          margin: 0 0 2rem 0;
          line-height: 1.5;
        }

        .btn-secondary {
          padding: 0.75rem 1.5rem;
          background-color: #f3f4f6;
          color: #1f2937;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background-color: #e5e7eb;
        }

        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .list-header {
            flex-direction: column;
            gap: 1rem;
          }

          .list-actions {
            width: 100%;
          }

          .btn-primary {
            width: 100%;
            justify-content: center;
          }

          .list-title {
            font-size: 1.5rem;
          }

          .sort-controls {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }

          .sort-buttons {
            width: 100%;
            flex-wrap: wrap;
          }

          .sort-button {
            flex: 1;
            text-align: center;
            min-width: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyList; 