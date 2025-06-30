/**
 * Item Card Component
 * QR Code-Based Instructional System - Individual Item Display
 */

import { useState } from 'react';
import { useRouter } from 'next/router';

const ItemCard = ({ item, onDelete, onGenerateQR }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const handleViewQRCodes = () => {
    router.push(`/qrcodes?itemId=${item.id}`);
  };

  const handleEdit = () => {
    router.push(`/items/${item.id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This will also deactivate all associated QR codes.`)) {
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

  const handleGenerateQR = async () => {
    setIsGeneratingQR(true);
    try {
      if (onGenerateQR) {
        await onGenerateQR(item.id);
      }
    } catch (error) {
      console.error('QR generation failed:', error);
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getItemCategoryIcon = (category) => {
    const categoryLower = (category || '').toLowerCase();
    if (categoryLower.includes('kitchen')) return '🍳';
    if (categoryLower.includes('bathroom')) return '🚿';
    if (categoryLower.includes('bedroom')) return '🛏️';
    if (categoryLower.includes('living')) return '🛋️';
    if (categoryLower.includes('appliance')) return '⚡';
    if (categoryLower.includes('electronic')) return '📱';
    return '📦';
  };

  return (
    <div className="item-card">
      <div className="card-header">
        <div className="item-info">
          <h3 className="item-name">{item.name}</h3>
          <div className="item-location">
            <span className="location-icon">📍</span>
            <span className="location-text">{item.location || 'No location specified'}</span>
          </div>
          {item.property && (
            <div className="property-ref">
              <span className="property-icon">🏠</span>
              <span className="property-text">{item.property.name}</span>
            </div>
          )}
        </div>
        <div className="item-stats">
          <div className="stat">
            <span className="stat-value">{item.qr_count || 0}</span>
            <span className="stat-label">QR Codes</span>
          </div>
        </div>
      </div>

      <div className="card-content">
        {item.description && (
          <p className="item-description">{item.description}</p>
        )}
        
        <div className="item-details">
          {item.media_type && (
            <div className="detail-item">
              <span className="detail-icon">
                {getItemCategoryIcon(item.media_type)}
              </span>
              <span className="detail-text">
                {item.media_type === 'youtube' ? 'Video Instructions' : 
                 item.media_type === 'pdf' ? 'PDF Guide' : 
                 item.media_type === 'image' ? 'Image Guide' : 
                 'Instructions Available'}
              </span>
            </div>
          )}
          
          {item.metadata?.difficulty && (
            <div className="detail-item">
              <span className="detail-icon">📊</span>
              <span className="detail-text">
                Difficulty: {item.metadata.difficulty}
              </span>
            </div>
          )}

          {item.metadata?.duration && (
            <div className="detail-item">
              <span className="detail-icon">⏱️</span>
              <span className="detail-text">
                Duration: {item.metadata.duration}
              </span>
            </div>
          )}
        </div>

        <div className="item-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Created:</span>
            <span className="metadata-value">{formatDate(item.created_at)}</span>
          </div>
          {item.updated_at !== item.created_at && (
            <div className="metadata-item">
              <span className="metadata-label">Updated:</span>
              <span className="metadata-value">{formatDate(item.updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="btn-qr"
          onClick={handleGenerateQR}
          disabled={isGeneratingQR}
        >
          {isGeneratingQR ? 'Generating...' : '+ QR Code'}
        </button>
        <button 
          className="btn-secondary"
          onClick={handleViewQRCodes}
        >
          View QRs
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
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .item-location,
        .property-ref {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .location-icon,
        .property-icon {
          font-size: 1rem;
        }

        .item-stats {
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
          color: #10b981;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
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

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .detail-icon {
          font-size: 1rem;
        }

        .item-metadata {
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

        .btn-primary, .btn-secondary, .btn-danger, .btn-qr {
          flex: 1;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
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

        .btn-qr {
          background: #10b981;
          color: white;
        }

        .btn-qr:hover {
          background: #059669;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-primary:disabled,
        .btn-secondary:disabled,
        .btn-danger:disabled,
        .btn-qr:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .card-actions {
            flex-direction: column;
            gap: 0.5rem;
          }

          .item-name {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemCard; 