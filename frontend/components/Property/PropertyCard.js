/**
 * Property Card Component
 * QR Code-Based Instructional System - Individual Property Display
 */

import { useState } from 'react';
import { useRouter } from 'next/router';

const PropertyCard = ({ property, onDelete }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewItems = () => {
    router.push(`/items?propertyId=${property.id}`);
  };

  const handleEdit = () => {
    router.push(`/properties/${property.id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${property.name}"? This will also delete all associated items and QR codes.`)) {
      setIsDeleting(true);
      try {
        if (onDelete) {
          await onDelete(property.id);
        }
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete property. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPropertyTypeIcon = (type) => {
    switch (type) {
      case 'apartment': return '🏠';
      case 'house': return '🏡';
      case 'condo': return '🏢';
      case 'studio': return '🏠';
      default: return '🏘️';
    }
  };

  return (
    <div className="property-card">
      <div className="card-header">
        <div className="property-info">
          <h3 className="property-name">{property.name}</h3>
          <div className="property-type">
            <span className="type-icon">{getPropertyTypeIcon(property.property_type)}</span>
            <span className="type-text">{property.property_type || 'Other'}</span>
          </div>
        </div>
        <div className="property-stats">
          <div className="stat">
            <span className="stat-value">{property.item_count || 0}</span>
            <span className="stat-label">Items</span>
          </div>
        </div>
      </div>

      <div className="card-content">
        {property.description && (
          <p className="property-description">{property.description}</p>
        )}
        
        {property.address && (
          <div className="property-address">
            <span className="address-icon">📍</span>
            <span className="address-text">{property.address}</span>
          </div>
        )}

        <div className="property-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Created:</span>
            <span className="metadata-value">{formatDate(property.created_at)}</span>
          </div>
          {property.updated_at !== property.created_at && (
            <div className="metadata-item">
              <span className="metadata-label">Updated:</span>
              <span className="metadata-value">{formatDate(property.updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="btn-secondary"
          onClick={handleViewItems}
        >
          View Items
        </button>
        <button 
          className="btn-primary"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button 
          className="btn-danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <style jsx>{`
        .property-card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
          overflow: hidden;
        }

        .property-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          padding: 1.5rem 1.5rem 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #f3f4f6;
        }

        .property-info {
          flex: 1;
        }

        .property-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .property-type {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .type-icon {
          font-size: 1rem;
        }

        .type-text {
          text-transform: capitalize;
        }

        .property-stats {
          text-align: center;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
        }

        .card-content {
          padding: 0 1.5rem 1.5rem 1.5rem;
        }

        .property-description {
          color: #4b5563;
          margin: 0 0 1rem 0;
          line-height: 1.4;
          font-size: 0.875rem;
        }

        .property-address {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .address-icon {
          font-size: 1rem;
        }

        .property-metadata {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .metadata-item {
          display: flex;
          justify-content: space-between;
        }

        .metadata-label {
          font-weight: 500;
        }

        .card-actions {
          padding: 1rem 1.5rem;
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
          display: flex;
          gap: 0.5rem;
        }

        .btn-primary, .btn-secondary, .btn-danger {
          flex: 1;
          padding: 0.5rem 1rem;
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

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #4b5563;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn-primary:disabled, .btn-secondary:disabled, .btn-danger:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .card-header {
            flex-direction: column;
            gap: 1rem;
          }

          .property-stats {
            align-self: stretch;
          }

          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyCard; 