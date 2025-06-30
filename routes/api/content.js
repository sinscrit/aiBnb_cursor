const express = require('express');
const router = express.Router();
const ContentController = require('../../controllers/ContentController');
const authMiddleware = require('../../middleware/auth');

/**
 * Content API Routes
 * Handles content display functionality for QR codes
 */

/**
 * @route   GET /api/content/:qrCode
 * @desc    Get content data by QR code for display page
 * @access  Public (no authentication required for content viewing)
 * @param   {string} qrCode - The QR code identifier
 */
router.get('/:qrCode', ContentController.getContentByQRCode);

/**
 * @route   GET /api/content/:qrCode/meta
 * @desc    Get content metadata for SEO/preview purposes
 * @access  Public
 * @param   {string} qrCode - The QR code identifier
 */
router.get('/:qrCode/meta', ContentController.getContentMeta);

/**
 * @route   POST /api/content/:qrCode/view
 * @desc    Record content view/interaction for analytics
 * @access  Public
 * @param   {string} qrCode - The QR code identifier
 * @body    {number} view_duration - Time spent viewing content
 * @body    {string} user_agent - Browser user agent
 * @body    {string} referrer - Referrer URL
 * @body    {string} viewport_size - Browser viewport dimensions
 */
router.post('/:qrCode/view', ContentController.recordContentView);

/**
 * @route   GET /api/content/:qrCode/stats
 * @desc    Get content statistics for a QR code (admin access)
 * @access  Private (demo user authentication required)
 * @param   {string} qrCode - The QR code identifier
 */
router.get('/:qrCode/stats', authMiddleware.authenticateDemo, ContentController.getContentStats);

module.exports = router; 