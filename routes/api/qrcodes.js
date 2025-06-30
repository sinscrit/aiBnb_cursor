/**
 * QR Code API Routes
 * QR Code-Based Instructional System - QR Code REST API Endpoints
 */

const express = require('express');
const router = express.Router();
const QRController = require('../../controllers/QRController');
const authMiddleware = require('../../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware.authenticateDemo);

/**
 * @route   POST /api/qrcodes
 * @desc    Generate QR code for an item
 * @access  Demo User
 * @body    { itemId: string, options?: object }
 */
router.post('/', QRController.generateQRCode);

/**
 * @route   POST /api/qrcodes/batch
 * @desc    Generate QR codes for multiple items
 * @access  Demo User
 * @body    { itemIds: string[], options?: object }
 */
router.post('/batch', QRController.generateBatchQRCodes);

/**
 * @route   GET /api/qrcodes/stats
 * @desc    Get QR code statistics for demo user
 * @access  Demo User
 */
router.get('/stats', QRController.getQRStats);

/**
 * @route   GET /api/qrcodes/:qrId/mapping
 * @desc    Get item data by QR code (for content display)
 * @access  Public (no auth required for content access)
 * @params  qrId: QR code identifier
 */
router.get('/:qrId/mapping', (req, res, next) => {
  // Skip auth for content access - guests need to access content
  QRController.getQRMapping(req, res);
});

/**
 * @route   GET /api/qrcodes/:qrId/download
 * @desc    Download QR code image
 * @access  Demo User
 * @params  qrId: QR code identifier
 * @query   size?: number, format?: string
 */
router.get('/:qrId/download', QRController.downloadQRCode);

/**
 * @route   GET /api/qrcodes
 * @desc    List QR codes for item or property
 * @access  Demo User
 * @query   itemId?: string OR propertyId?: string
 */
router.get('/', QRController.listQRCodes);

/**
 * @route   PUT /api/qrcodes/:qrId/status
 * @desc    Update QR code status
 * @access  Demo User
 * @params  qrId: QR code identifier
 * @body    { status: 'active' | 'inactive' | 'expired' }
 */
router.put('/:qrId/status', QRController.updateQRStatus);

/**
 * @route   DELETE /api/qrcodes/:qrId
 * @desc    Delete QR code
 * @access  Demo User
 * @params  qrId: QR code identifier
 */
router.delete('/:qrId', QRController.deleteQRCode);

module.exports = router; 