/**
 * Item Card Component
 * QR Code-Based Instructional System - Individual Item Display
 */

import { useState } from 'react';
import { useRouter } from 'next/router';

const ItemCard = ({ item, onDelete }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewProperty = () => {
    router.push(`/properties`);
  };

  const handleEdit = () => {
    router.push(`/items/${item.id}/edit`);
  };

  const handleGenerateQR = () => {
    // Will be implemented when QR system is available
    alert('QR Code generation will be available once the QR system is implemented!');
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This will also delete all associated QR codes.`)) {
      setIsDeleting(true);
      try {
        if (onDelete) {
          await onDelete(item.id);
        }
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete item. Please try again.');
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

  const getMediaTypeIcon = (mediaType) => {
    switch (mediaType) {
      case 'youtube': return '📹';
      case 'image': return '🖼️';
      case 'pdf': return '📄';
      case 'text': return '📝';
      default: return '📋';
    }
  };

  const getStatusColor = (hasQR) => {
    return hasQR ? '#10b981' : '#6b7280';
  };

  const getStatusText = (hasQR) => {
    return hasQR ? 'QR Ready' : 'No QR Code';
  };

  return (
    <div className="item-card">
      <div className="card-header">
        <div className="item-info">
          <h3 className="item-name">{item.name}</h3>
          <div className="item-metadata">
            <div className="metadata-item">
              <span className="metadata-icon">🏢</span>
              <span className="metadata-text">{item.property_name || 'Unknown Property'}</span>
            </div>
            {item.location && (
              <div className="metadata-item">
                <span className="metadata-icon">📍</span>
                <span className="metadata-text">{item.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="item-status">
          <div className="status-indicator">
            <div 
              className="status-dot"
              style={{ backgroundColor: getStatusColor(item.has_qr_code) }}
            ></div>
            <span className="status-text">{getStatusText(item.has_qr_code)}</span>
          </div>
          <div className="media-type">
            <span className="media-icon">{getMediaTypeIcon(item.media_type)}</span>
            <span className="media-text">{item.media_type || 'text'}</span>
          </div>
        </div>
      </div>

      <div className="card-content">
        {item.description && (
          <p className="item-description">{item.description}</p>
        )}
        
        {item.media_url && (
          <div className="item-media">
            <span className="media-icon">🔗</span>
            <span className="media-label">Media:</span>
            <a 
              href={item.media_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="media-link"
            >
              View Content
            </a>
          </div>
        )}

        <div className="item-details">
          <div className="detail-item">
            <span className="detail-label">Created:</span>
            <span className="detail-value">{formatDate(item.created_at)}</span>
          </div>
          {item.updated_at !== item.created_at && (
            <div className="detail-item">
              <span className="detail-label">Updated:</span>
              <span className="detail-value">{formatDate(item.updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="btn-qr"
          onClick={handleGenerateQR}
        >
          {item.has_qr_code ? 'View QR' : 'Generate QR'}
        </button>
        <button 
          className="btn-secondary"
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
        .item-card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
          overflow: hidden;
        }

        .item-card:hover {
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

        .item-info {
          flex: 1;
        }

        .item-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
        }

        .item-metadata {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metadata-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .metadata-icon {
          font-size: 1rem;
        }

        .metadata-text {
          font-weight: 500;
        }

        .item-status {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-end;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
        }

        .status-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
        }

        .media-type {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .media-icon {
          font-size: 0.875rem;
        }

        .media-text {
          text-transform: capitalize;
        }

        .card-content {
          padding: 0 1.5rem 1.5rem 1.5rem;
        }

        .item-description {
          color: #4b5563;
          margin: 0 0 1rem 0;
          line-height: 1.4;
          font-size: 0.875rem;
        }

        .item-media {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .media-label {
          color: #6b7280;
          font-weight: 500;
        }

        .media-link {
          color: #3b82f6;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .media-link:hover {
          color: #2563eb;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
        }

        .detail-label {
          font-weight: 500;
        }

        .card-actions {
          padding: 1rem 1.5rem;
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
          display: flex;
          gap: 0.5rem;
        }

        .btn-qr, .btn-secondary, .btn-danger {
          flex: 1;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-qr {
          background: #10b981;
          color: white;
        }

        .btn-qr:hover:not(:disabled) {
          background: #059669;
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

        .btn-qr:disabled, .btn-secondary:disabled, .btn-danger:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .card-header {
            flex-direction: column;
            gap: 1rem;
          }

          .item-status {
            align-self: stretch;
            flex-direction: row;
            justify-content: space-between;
          }

          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemCard; 