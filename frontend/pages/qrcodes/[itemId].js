import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import QRGenerator from '../../components/QR/QRGenerator';
import QRDisplay from '../../components/QR/QRDisplay';

const ItemQRManagementPage = () => {
  const router = useRouter();
  const { itemId } = router.query;
  
  const [item, setItem] = useState(null);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (itemId) {
      fetchItemData();
      fetchQRCodes();
    }
  }, [itemId]);

  const fetchItemData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/items/${itemId}`, {
        headers: {
          'Authorization': 'Demo demo-user-token',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch item');
      }

      if (result.success) {
        setItem(result.data.item);
      } else {
        throw new Error(result.message || 'Item not found');
      }
    } catch (err) {
      console.error('Fetch Item Error:', err);
      setError(`Failed to load item: ${err.message}`);
    }
  };

  const fetchQRCodes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8000/api/qrcodes?itemId=${itemId}`, {
        headers: {
          'Authorization': 'Demo demo-user-token',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch QR codes');
      }

      if (result.success) {
        setQrCodes(result.data.qrCodes || []);
      } else {
        throw new Error(result.message || 'Failed to load QR codes');
      }
    } catch (err) {
      console.error('Fetch QR Codes Error:', err);
      setError(`Failed to load QR codes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQRGenerated = (newQRCode) => {
    setQrCodes(prev => [newQRCode, ...prev]);
    setTimeout(() => {
      fetchQRCodes();
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>{item ? `QR Codes - ${item.name}` : 'QR Code Management'} - aiBnb</title>
        <meta name="description" content={`Manage QR codes for ${item?.name || 'item'}`} />
      </Head>
      
      <DashboardLayout>
        <div className="item-qr-page">
          <div className="page-header">
            <div className="header-left">
              <button
                onClick={() => router.push('/qrcodes')}
                className="back-btn"
              >
                ← Back to QR Codes
              </button>
              {item && (
                <div className="item-info">
                  <h1>{item.name}</h1>
                  <div className="item-details">
                    <span className="detail-item">📍 {item.location}</span>
                    <span className="detail-item">🏠 {item.property_name || 'Unknown Property'}</span>
                    <span className="detail-item">📂 {item.category || 'No Category'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {item && (
            <div className="qr-generator-section">
              <QRGenerator 
                item={item}
                onQRGenerated={handleQRGenerated}
              />
            </div>
          )}

          <div className="qr-codes-section">
            <div className="section-header">
              <h2>Existing QR Codes ({qrCodes.length})</h2>
            </div>

            {loading ? (
              <div className="loading-message">
                <div className="loading-spinner-small"></div>
                <p>Loading QR codes...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button onClick={fetchQRCodes} className="retry-btn">
                  🔄 Retry
                </button>
              </div>
            ) : qrCodes.length === 0 ? (
              <div className="no-qr-codes">
                <div className="no-qr-icon">📱</div>
                <h3>No QR Codes Generated Yet</h3>
                <p>Generate your first QR code using the generator above to get started.</p>
              </div>
            ) : (
              <div className="qr-codes-grid">
                {qrCodes.map(qrCode => (
                  <div key={qrCode.qr_id} className="qr-code-card">
                    <QRDisplay 
                      qrCode={qrCode} 
                      item={item} 
                      size="medium"
                      showDetails={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .item-qr-page {
            min-height: 100vh;
            background: #f8f9fa;
          }

          .page-header {
            background: white;
            border-bottom: 1px solid #e5e7eb;
            padding: 24px 40px;
          }

          .back-btn {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 16px;
          }

          .back-btn:hover {
            background: #e5e7eb;
          }

          .item-info h1 {
            margin: 0 0 12px 0;
            color: #1f2937;
            font-size: 1.8rem;
            font-weight: 700;
          }

          .item-details {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
          }

          .detail-item {
            background: #f3f4f6;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            color: #6b7280;
          }

          .qr-generator-section {
            padding: 24px 40px 0;
          }

          .qr-codes-section {
            padding: 40px;
          }

          .section-header {
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e5e7eb;
          }

          .section-header h2 {
            margin: 0;
            color: #1f2937;
            font-size: 1.4rem;
            font-weight: 600;
          }

          .loading-message, .error-message {
            text-align: center;
            padding: 40px 20px;
          }

          .loading-spinner-small {
            width: 24px;
            height: 24px;
            border: 3px solid #f3f4f6;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 12px;
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

          .qr-codes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 24px;
          }

          .qr-code-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .page-header {
              padding: 20px;
            }

            .qr-generator-section, .qr-codes-section {
              padding: 20px;
            }

            .qr-codes-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DashboardLayout>
    </>
  );
};

export default ItemQRManagementPage; 