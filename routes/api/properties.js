/**
 * Property Management API Routes
 * QR Code-Based Instructional System - RESTful Property Endpoints
 */

const express = require('express');
const router = express.Router();
const PropertyController = require('../../controllers/PropertyController');
const authMiddleware = require('../../middleware/auth');

// Apply authentication middleware to all property routes
router.use(authMiddleware.authenticateDemo);

/**
 * @route   POST /api/properties
 * @desc    Create a new property
 * @access  Private (Demo User)
 */
router.post('/', PropertyController.createProperty);

/**
 * @route   GET /api/properties
 * @desc    List all properties for the authenticated user
 * @access  Private (Demo User)
 */
router.get('/', PropertyController.listProperties);

/**
 * @route   GET /api/properties/:id
 * @desc    Get a single property by ID
 * @access  Private (Demo User, Owner only)
 */
router.get('/:id', PropertyController.getProperty);

/**
 * @route   PUT /api/properties/:id
 * @desc    Update an existing property
 * @access  Private (Demo User, Owner only)
 */
router.put('/:id', PropertyController.updateProperty);

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete a property
 * @access  Private (Demo User, Owner only)
 */
router.delete('/:id', PropertyController.deleteProperty);

module.exports = router; 