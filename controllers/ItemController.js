/**
 * Item Controller - Business Logic Layer
 * QR Code-Based Instructional System - Item Management Controllers
 */

const ItemDAO = require('../dao/ItemDAO');
const PropertyDAO = require('../dao/PropertyDAO');
const Joi = require('joi');

// Validation schemas
const itemCreationSchema = Joi.object({
  property_id: Joi.string().uuid().required(),
  name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().trim().allow('').max(1000).optional(),
  location: Joi.string().trim().allow('').max(255).optional(),
  media_url: Joi.string().uri().allow('').optional(),
  media_type: Joi.string().valid('youtube', 'image', 'pdf', 'text', 'other').default('text'),
  metadata: Joi.object().default({})
});

const itemUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional(),
  description: Joi.string().trim().allow('').max(1000).optional(),
  location: Joi.string().trim().allow('').max(255).optional(),
  media_url: Joi.string().uri().allow('').optional(),
  media_type: Joi.string().valid('youtube', 'image', 'pdf', 'text', 'other').optional(),
  metadata: Joi.object().optional()
}).min(1);

const locationUpdateSchema = Joi.object({
  location: Joi.string().trim().allow('').max(255).required()
});

/**
 * Create a new item
 */
const createItem = async (req, res) => {
  try {
    const { error, value } = itemCreationSchema.validate(req.body);
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

    // Verify property ownership
    const propertyResult = await PropertyDAO.getPropertyById(value.property_id);
    if (!propertyResult.success) {
      if (propertyResult.error === 'Property not found') {
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

    if (propertyResult.property.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to add items to this property'
      });
    }

    const result = await ItemDAO.createItem(value.property_id, value);

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: { 
          item: result.item,
          property_info: result.property_info
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
 * List items for a property or all items for the authenticated user
 */
const listItems = async (req, res) => {
  try {
    const userId = req.getUserId();
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: 'User ID not found in request'
      });
    }

    const propertyId = req.query.propertyId;
    
    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'propertyId query parameter is required'
      });
    }

    // Verify property ownership
    const propertyResult = await PropertyDAO.getPropertyById(propertyId);
    if (!propertyResult.success) {
      if (propertyResult.error === 'Property not found') {
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

    if (propertyResult.property.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to view items for this property'
      });
    }

    const result = await ItemDAO.getItemsByPropertyId(propertyId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Found ${result.count} items for property`,
        data: {
          items: result.items,
          count: result.count,
          property_id: result.property_id,
          property_name: propertyResult.property.name
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
 * Get a single item by ID
 */
const getItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    if (!itemId) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Item ID is required'
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

    const result = await ItemDAO.getItemById(itemId);

    if (result.success) {
      // Verify property ownership through the item's property
      const propertyResult = await PropertyDAO.getPropertyById(result.item.property_id);
      if (!propertyResult.success) {
        return res.status(500).json({
          success: false,
          error: 'Database Error',
          message: 'Failed to verify item ownership'
        });
      }

      if (propertyResult.property.user_id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'You do not have permission to access this item'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Item retrieved successfully',
        data: { 
          item: result.item,
          property_name: propertyResult.property.name
        }
      });
    } else {
      if (result.error === 'Item not found') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Item not found'
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
 * Update item location
 */
const updateItemLocation = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    if (!itemId) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Item ID is required'
      });
    }

    const { error, value } = locationUpdateSchema.validate(req.body);
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

    // Verify item exists and user has permission
    const itemResult = await ItemDAO.getItemById(itemId);
    if (!itemResult.success) {
      if (itemResult.error === 'Item not found') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Item not found'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: 'Failed to verify item ownership'
      });
    }

    // Verify property ownership
    const propertyResult = await PropertyDAO.getPropertyById(itemResult.item.property_id);
    if (!propertyResult.success || propertyResult.property.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to update this item'
      });
    }

    const result = await ItemDAO.updateItemLocation(itemId, value.location);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Item location updated successfully',
        data: { 
          item: result.item,
          previous_location: result.previous_location,
          new_location: result.new_location
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
 * Delete an item
 */
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    if (!itemId) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Item ID is required'
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

    // Verify item exists and user has permission
    const itemResult = await ItemDAO.getItemById(itemId);
    if (!itemResult.success) {
      if (itemResult.error === 'Item not found') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Item not found'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: 'Failed to verify item ownership'
      });
    }

    // Verify property ownership
    const propertyResult = await PropertyDAO.getPropertyById(itemResult.item.property_id);
    if (!propertyResult.success || propertyResult.property.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to delete this item'
      });
    }

    const result = await ItemDAO.deleteItem(itemId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
        data: {
          deleted_item: result.item,
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
  createItem,
  listItems,
  getItem,
  updateItemLocation,
  deleteItem
}; 