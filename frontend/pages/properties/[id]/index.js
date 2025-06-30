/**
 * Property Detail Page
 * QR Code-Based Instructional System - View Property Details
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { apiService, apiHelpers } from '../../../utils/api';
import { SUCCESS_MESSAGES } from '../../../utils/constants';

const PropertyDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const [propertyResponse, itemsResponse] = await Promise.all([
        apiService.properties.getById(id),
        apiService.items.getAll({ propertyId: id })
      ]);

      const propertyResult = apiHelpers.extractData(propertyResponse);
      const itemsResult = apiHelpers.extractData(itemsResponse);
      
      if (propertyResult.property) {
        setProperty(propertyResult.property);
        setItems(itemsResult.items || []);
      } else {
        setError('Property not found');
      }
    } catch (err) {
      console.error('Fetch Property Details Error:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message || 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    setDeleting(true);
    setError('');

    try {
      await apiService.properties.delete(id);
      
      router.push({
        pathname: '/properties',
        query: { message: SUCCESS_MESSAGES.PROPERTY_DELETED }
      });
    } catch (err) {
      console.error('Delete Property Error:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message || 'Failed to delete property');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Property Details - aiBnb Management</title>
        </Head>
        
        <DashboardLayout>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p>Loading property details...</p>
          </div>
        </DashboardLayout>
      </>
    );
  }

  if (error && !property) {
    return (
      <>
        <Head>
          <title>Property Not Found - aiBnb Management</title>
        </Head>
        
        <DashboardLayout>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2>Property Not Found</h2>
            <p>{error}</p>
            <Link href="/properties">Back to Properties</Link>
          </div>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{property?.name || 'Property'} - aiBnb Management</title>
      </Head>
      
      <DashboardLayout>
        <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
          <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>
                <Link href="/properties" style={{ color: '#3b82f6', textDecoration: 'none' }}>Properties</Link>
                <span> / </span>
                <span>{property?.name}</span>
              </div>
              <h1 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: '2.5rem', fontWeight: '700' }}>
                {property?.name}
              </h1>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {property?.property_type || 'Other'}
                </span>
                <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {items.length} Items
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
              <Link 
                href={`/properties/${id}/edit`}
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
                ✏️ Edit Property
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
                🗑️ Delete Property
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
                  Property Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Name:</strong>
                    <span style={{ color: '#6b7280' }}>{property?.name}</span>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Type:</strong>
                    <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>{property?.property_type || 'Other'}</span>
                  </div>
                  {property?.address && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Address:</strong>
                      <span style={{ color: '#6b7280' }}>{property.address}</span>
                    </div>
                  )}
                  {property?.description && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>Description:</strong>
                      <span style={{ color: '#6b7280' }}>{property.description}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 24px 0', color: '#1f2937', fontSize: '1.3rem', fontWeight: '600' }}>
                  Property Statistics
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
                      {items.length}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total Items</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
                      {items.filter(item => item.qr_codes && item.qr_codes.length > 0).length}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Items with QR</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
                      {items.reduce((sum, item) => sum + (item.qr_codes?.length || 0), 0)}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total QR Codes</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: '0', color: '#1f2937', fontSize: '1.5rem', fontWeight: '600' }}>
                  Property Items
                </h2>
                <Link 
                  href={`/items/create?propertyId=${id}`}
                  style={{ 
                    background: '#f3f4f6', 
                    color: '#374151', 
                    border: '1px solid #d1d5db',
                    padding: '12px 20px', 
                    borderRadius: '8px', 
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  + Add Item
                </Link>
              </div>
              
              {items.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {items.map(item => (
                    <div key={item.item_id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>{item.name}</h4>
                      <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.9rem' }}>{item.location}</p>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                        QR Codes: {item.qr_codes?.length || 0}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📦</div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '1.5rem' }}>No Items Yet</h3>
                  <p style={{ color: '#6b7280', margin: '0 0 24px 0', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                    This property doesn't have any items yet. Add some items to get started with QR code generation.
                  </p>
                  <Link 
                    href={`/items/create?propertyId=${id}`}
                    style={{ 
                      background: '#3b82f6', 
                      color: 'white', 
                      padding: '12px 24px', 
                      borderRadius: '8px', 
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    Add First Item
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div 
            style={{ 
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
            }}
            onClick={() => setShowDeleteModal(false)}
          >
            <div 
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                maxWidth: '500px', 
                width: '90%', 
                maxHeight: '90vh', 
                overflow: 'auto' 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px 24px 0 24px' }}>
                <h3 style={{ margin: '0', color: '#dc2626', fontSize: '1.3rem' }}>⚠️ Delete Property</h3>
              </div>
              <div style={{ padding: '16px 24px' }}>
                <p style={{ margin: '0 0 16px 0', color: '#374151' }}>
                  <strong>Are you sure you want to delete "{property?.name}"?</strong>
                </p>
                <p style={{ margin: '0 0 16px 0', color: '#374151' }}>This action will:</p>
                <ul style={{ margin: '16px 0', paddingLeft: '20px' }}>
                  <li style={{ color: '#6b7280', marginBottom: '4px' }}>Permanently delete the property</li>
                  <li style={{ color: '#6b7280', marginBottom: '4px' }}>Delete all {items.length} associated items</li>
                  <li style={{ color: '#6b7280', marginBottom: '4px' }}>Deactivate all QR codes for this property</li>
                  <li style={{ color: '#6b7280', marginBottom: '4px' }}>Remove all associated content pages</li>
                </ul>
                <p style={{ margin: '0', color: '#dc2626', fontWeight: '600' }}>This action cannot be undone.</p>
              </div>
              <div style={{ padding: '16px 24px 24px 24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{ 
                    background: '#f3f4f6', 
                    color: '#374151', 
                    border: '1px solid #d1d5db',
                    padding: '12px 20px', 
                    borderRadius: '8px', 
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProperty}
                  style={{ 
                    background: '#dc2626', 
                    color: 'white', 
                    border: 'none',
                    padding: '12px 20px', 
                    borderRadius: '8px', 
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Property'}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
};

export default PropertyDetailPage; 