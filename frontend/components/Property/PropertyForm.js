/**
 * Property Form Component
 * QR Code-Based Instructional System - Property Creation and Editing Form
 */

import { useState, useEffect } from 'react';

const PropertyForm = ({ 
  property = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    property_type: 'other'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'studio', label: 'Studio' },
    { value: 'other', label: 'Other' }
  ];

  // Initialize form with existing property data for editing
  useEffect(() => {
    if (property && mode === 'edit') {
      setFormData({
        name: property.name || '',
        description: property.description || '',
        address: property.address || '',
        property_type: property.property_type || 'other'
      });
    }
  }, [property, mode]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Property name must be at least 2 characters';
    } else if (formData.name.trim().length > 255) {
      newErrors.name = 'Property name must be less than 255 characters';
    }

    // Description validation (optional but if provided should be reasonable length)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Address validation (optional but if provided should be reasonable length)
    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'Address must be less than 500 characters';
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare submission data
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        address: formData.address.trim() || null,
        property_type: formData.property_type
      };

      if (onSubmit) {
        await onSubmit(submissionData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({
        submit: error.message || 'Failed to save property. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (mode === 'edit' && property) {
      setFormData({
        name: property.name || '',
        description: property.description || '',
        address: property.address || '',
        property_type: property.property_type || 'other'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        address: '',
        property_type: 'other'
      });
    }
    setErrors({});
  };

  return (
    <div className="property-form">
      <div className="form-header">
        <h2 className="form-title">
          {mode === 'edit' ? 'Edit Property' : 'Create New Property'}
        </h2>
        <p className="form-subtitle">
          {mode === 'edit' 
            ? 'Update your property information below.'
            : 'Add a new rental property to start managing items and QR codes.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Property Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Sunset Apartment #201"
              className={`form-input ${errors.name ? 'error' : ''}`}
              disabled={isSubmitting || loading}
            />
            {errors.name && (
              <span className="form-error">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="property_type" className="form-label">
              Property Type
            </label>
            <select
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={handleInputChange}
              className="form-select"
              disabled={isSubmitting || loading}
            >
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the property (optional)"
            rows={4}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            disabled={isSubmitting || loading}
          />
          {errors.description && (
            <span className="form-error">{errors.description}</span>
          )}
          <span className="form-help">
            {formData.description.length}/1000 characters
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="e.g. 123 Main St, City, State 12345 (optional)"
            className={`form-input ${errors.address ? 'error' : ''}`}
            disabled={isSubmitting || loading}
          />
          {errors.address && (
            <span className="form-error">{errors.address}</span>
          )}
        </div>

        {errors.submit && (
          <div className="form-error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{errors.submit}</span>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isSubmitting || loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline"
            disabled={isSubmitting || loading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Update Property' : 'Create Property')}
          </button>
        </div>
      </form>

      <style jsx>{`
        .property-form {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .form-header {
          padding: 2rem 2rem 1rem 2rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .form-subtitle {
          color: #6b7280;
          margin: 0;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .form {
          padding: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .required {
          color: #ef4444;
        }

        .form-input, .form-textarea, .form-select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: white;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input.error, .form-textarea.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-input:disabled, .form-textarea:disabled, .form-select:disabled {
          background: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-error {
          font-size: 0.75rem;
          color: #ef4444;
          margin-top: 0.25rem;
        }

        .form-help {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .form-error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
        }

        .error-icon {
          font-size: 1.25rem;
        }

        .error-text {
          color: #dc2626;
          font-size: 0.875rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1.5rem;
          border-top: 1px solid #f3f4f6;
        }

        .btn-primary, .btn-secondary, .btn-outline {
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
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

        .btn-outline {
          background: white;
          color: #374151;
          border-color: #d1d5db;
        }

        .btn-outline:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-primary:disabled, .btn-secondary:disabled, .btn-outline:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-header {
            padding: 1.5rem 1.5rem 1rem 1.5rem;
          }

          .form {
            padding: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn-primary, .btn-secondary, .btn-outline {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyForm; 