/**
 * QR Code API Routes
 * QR Code-Based Instructional System - QR Code REST API Endpoints
 */

const express = require('express');
const QRController = require('../../controllers/QRController');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all QR code routes
router.use(authMiddleware.authenticateDemo);

/**
 * @route   POST /api/qrcodes
 * @desc    Generate QR code for an item
 * @body    { itemId: string, options?: { width?: number, errorCorrectionLevel?: string } }
 * @access  Private (Demo User)
 */
router.post('/', QRController.generateQRCode);

/**
 * @route   POST /api/qrcodes/batch
 * @desc    Generate QR codes for multiple items
 * @body    { itemIds: string[], options?: { width?: number, errorCorrectionLevel?: string } }
 * @access  Private (Demo User)
 */
router.post('/batch', QRController.batchGenerateQRCodes);

/**
 * @route   GET /api/qrcodes/:qrId/mapping
 * @desc    Get item data by QR code ID (for content display)
 * @params  qrId - QR code UUID
 * @access  Private (Demo User)
 */
router.get('/:qrId/mapping', QRController.getQRMapping);

/**
 * @route   GET /api/qrcodes
 * @desc    List QR codes for an item
 * @query   itemId - Item UUID (required)
 * @access  Private (Demo User)
 */
router.get('/', QRController.listQRCodes);

/**
 * @route   GET /api/qrcodes/statistics
 * @desc    Get QR code statistics
 * @query   itemId - Item UUID (optional), propertyId - Property UUID (optional)
 * @access  Private (Demo User)
 */
router.get('/statistics', QRController.getQRStatistics);

/**
 * @route   GET /api/qrcodes/:qrId/download
 * @desc    Download QR code image file
 * @params  qrId - QR code UUID
 * @query   size - Image size in pixels (default: 256), format - Image format (default: png)
 * @access  Private (Demo User)
 */
router.get('/:qrId/download', QRController.downloadQRCode);

/**
 * @route   PUT /api/qrcodes/:qrId/status
 * @desc    Update QR code status (active/inactive)
 * @params  qrId - QR code UUID
 * @body    { status: 'active' | 'inactive' }
 * @access  Private (Demo User)
 */
router.put('/:qrId/status', QRController.updateQRStatus);

/**
 * @route   DELETE /api/qrcodes/:qrId
 * @desc    Delete QR code mapping
 * @params  qrId - QR code UUID
 * @access  Private (Demo User)
 */
router.delete('/:qrId', QRController.deleteQRCode);

// Error handling middleware for QR code routes
router.use((error, req, res, next) => {
  console.error('QR Code API Error:', error);
  
  // Handle specific error types
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'QR code generation payload too large'
    });
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'QR code validation failed',
      details: error.message
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal server error in QR code API',
    message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
  });
});

module.exports = router; 