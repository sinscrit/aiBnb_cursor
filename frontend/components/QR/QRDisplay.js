import React, { useState } from 'react';

const QRDisplay = ({ qrCode, item, showDetails = true, size = 'medium' }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  const sizeClasses = {
    small: { container: 'qr-display-small', image: '120px' },
    medium: { container: 'qr-display-medium', image: '200px' },
    large: { container: 'qr-display-large', image: '300px' }
  };

  const downloadQRCode = async () => {
    if (!qrCode?.qr_id) {
      setError('QR code ID not available');
      return;
    }

    setIsDownloading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8000/api/qrcodes/${qrCode.qr_id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': 'Demo demo-user-token',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download QR code');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `qr-code-${item?.name || qrCode.qr_id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download Error:', err);
      setError('Failed to download QR code');
    } finally {
      setIsDownloading(false);
    }
  };

  const getQRCodeImageUrl = () => {
    if (!qrCode?.qr_id) return null;
    return `http://localhost:8000/api/qrcodes/${qrCode.qr_id}/download`;
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#10b981' : '#f59e0b';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  if (!qrCode) {
    return (
      <div className="qr-display no-qr">
        <div className="no-qr-content">
          <div className="no-qr-icon">📱</div>
          <p>No QR Code Generated</p>
          <small>Generate a QR code to display it here</small>
        </div>
        <style jsx>{`
          .qr-display.no-qr {
            background: #f9fafb;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 40px 20px;
            text-align: center;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .no-qr-content {
            color: #6b7280;
          }

          .no-qr-icon {
            font-size: 3rem;
            margin-bottom: 16px;
          }

          .no-qr-content p {
            margin: 0 0 8px 0;
            font-weight: 500;
          }

          .no-qr-content small {
            font-size: 0.85rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`qr-display ${sizeClasses[size].container}`}>
      {showDetails && (
        <div className="qr-header">
          <div className="qr-info">
            <h4>QR Code</h4>
            <div className="status-badge">
              <span 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(qrCode.is_active) }}
              ></span>
              {getStatusText(qrCode.is_active)}
            </div>
          </div>
        </div>
      )}

      <div className="qr-image-container">
        <img
          src={getQRCodeImageUrl()}
          alt={`QR Code for ${item?.name || 'item'}`}
          className="qr-image"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div className="qr-error" style={{ display: 'none' }}>
          <p>🚫 QR Code Image Not Available</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="qr-actions">
        <button
          onClick={downloadQRCode}
          disabled={isDownloading}
          className="download-btn"
        >
          {isDownloading ? (
            <>
              <span className="spinner"></span>
              Downloading...
            </>
          ) : (
            <>
              📥 Download PNG
            </>
          )}
        </button>
      </div>

      {showDetails && (
        <div className="qr-details">
          <div className="detail-row">
            <span className="label">QR ID:</span>
            <span className="value">{qrCode.qr_id}</span>
          </div>
          <div className="detail-row">
            <span className="label">Format:</span>
            <span className="value">{qrCode.format || 'PNG'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Size:</span>
            <span className="value">{qrCode.size || 256}x{qrCode.size || 256}px</span>
          </div>
          <div className="detail-row">
            <span className="label">Scans:</span>
            <span className="value">{qrCode.scan_count || 0}</span>
          </div>
          <div className="detail-row">
            <span className="label">Created:</span>
            <span className="value">
              {qrCode.created_at ? new Date(qrCode.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          {qrCode.last_scanned && (
            <div className="detail-row">
              <span className="label">Last Scanned:</span>
              <span className="value">
                {new Date(qrCode.last_scanned).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .qr-display {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .qr-display-small {
          max-width: 200px;
        }

        .qr-display-medium {
          max-width: 300px;
        }

        .qr-display-large {
          max-width: 400px;
        }

        .qr-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .qr-info h4 {
          margin: 0;
          color: #333;
          font-size: 1.1rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .qr-image-container {
          text-align: center;
          margin-bottom: 16px;
        }

        .qr-image {
          width: ${sizeClasses[size].image};
          height: ${sizeClasses[size].image};
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .qr-error {
          color: #ef4444;
          font-size: 0.9rem;
          padding: 20px;
        }

        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 12px;
        }

        .error-message p {
          color: #dc2626;
          margin: 0;
          font-size: 0.85rem;
        }

        .qr-actions {
          text-align: center;
          margin-bottom: 16px;
        }

        .download-btn {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .download-btn:hover:not(:disabled) {
          background: #059669;
        }

        .download-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .spinner {
          width: 12px;
          height: 12px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .qr-details {
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 0.85rem;
        }

        .label {
          color: #6b7280;
          font-weight: 500;
        }

        .value {
          color: #374151;
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .qr-display {
            padding: 16px;
          }

          .qr-image {
            width: 180px;
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default QRDisplay; 