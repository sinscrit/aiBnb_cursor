/**
 * Property Edit Page
 * QR Code-Based Instructional System - Edit Existing Property
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import PropertyForm from '../../../components/Property/PropertyForm';
import { apiService, apiHelpers } from '../../../utils/api';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../utils/constants';

const PropertyEditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.properties.getById(id);
      const result = apiHelpers.extractData(response);
      
      if (result.property) {
        setProperty(result.property);
      } else {
        setError('Property not found');
      }
    } catch (err) {
      console.error('Fetch Property Error:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message || 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyUpdate = async (formData) => {
    setSaving(true);
    setError('');

    try {
      const response = await apiService.properties.update(id, formData);
      const result = apiHelpers.extractData(response);
      
      // Show success message
      router.push({
        pathname: '/properties',
        query: { message: SUCCESS_MESSAGES.PROPERTY_UPDATED }
      });
    } catch (err) {
      console.error('Update Property Error:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message || 'Failed to update property');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/properties');
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Edit Property - aiBnb Management</title>
        </Head>
        
        <DashboardLayout>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading property...</p>
          </div>

          <style jsx>{`
            .loading-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 60px 20px;
              text-align: center;
            }

            .loading-spinner {
              width: 40px;
              height: 40px;
              border: 4px solid #f3f4f6;
              border-top: 4px solid #3b82f6;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-bottom: 16px;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            .loading-container p {
              color: #6b7280;
              margin: 0;
            }
          `}</style>
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
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Property Not Found</h2>
            <p>{error}</p>
            <button 
              onClick={() => router.push('/properties')}
              className="back-btn"
            >
              Back to Properties
            </button>
          </div>

          <style jsx>{`
            .error-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 60px 20px;
              text-align: center;
            }

            .error-icon {
              font-size: 3rem;
              margin-bottom: 16px;
            }

            .error-container h2 {
              color: #dc2626;
              margin: 0 0 8px 0;
            }

            .error-container p {
              color: #6b7280;
              margin: 0 0 24px 0;
            }

            .back-btn {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 500;
              transition: background 0.2s;
            }

            .back-btn:hover {
              background: #2563eb;
            }
          `}</style>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Property: {property?.name || 'Loading...'} - aiBnb Management</title>
        <meta name="description" content="Edit property information and settings" />
      </Head>
      
      <DashboardLayout>
        <div className="edit-property-page">
          <div className="page-header">
            <div className="header-content">
              <h1>Edit Property</h1>
              <p>Update property information and settings</p>
            </div>
            <div className="header-actions">
              <button
                onClick={handleCancel}
                className="secondary-btn"
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <p>{error}</p>
            </div>
          )}

          <div className="form-container">
            <PropertyForm
              property={property}
              onSubmit={handlePropertyUpdate}
              onCancel={handleCancel}
              loading={saving}
              mode="edit"
            />
          </div>
        </div>

        <style jsx>{`
          .edit-property-page {
            min-height: 100vh;
            background: #f8f9fa;
          }

          .page-header {
            background: white;
            border-bottom: 1px solid #e5e7eb;
            padding: 32px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-content h1 {
            margin: 0 0 8px 0;
            color: #1f2937;
            font-size: 2rem;
            font-weight: 700;
          }

          .header-content p {
            margin: 0;
            color: #6b7280;
            font-size: 1.1rem;
          }

          .secondary-btn {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 0.95rem;
          }

          .secondary-btn:hover:not(:disabled) {
            background: #e5e7eb;
            transform: translateY(-1px);
          }

          .secondary-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .error-banner {
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 40px;
          }

          .error-banner p {
            color: #dc2626;
            margin: 0;
            font-weight: 500;
          }

          .form-container {
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }

          @media (max-width: 768px) {
            .page-header {
              flex-direction: column;
              gap: 16px;
              align-items: flex-start;
              padding: 24px 20px;
            }

            .form-container {
              padding: 20px;
            }

            .error-banner {
              margin: 20px;
            }
          }
        `}</style>
      </DashboardLayout>
    </>
  );
};

export default PropertyEditPage; 