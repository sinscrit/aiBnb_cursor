/**
 * Item Form Component
 * QR Code-Based Instructional System - Item Creation and Editing Form
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ItemForm = ({ 
  item = null, 
  properties = [],
  onSubmit, 
  onCancel, 
  loading = false,
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    property_id: '',
    media_url: '',
    media_type: 'text',
    metadata: {
      category: '',
      difficulty: 'easy',
      duration: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const mediaTypes = [
    { value: 'text', label: 'Text Instructions' },
    { value: 'youtube', label: 'YouTube Video' },
    { value: 'image', label: 'Image Guide' },
    { value: 'pdf', label: 'PDF Document' },
    { value: 'other', label: 'Other' }
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const itemCategories = [
    { value: '', label: 'Select category...' },
    { value: 'kitchen', label: 'Kitchen Appliance' },
    { value: 'bathroom', label: 'Bathroom Fixture' },
    { value: 'bedroom', label: 'Bedroom Item' },
    { value: 'living', label: 'Living Room Item' },
    { value: 'appliance', label: 'General Appliance' },
    { value: 'electronic', label: 'Electronics' },
    { value: 'hvac', label: 'Heating/Cooling' },
    { value: 'safety', label: 'Safety Equipment' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' }
  ];

  // Initialize form with existing item data for editing
  useEffect(() => {
    if (item && mode === 'edit') {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        location: item.location || '',
        property_id: item.property_id || '',
        media_url: item.media_url || '',
        media_type: item.media_type || 'text',
        metadata: {
          category: item.metadata?.category || '',
          difficulty: item.metadata?.difficulty || 'easy',
          duration: item.metadata?.duration || ''
        }
      });
    }
  }, [item, mode]);

  // Set default property if only one property available
  useEffect(() => {
    if (properties.length === 1 && !formData.property_id && mode === 'create') {
      setFormData(prev => ({
        ...prev,
        property_id: properties[0].id
      }));
    }
  }, [properties, formData.property_id, mode]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Item name must be at least 2 characters';
    } else if (formData.name.trim().length > 255) {
      newErrors.name = 'Item name must be less than 255 characters';
    }

    // Property validation
    if (!formData.property_id) {
      newErrors.property_id = 'Property selection is required';
    }

    // Description validation (optional but if provided should be reasonable length)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Location validation (optional but if provided should be reasonable length)
    if (formData.location && formData.location.length > 255) {
      newErrors.location = 'Location must be less than 255 characters';
    }

    // Media URL validation
    if (formData.media_url) {
      if (formData.media_type === 'youtube') {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        if (!youtubeRegex.test(formData.media_url)) {
          newErrors.media_url = 'Please enter a valid YouTube URL';
        }
      } else if (formData.media_type === 'image') {
        const imageRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(formData.media_url)) {
          newErrors.media_url = 'Please enter a valid image URL';
        } else if (!imageRegex.test(formData.media_url)) {
          newErrors.media_url = 'URL must point to an image file (jpg, png, gif, webp)';
        }
      } else if (formData.media_type === 'pdf') {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(formData.media_url)) {
          newErrors.media_url = 'Please enter a valid PDF URL';
      }
      }
    }

    // Duration validation
    if (formData.metadata.duration && formData.metadata.duration.length > 50) {
      newErrors.duration = 'Duration must be less than 50 characters';
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    console.log('Select change:', { name, value });
    
    if (name === 'property_id') {
      setFormData(prev => ({
        ...prev,
        property_id: value
      }));
    } else if (name === 'metadata.category') {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          category: value
        }
      }));
    } else if (name === 'metadata.difficulty') {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          difficulty: value
        }
      }));
    } else if (name === 'media_type') {
      setFormData(prev => ({
        ...prev,
        media_type: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug logging for form data structure
    console.log('Form Submission Debug:', {
      formDataComplete: formData,
      metadataFields: {
        hasMetadata: Boolean(formData.metadata),
        metadataKeys: formData.metadata ? Object.keys(formData.metadata) : [],
        category: formData.metadata?.category,
        difficulty: formData.metadata?.difficulty,
        duration: formData.metadata?.duration
      },
      mediaFields: {
        hasMediaType: Boolean(formData.media_type),
        mediaTypeValue: formData.media_type,
        mediaUrl: formData.media_url
      }
    });

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      console.log('Validation Errors:', formErrors);
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare the submission data with all required fields
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        property_id: formData.property_id,
        media_url: formData.media_url.trim() || null,
        media_type: formData.media_type,
        metadata: {
          category: formData.metadata.category || null,
          difficulty: formData.metadata.difficulty || 'easy',
          duration: formData.metadata.duration || null
        }
      };

      console.log('Submitting form data:', submissionData);
      const response = await onSubmit(submissionData);
      
      if (response.data.success) {
        router.push('/items');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to create item'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (mode === 'edit' && item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        location: item.location || '',
        property_id: item.property_id || '',
        media_url: item.media_url || '',
        media_type: item.media_type || 'text',
        metadata: {
          category: item.metadata?.category || '',
          difficulty: item.metadata?.difficulty || 'easy',
          duration: item.metadata?.duration || ''
        }
      });
    } else {
      setFormData({
        name: '',
        description: '',
        location: '',
        property_id: properties.length === 1 ? properties[0].id : '',
        media_url: '',
        media_type: 'text',
        metadata: {
          category: '',
          difficulty: 'easy',
          duration: ''
        }
      });
    }
    setErrors({});
  };

  const getLocationSuggestions = () => {
    const category = formData.metadata.category;
    switch (category) {
      case 'kitchen':
        return ['Kitchen Counter', 'Under Sink', 'Kitchen Island', 'Near Stove', 'Kitchen Cabinet'];
      case 'bathroom':
        return ['Bathroom Vanity', 'Shower Area', 'Bathroom Cabinet', 'Near Toilet', 'Bathroom Closet'];
      case 'bedroom':
        return ['Bedside Table', 'Bedroom Closet', 'Dresser', 'Under Bed', 'Bedroom Wall'];
      case 'living':
        return ['Coffee Table', 'TV Stand', 'Sofa Side', 'Living Room Cabinet', 'Entertainment Center'];
      case 'hvac':
        return ['Thermostat Wall', 'Utility Room', 'Basement', 'Attic Access', 'HVAC Closet'];
      default:
        return ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Utility Room', 'Basement', 'Garage'];
    }
  };

  return (
    <div className="item-form">
      <div className="form-header">
        <h2 className="form-title">
          {mode === 'edit' ? 'Edit Item' : 'Create New Item'}
        </h2>
        <p className="form-subtitle">
          {mode === 'edit' 
            ? 'Update your item information and instructions below.'
            : 'Add a new item to generate QR codes and manage instructions for guests.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
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
              placeholder="e.g. Coffee Machine, TV Remote, WiFi Router"
              className={`form-input ${errors.name ? 'error' : ''}`}
              disabled={isSubmitting || loading}
            />
            {errors.name && (
              <span className="form-error">{errors.name}</span>
            )}
          </div>

            <div className="form-group">
              <label htmlFor="property_id" className="required">Property</label>
              <select
                id="property_id"
                name="property_id"
                value={formData.property_id}
                onChange={handleSelectChange}
                className={errors.property_id ? 'error' : ''}
                required
              >
                <option value="">Select property...</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
              {errors.property_id && <div className="error-message">{errors.property_id}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? 'error' : ''}
              placeholder="Enter item description..."
              rows={4}
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="metadata.category">Category</label>
              <select
                id="metadata.category"
                name="metadata.category"
                value={formData.metadata.category}
                onChange={handleSelectChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select category...</option>
                {itemCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && <div className="error-message">{errors.category}</div>}
            </div>
            
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
                placeholder="Where is this item located?"
                className="form-input"
                disabled={isSubmitting || loading}
                list="location-suggestions"
              />
              <datalist id="location-suggestions">
                {getLocationSuggestions().map((suggestion, index) => (
                  <option key={index} value={suggestion} />
                ))}
              </datalist>
              {errors.location && (
                <span className="form-error">{errors.location}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Instructions & Media</h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="media_type" className="form-label">
                  Media Type
                </label>
                <select
                  id="media_type"
                  name="media_type"
                  value={formData.media_type}
                  onChange={handleSelectChange}
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
                <label htmlFor="metadata.difficulty" className="form-label">
                  Difficulty Level
                </label>
                <select
                  id="metadata.difficulty"
                  name="metadata.difficulty"
                  value={formData.metadata.difficulty}
                  onChange={handleSelectChange}
                  className="form-select"
                  disabled={isSubmitting || loading}
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="media_url" className="form-label">
                  Media URL
                  {formData.media_type !== 'text' && <span className="optional"> (Optional)</span>}
                </label>
                <input
                  type="url"
                  id="media_url"
                  name="media_url"
                  value={formData.media_url}
                  onChange={handleInputChange}
                  placeholder={
                    formData.media_type === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                    formData.media_type === 'image' ? 'https://example.com/image.jpg' :
                    formData.media_type === 'pdf' ? 'https://example.com/guide.pdf' :
                    'URL to instructions (optional)'
                  }
                  className={`form-input ${errors.media_url ? 'error' : ''}`}
                  disabled={isSubmitting || loading}
                />
                {errors.media_url && (
                  <span className="form-error">{errors.media_url}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="metadata.duration" className="form-label">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  id="metadata.duration"
                  name="metadata.duration"
                  value={formData.metadata.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 2 minutes, 30 seconds"
                  className="form-input"
                  disabled={isSubmitting || loading}
                />
                {errors.duration && (
                  <span className="form-error">{errors.duration}</span>
                )}
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="form-error-banner">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="btn-reset"
              disabled={isSubmitting}
            >
              Reset
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 
                (mode === 'edit' ? 'Updating...' : 'Creating...') : 
                (mode === 'edit' ? 'Update Item' : 'Create Item')
              }
            </button>
          </div>
      </form>

      <style jsx>{`
        .item-form {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .form-header {
          margin-bottom: 2rem;
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
          line-height: 1.5;
        }

        .form {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .form-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #f3f4f6;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 500;
          color: #1f2937;
          margin: 0 0 1.5rem 0;
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

        .optional {
          color: #9ca3af;
          font-weight: 400;
        }

        .form-input,
        .form-select,
        select,
        .form-textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          background-color: white;
          color: #374151;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        .form-input:focus,
        .form-select:focus,
        select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input.error,
        .form-select.error,
        select.error,
        .form-textarea.error {
          border-color: #ef4444;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-error {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .form-error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #f3f4f6;
        }

        .btn-primary,
        .btn-secondary,
        .btn-reset {
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .btn-reset {
          background: #f59e0b;
          color: white;
        }

        .btn-reset:hover:not(:disabled) {
          background: #d97706;
        }

        .btn-primary:disabled,
        .btn-secondary:disabled,
        .btn-reset:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
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

          .btn-primary,
          .btn-secondary,
          .btn-reset {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemForm; 