/**
 * Item Management API Routes
 * QR Code-Based Instructional System - RESTful Item Endpoints
 */

const express = require('express');
const router = express.Router();
const ItemController = require('../../controllers/ItemController');
const authMiddleware = require('../../middleware/auth');

// Apply authentication middleware to all item routes
router.use(authMiddleware.authenticateDemo);

/**
 * @route   POST /api/items
 * @desc    Create a new item for a property
 * @access  Private (Demo User, Property Owner only)
 */
router.post('/', ItemController.createItem);

/**
 * @route   GET /api/items?propertyId=:propertyId
 * @desc    List all items for a specific property
 * @access  Private (Demo User, Property Owner only)
 */
router.get('/', ItemController.listItems);

/**
 * @route   GET /api/items/:id
 * @desc    Get a single item by ID
 * @access  Private (Demo User, Property Owner only)
 */
router.get('/:id', ItemController.getItem);

/**
 * @route   PUT /api/items/:id
 * @desc    Update an item
 * @access  Private (Demo User, Property Owner only)
 */
router.put('/:id', ItemController.updateItem);

/**
 * @route   PUT /api/items/:id/location
 * @desc    Update item location
 * @access  Private (Demo User, Property Owner only)
 */
router.put('/:id/location', ItemController.updateItemLocation);

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete an item
 * @access  Private (Demo User, Property Owner only)
 */
router.delete('/:id', ItemController.deleteItem);

module.exports = router; 