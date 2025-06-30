/**
 * Item Form Component
 * QR Code-Based Instructional System - Item Creation and Editing Form with Property Selection
 */

import { useState, useEffect } from 'react';

const ItemForm = ({ 
  item = null, 
  properties = [],
  onSubmit, 
  onCancel, 
  loading = false,
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    property_id: '',
    name: '',
    description: '',
    location: '',
    media_url: '',
    media_type: 'text'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const mediaTypes = [
    { value: 'text', label: 'Text/Instructions' },
    { value: 'youtube', label: 'YouTube Video' },
    { value: 'image', label: 'Image' },
    { value: 'pdf', label: 'PDF Document' },
    { value: 'other', label: 'Other' }
  ];

  // Common location suggestions based on item types and rental properties
  const getLocationSuggestions = (itemName = '') => {
    const commonLocations = [
      'Kitchen',
      'Living Room',
      'Bedroom',
      'Bathroom',
      'Balcony',
      'Dining Room',
      'Laundry Room',
      'Garage',
      'Basement',
      'Storage Room',
      'Office',
      'Guest Room'
    ];

    const applianceLocations = [
      'Kitchen Counter',
      'Under Kitchen Sink',
      'Next to Refrigerator',
      'Laundry Area',
      'Utility Closet',
      'Bathroom Vanity',
      'Living Room Entertainment Center'
    ];

    const name = itemName.toLowerCase();
    if (name.includes('coffee') || name.includes('microwave') || name.includes('dish') || name.includes('kitchen')) {
      return ['Kitchen', 'Kitchen Counter', 'Next to Refrigerator', ...commonLocations];
    }
    if (name.includes('washing') || name.includes('dryer') || name.includes('laundry')) {
      return ['Laundry Room', 'Laundry Area', 'Utility Closet', ...commonLocations];
    }
    if (name.includes('tv') || name.includes('remote') || name.includes('sound')) {
      return ['Living Room', 'Living Room Entertainment Center', 'Bedroom', ...commonLocations];
    }
    if (name.includes('wifi') || name.includes('router') || name.includes('internet')) {
      return ['Office', 'Living Room', 'Utility Closet', ...commonLocations];
    }

    return [...commonLocations, ...applianceLocations];
  };

  // Initialize form with existing item data for editing
  useEffect(() => {
    if (item && mode === 'edit') {
      setFormData({
        property_id: item.property_id || '',
        name: item.name || '',
        description: item.description || '',
        location: item.location || '',
        media_url: item.media_url || '',
        media_type: item.media_type || 'text'
      });
    }
  }, [item, mode]);

  // Update location suggestions when item name changes
  useEffect(() => {
    setLocationSuggestions(getLocationSuggestions(formData.name));
  }, [formData.name]);

  const validateForm = () => {
    const newErrors = {};

    // Property validation
    if (!formData.property_id) {
      newErrors.property_id = 'Property selection is required';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Item name must be at least 2 characters';
    } else if (formData.name.trim().length > 255) {
      newErrors.name = 'Item name must be less than 255 characters';
    }

    // Description validation (optional but if provided should be reasonable length)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Location validation (optional but if provided should be reasonable length)
    if (formData.location && formData.location.length > 255) {
      newErrors.location = 'Location must be less than 255 characters';
    }

    // Media URL validation (optional but if provided should be valid URL)
    if (formData.media_url) {
      try {
        new URL(formData.media_url);
      } catch {
        newErrors.media_url = 'Please enter a valid URL';
      }
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

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
    if (errors.location) {
      setErrors(prev => ({
        ...prev,
        location: ''
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
        property_id: formData.property_id,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        media_url: formData.media_url.trim() || null,
        media_type: formData.media_type
      };

      if (onSubmit) {
        await onSubmit(submissionData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({
        submit: error.message || 'Failed to save item. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (mode === 'edit' && item) {
      setFormData({
        property_id: item.property_id || '',
        name: item.name || '',
        description: item.description || '',
        location: item.location || '',
        media_url: item.media_url || '',
        media_type: item.media_type || 'text'
      });
    } else {
      setFormData({
        property_id: '',
        name: '',
        description: '',
        location: '',
        media_url: '',
        media_type: 'text'
      });
    }
    setErrors({});
  };

  const selectedProperty = properties.find(p => p.id === formData.property_id);

  return (
    <div className="item-form">
      <div className="form-header">
        <h2 className="form-title">
          {mode === 'edit' ? 'Edit Item' : 'Create New Item'}
        </h2>
        <p className="form-subtitle">
          {mode === 'edit' 
            ? 'Update your item information below.'
            : 'Add a new item to your property and start building your QR code system.'
          }
        </p>
        {selectedProperty && (
          <div className="selected-property">
            <span className="property-icon">🏢</span>
            <span className="property-text">Adding to: <strong>{selectedProperty.name}</strong></span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="property_id" className="form-label">
                Property <span className="required">*</span>
              </label>
              <select
                id="property_id"
                name="property_id"
                value={formData.property_id}
                onChange={handleInputChange}
                className={`form-select ${errors.property_id ? 'error' : ''}`}
                disabled={isSubmitting || loading}
              >
                <option value="">Select a property...</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
              {errors.property_id && (
                <span className="form-error">{errors.property_id}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Item Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Coffee Maker Instructions"
                className={`form-input ${errors.name ? 'error' : ''}`}
                disabled={isSubmitting || loading}
              />
              {errors.name && (
                <span className="form-error">{errors.name}</span>
              )}
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
              placeholder="Brief description of the item or instructions (optional)"
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
        </div>

        <div className="form-section">
          <h3 className="section-title">Location & Media</h3>
          
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Where is this item located? (optional)"
              className={`form-input ${errors.location ? 'error' : ''}`}
              disabled={isSubmitting || loading}
            />
            {errors.location && (
              <span className="form-error">{errors.location}</span>
            )}
            
            {locationSuggestions.length > 0 && (
              <div className="location-suggestions">
                <span className="suggestions-label">Suggestions:</span>
                <div className="suggestions-list">
                  {locationSuggestions.slice(0, 8).map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLocationSelect(suggestion)}
                      className="suggestion-button"
                      disabled={isSubmitting || loading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="media_type" className="form-label">
                Media Type
              </label>
              <select
                id="media_type"
                name="media_type"
                value={formData.media_type}
                onChange={handleInputChange}
                className="form-select"
                disabled={isSubmitting || loading}
              >
                {mediaTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="media_url" className="form-label">
                Media URL
              </label>
              <input
                type="url"
                id="media_url"
                name="media_url"
                value={formData.media_url}
                onChange={handleInputChange}
                placeholder="https://example.com/instructions (optional)"
                className={`form-input ${errors.media_url ? 'error' : ''}`}
                disabled={isSubmitting || loading}
              />
              {errors.media_url && (
                <span className="form-error">{errors.media_url}</span>
              )}
            </div>
          </div>
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
            disabled={isSubmitting || loading || !formData.property_id}
          >
            {isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Update Item' : 'Create Item')}
          </button>
        </div>
      </form>

      <style jsx>{`
        .item-form {
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
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .selected-property {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #dbeafe;
          border: 1px solid #3b82f6;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #1d4ed8;
        }

        .property-icon {
          font-size: 1rem;
        }

        .form {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f3f4f6;
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

        .form-input.error, .form-textarea.error, .form-select.error {
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

        .location-suggestions {
          margin-top: 0.5rem;
        }

        .suggestions-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          display: block;
          margin-bottom: 0.5rem;
        }

        .suggestions-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .suggestion-button {
          padding: 0.25rem 0.5rem;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #374151;
        }

        .suggestion-button:hover:not(:disabled) {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        .suggestion-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

          .suggestions-list {
            gap: 0.25rem;
          }

          .suggestion-button {
            font-size: 0.6875rem;
            padding: 0.25rem 0.375rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemForm; 