import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { apiService, apiHelpers } from '../../utils/api';
import { SUCCESS_MESSAGES } from '../../utils/constants';

const QRGenerator = ({ item, onQRGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedQR, setGeneratedQR] = useState(null);

  const generateQRCode = async () => {
    if (!item || !item.item_id) {
      setError('Item information is required to generate QR code');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.qrcodes.create({
        itemId: item.item_id,
        format: 'png',
        size: 256
      });

      const result = apiHelpers.extractData(response);
      setGeneratedQR(result.qrCode);
      setSuccess(SUCCESS_MESSAGES.QR_GENERATED);
      
      if (onQRGenerated) {
        onQRGenerated(result.qrCode);
      }
    } catch (err) {
      console.error('QR Generation Error:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message || 'Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = async (qrId) => {
    try {
      const response = await apiService.qrcodes.download(qrId);
      const blob = response.data;
      apiHelpers.downloadFile(blob, `qr-code-${item.name || item.item_id}.png`);
    } catch (err) {
      console.error('Download Error:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message || 'Failed to download QR code');
    }
  };

  return (
    <div className="qr-generator">
      <div className="generator-header">
        <h3>QR Code Generator</h3>
        {item && (
          <div className="item-info">
            <p><strong>Item:</strong> {item.name}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Property:</strong> {item.property_name || 'N/A'}</p>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="success-message">
          <p>{success}</p>
        </div>
      )}

      <div className="generator-controls">
        <button
          onClick={generateQRCode}
          disabled={isGenerating || !item}
          className={`generate-btn ${isGenerating ? 'generating' : ''}`}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              Generating QR Code...
            </>
          ) : (
            'Generate QR Code'
          )}
        </button>

        {generatedQR && (
          <button
            onClick={() => downloadQRCode(generatedQR.qr_id)}
            className="download-btn"
          >
            Download PNG
          </button>
        )}
      </div>

      {generatedQR && (
        <div className="generated-qr-preview">
          <h4>Generated QR Code</h4>
          <div className="qr-details">
            <p><strong>QR ID:</strong> {generatedQR.qr_id}</p>
            <p><strong>Format:</strong> {generatedQR.format}</p>
            <p><strong>Size:</strong> {generatedQR.size}x{generatedQR.size}px</p>
            <p><strong>Created:</strong> {new Date(generatedQR.created_at).toLocaleString()}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .qr-generator {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .generator-header h3 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 1.2rem;
        }

        .item-info {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
        }

        .item-info p {
          margin: 4px 0;
          font-size: 0.9rem;
          color: #666;
        }

        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .error-message p {
          color: #dc2626;
          margin: 0;
          font-size: 0.9rem;
        }

        .success-message {
          background: #d1fae5;
          border: 1px solid #a7f3d0;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .success-message p {
          color: #065f46;
          margin: 0;
          font-size: 0.9rem;
        }

        .generator-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .generate-btn, .download-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .generate-btn {
          background: #3b82f6;
          color: white;
        }

        .generate-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .generate-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .generate-btn.generating {
          background: #6b7280;
        }

        .download-btn {
          background: #10b981;
          color: white;
        }

        .download-btn:hover {
          background: #059669;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .generated-qr-preview {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }

        .generated-qr-preview h4 {
          margin: 0 0 12px 0;
          color: #333;
          font-size: 1rem;
        }

        .qr-details p {
          margin: 6px 0;
          font-size: 0.85rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .qr-generator {
            padding: 16px;
          }

          .generator-controls {
            flex-direction: column;
          }

          .generate-btn, .download-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default QRGenerator; 