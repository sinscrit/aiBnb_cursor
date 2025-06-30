/**
 * Property Creation Page
 * QR Code-Based Instructional System - Create New Property Interface
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PropertyForm from '../../components/Property/PropertyForm';

const CreatePropertyPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Show success message
        alert(`Property "${data.data.property.name}" created successfully!`);
        
        // Navigate back to properties list
        router.push('/properties');
      } else {
        throw new Error(data.message || 'Failed to create property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      throw error; // Re-throw to be handled by PropertyForm component
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/properties');
    }
  };

  return (
    <DashboardLayout title="Create Property">
      <div className="create-property-page">
        <div className="page-header">
          <div className="breadcrumb">
            <button 
              onClick={() => router.push('/properties')}
              className="breadcrumb-link"
            >
              Properties
            </button>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Create New Property</span>
          </div>
        </div>

        <div className="page-content">
          <div className="form-container">
            <PropertyForm
              mode="create"
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={isSubmitting}
            />
          </div>

          <div className="info-sidebar">
            <div className="info-card">
              <h3 className="info-title">Getting Started</h3>
              <div className="info-content">
                <p className="info-text">
                  Create a property to start organizing your rental management system:
                </p>
                <ul className="info-list">
                  <li>Add property details and description</li>
                  <li>Specify the property type for better organization</li>
                  <li>Include address for guest reference</li>
                  <li>Start adding items after creation</li>
                </ul>
              </div>
            </div>

            <div className="info-card">
              <h3 className="info-title">Next Steps</h3>
              <div className="info-content">
                <p className="info-text">
                  After creating your property, you can:
                </p>
                <ul className="info-list">
                  <li>Add items to the property</li>
                  <li>Assign locations to each item</li>
                  <li>Generate QR codes for instant access</li>
                  <li>Share QR codes with guests</li>
                </ul>
              </div>
            </div>

            <div className="info-card demo-notice">
              <div className="demo-header">
                <span className="demo-icon">🚀</span>
                <h3 className="info-title">Demo Mode</h3>
              </div>
              <div className="info-content">
                <p className="info-text">
                  You're using the demo version with a hardcoded user. In production, properties will be associated with your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .create-property-page {
          max-width: 100%;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .breadcrumb-link {
          color: #3b82f6;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font-size: inherit;
        }

        .breadcrumb-link:hover {
          color: #2563eb;
        }

        .breadcrumb-separator {
          color: #9ca3af;
          font-weight: 500;
        }

        .breadcrumb-current {
          color: #6b7280;
          font-weight: 500;
        }

        .page-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
          align-items: flex-start;
        }

        .form-container {
          width: 100%;
        }

        .info-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .info-card.demo-notice {
          background: #fef3c7;
          border-color: #f59e0b;
        }

        .demo-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .demo-icon {
          font-size: 1.25rem;
        }

        .info-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .demo-notice .info-title {
          color: #92400e;
          margin: 0;
        }

        .info-content {
          color: #4b5563;
        }

        .demo-notice .info-content {
          color: #92400e;
        }

        .info-text {
          margin: 0 0 1rem 0;
          line-height: 1.5;
          font-size: 0.875rem;
        }

        .info-text:last-child {
          margin-bottom: 0;
        }

        .info-list {
          margin: 0;
          padding-left: 1.25rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .info-list li {
          margin-bottom: 0.5rem;
        }

        .info-list li:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 1024px) {
          .page-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .info-sidebar {
            order: -1;
          }

          .info-sidebar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .info-sidebar {
            grid-template-columns: 1fr;
          }

          .breadcrumb {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default CreatePropertyPage; 