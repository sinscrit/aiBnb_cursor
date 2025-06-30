/**
 * Item Detail Page
 * QR Code-Based Instructional System - View Item Details
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { apiService, apiHelpers } from '../../../utils/api';
import { SUCCESS_MESSAGES } from '../../../utils/constants';

const ItemDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState(null);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItemDetails();
    }
  }, [id]);

  const fetchItemDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const [itemResponse, qrResponse] = await Promise.all([
        apiService.items.getById(id),
        apiService.qrcodes.getAll({ itemId: id })
      ]);

      const itemResult = apiHelpers.extractData(itemResponse);
      const qrResult = apiHelpers.extractData(qrResponse);
      
      if (itemResult.item) {
        setItem(itemResult.item);
        setQrCodes(qrResult.qr_codes || []);
      } else {
        setError('Item not found');
      }
    } catch (err) {
      console.error('Fetch Item Details Error:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message || 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    setDeleting(true);
    setError('');

    try {
      await apiService.items.delete(id);
      
      router.push({
        pathname: '/items',
        query: { message: SUCCESS_MESSAGES.ITEM_DELETED }
      });
    } catch (err) {
      console.error('Delete Item Error:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message || 'Failed to delete item');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleGenerateQR = async () => {
    try {
      const response = await apiService.qrcodes.generate(id);
      const result = apiHelpers.extractData(response);
      
      // Refresh QR codes list
      fetchItemDetails();
    } catch (err) {
      console.error('Generate QR Error:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message || 'Failed to generate QR code');
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Item Details - aiBnb Management</title>
        </Head>
        
        <DashboardLayout>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p>Loading item details...</p>
          </div>
        </DashboardLayout>
      </>
    );
  }

  if (error && !item) {
    return (
      <>
        <Head>
          <title>Item Not Found - aiBnb Management</title>
        </Head>
        
        <DashboardLayout>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2>Item Not Found</h2>
            <p>{error}</p>
            <Link href="/items">Back to Items</Link>
          </div>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{item?.name || 'Item'} - aiBnb Management</title>
      </Head>
      
      <DashboardLayout>
        <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
          <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>
                <Link href="/items" style={{ color: '#3b82f6', textDecoration: 'none' }}>Items</Link>
                {item?.property_name && (
                  <>
                    <span> / </span>
                    <Link href={`/items?propertyId=${item.property_id}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      {item.property_name}
                    </Link>
                  </>
                )}
                <span> / </span>
                <span>{item?.name}</span>
              </div>
              <h1 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: '2.5rem', fontWeight: '700' }}>
                {item?.name}
              </h1>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {item?.metadata?.category || 'General'}
                </span>
                <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {qrCodes.length} QR Codes
                </span>
                {item?.media_type && (
                  <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                    {item.media_type === 'youtube' ? 'Video Guide' : 
                     item.media_type === 'pdf' ? 'PDF Guide' : 
                     item.media_type === 'image' ? 'Image Guide' : 
                     'Instructions'}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
              <button
                onClick={handleGenerateQR}
                style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  border: 'none',
                  padding: '12px 20px', 
                  borderRadius: '8px', 
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ➕ Generate QR
              </button>
              <Link 
                href={`/items/${id}/edit`}
                style={{ 
                  background: '#3b82f6', 
                  color: 'white', 
                  padding: '12px 20px', 
                  borderRadius: '8px', 
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ✏️ Edit Item
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{ 
                  background: '#dc2626', 
                  color: 'white', 
                  border: 'none',
                  padding: '12px 20px', 
                  borderRadius: '8px', 
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                disabled={deleting}
              >
                🗑️ Delete Item
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px', margin: '24px 40px' }}>
              <p style={{ color: '#dc2626', margin: '0', fontWeight: '500' }}>{error}</p>
            </div>
          )}

          <div style={{ padding: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 24px 0', color: '#1f2937', fontSize: '1.3rem', fontWeight: '600' }}>
                  Item Information
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Name:</strong>
                    <span style={{ color: '#6b7280' }}>{item?.name}</span>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Location:</strong>
                    <span style={{ color: '#6b7280' }}>{item?.location || 'No location specified'}</span>
                  </div>
                  {item?.property_name && (
                    <div>
                      <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Property:</strong>
                      <span style={{ color: '#6b7280' }}>{item.property_name}</span>
                    </div>
                  )}
                  {item?.description && (
                    <div>
                      <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Description:</strong>
                      <span style={{ color: '#6b7280' }}>{item.description}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 24px 0', color: '#1f2937', fontSize: '1.3rem', fontWeight: '600' }}>
                  Instructions & Media
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {item?.media_type && (
                    <div>
                      <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Media Type:</strong>
                      <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                        {item.media_type === 'youtube' ? 'YouTube Video' : 
                         item.media_type === 'pdf' ? 'PDF Document' : 
                         item.media_type === 'image' ? 'Image Guide' : 
                         item.media_type}
                      </span>
                    </div>
                  )}
                  {item?.media_url && (
                    <div>
                      <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Media URL:</strong>
                      <a href={item.media_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                        View Instructions ↗
                      </a>
                    </div>
                  )}
                  {item?.metadata?.difficulty && (
                    <div>
                      <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Difficulty:</strong>
                      <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>{item.metadata.difficulty}</span>
                    </div>
                  )}
                  {item?.metadata?.duration && (
                    <div>
                      <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Duration:</strong>
                      <span style={{ color: '#6b7280' }}>{item.metadata.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* QR Codes Section */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: '0', color: '#1f2937', fontSize: '1.3rem', fontWeight: '600' }}>
                  QR Codes ({qrCodes.length})
                </h3>
                <Link 
                  href={`/qrcodes?itemId=${id}`}
                  style={{ 
                    background: '#3b82f6', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Manage QR Codes
                </Link>
              </div>
              
              {qrCodes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {qrCodes.map((qr) => (
                    <div key={qr.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <img 
                          src={`data:image/png;base64,${qr.image_data}`} 
                          alt={`QR Code for ${item.name}`}
                          style={{ width: '100px', height: '100px', margin: '0 auto' }}
                        />
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#6b7280' }}>
                        Scans: {qr.scan_count || 0}
                      </p>
                      <p style={{ margin: '0', fontSize: '0.75rem', color: '#9ca3af' }}>
                        Created: {new Date(qr.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                  <p style={{ margin: '0 0 16px 0' }}>No QR codes generated yet</p>
                  <button
                    onClick={handleGenerateQR}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px', 
                      borderRadius: '6px', 
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Generate First QR Code
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: 'rgba(0, 0, 0, 0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '32px', 
                maxWidth: '400px', 
                width: '90%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '1.25rem', fontWeight: '600' }}>
                  Delete Item
                </h3>
                <p style={{ margin: '0 0 24px 0', color: '#6b7280', lineHeight: '1.5' }}>
                  Are you sure you want to delete "{item?.name}"? This will also deactivate all associated QR codes ({qrCodes.length} QR codes). 
                  This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    style={{ 
                      background: '#f3f4f6', 
                      color: '#374151', 
                      border: 'none',
                      padding: '8px 16px', 
                      borderRadius: '6px', 
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteItem}
                    style={{ 
                      background: '#dc2626', 
                      color: 'white', 
                      border: 'none',
                      padding: '8px 16px', 
                      borderRadius: '6px', 
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete Item'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ItemDetailPage;
