/**
 * Property Controller - Business Logic Layer
 * QR Code-Based Instructional System - Property Management Controllers
 */

const PropertyDAO = require('../dao/PropertyDAO');
const Joi = require('joi');

// Validation schemas
const propertyCreationSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().trim().allow('').max(1000).optional(),
  address: Joi.string().trim().allow('').max(500).optional(),
  property_type: Joi.string().valid('apartment', 'house', 'condo', 'studio', 'other').default('other'),
  settings: Joi.object().default({})
});

const propertyUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional(),
  description: Joi.string().trim().allow('').max(1000).optional(),
  address: Joi.string().trim().allow('').max(500).optional(),
  property_type: Joi.string().valid('apartment', 'house', 'condo', 'studio', 'other').optional(),
  settings: Joi.object().optional()
}).min(1);

/**
 * Create a new property
 */
const createProperty = async (req, res) => {
  try {
    const { error, value } = propertyCreationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    const userId = req.getUserId();
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'User ID not found in request'
      });
    }

    const result = await PropertyDAO.createProperty(userId, value);

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: 'Property created successfully',
        data: { property: result.property }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: result.error
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

/**
 * List all properties for the authenticated user
 */
const listProperties = async (req, res) => {
  try {
    const userId = req.getUserId();
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'User ID not found in request'
      });
    }

    const result = await PropertyDAO.getPropertiesByUserId(userId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Found ${result.count} properties`,
        data: {
          properties: result.properties,
          count: result.count
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: result.error
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

/**
 * Get a single property by ID
 */
const getProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    
    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Property ID is required'
      });
    }

    const userId = req.getUserId();
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'User ID not found in request'
      });
    }

    const result = await PropertyDAO.getPropertyById(propertyId);

    if (result.success) {
      // Verify ownership
      if (result.property.user_id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'You do not have permission to access this property'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Property retrieved successfully',
        data: { property: result.property }
      });
    } else {
      if (result.error === 'Property not found') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Property not found'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: result.error
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

/**
 * Update an existing property
 */
const updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    
    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Property ID is required'
      });
    }

    const { error, value } = propertyUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    const userId = req.getUserId();
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'User ID not found in request'
      });
    }

    // Verify ownership
    const existingProperty = await PropertyDAO.getPropertyById(propertyId);
    if (!existingProperty.success) {
      if (existingProperty.error === 'Property not found') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Property not found'
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: 'Failed to verify property ownership'
      });
    }

    if (existingProperty.property.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to update this property'
      });
    }

    const result = await PropertyDAO.updateProperty(propertyId, value);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Property updated successfully',
        data: { property: result.property }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: result.error
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

/**
 * Delete a property
 */
const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    
    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Property ID is required'
      });
    }

    const userId = req.getUserId();
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'User ID not found in request'
      });
    }

    // Verify ownership
    const existingProperty = await PropertyDAO.getPropertyById(propertyId);
    if (!existingProperty.success) {
      if (existingProperty.error === 'Property not found') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Property not found'
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: 'Failed to verify property ownership'
      });
    }

    if (existingProperty.property.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to delete this property'
      });
    }

    const result = await PropertyDAO.deleteProperty(propertyId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Property deleted successfully',
        data: {
          deleted_property: {
            id: result.property.id,
            name: result.property.name
          },
          cascade_info: result.cascade_info
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: result.error
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

module.exports = {
  createProperty,
  listProperties,
  getProperty,
  updateProperty,
  deleteProperty
}; 