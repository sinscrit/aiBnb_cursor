/**
 * QR Code Service - QR Code Generation and Management
 * QR Code-Based Instructional System - QR Generation Service Layer
 */

const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique UUID for QR codes
 * @returns {string} Unique QR code identifier
 */
const generateUniqueCode = () => {
  return uuidv4();
};

/**
 * Generate QR code image for an item
 * @param {string} itemId - Item UUID to generate QR code for
 * @param {Object} options - QR code generation options
 * @returns {Promise<Object>} Result with QR code data or error
 */
const createQRCode = async (itemId, options = {}) => {
  try {
    if (!itemId) {
      return {
        success: false,
        error: 'Item ID is required for QR code generation'
      };
    }

    // Generate unique QR identifier
    const qrId = generateUniqueCode();

    // Create content URL that the QR code will point to
    const contentUrl = getQRCodeURL(qrId);

    // Configure QR code generation options
    const qrOptions = {
      errorCorrectionLevel: options.errorCorrectionLevel || 'M', // Medium error correction
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: options.darkColor || '#000000',   // QR code color
        light: options.lightColor || '#FFFFFF'  // Background color
      },
      width: options.width || 256,  // Default size 256x256
      ...options
    };

    // Generate QR code as data URL (base64 encoded PNG)
    const qrCodeDataURL = await QRCode.toDataURL(contentUrl, qrOptions);

    // Generate QR code as buffer for file download
    const qrCodeBuffer = await QRCode.toBuffer(contentUrl, qrOptions);

    return {
      success: true,
      qr_id: qrId,
      item_id: itemId,
      content_url: contentUrl,
      qr_code_data_url: qrCodeDataURL,  // For display in browser
      qr_code_buffer: qrCodeBuffer,     // For file download
      generation_options: qrOptions,
      size: `${qrOptions.width}x${qrOptions.width}`,
      format: 'PNG'
    };

  } catch (error) {
    return {
      success: false,
      error: `QR code generation failed: ${error.message}`
    };
  }
};

/**
 * Validate QR code format and data
 * @param {string} qrData - QR code data to validate
 * @returns {Object} Validation result
 */
const validateQRFormat = (qrData) => {
  try {
    if (!qrData || typeof qrData !== 'string') {
      return {
        isValid: false,
        error: 'QR data must be a non-empty string'
      };
    }

    // Check if it's a valid URL format for our content pages
    const urlPattern = /^https?:\/\/[^\/]+\/content\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    
    if (!urlPattern.test(qrData)) {
      return {
        isValid: false,
        error: 'QR data does not match expected content URL format'
      };
    }

    // Extract QR ID from URL
    const qrIdMatch = qrData.match(/\/content\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i);
    if (!qrIdMatch) {
      return {
        isValid: false,
        error: 'Could not extract QR ID from URL'
      };
    }

    return {
      isValid: true,
      qr_id: qrIdMatch[1],
      content_url: qrData,
      message: 'QR code format is valid'
    };

  } catch (error) {
    return {
      isValid: false,
      error: `QR validation failed: ${error.message}`
    };
  }
};

/**
 * Generate content page URL for a QR code
 * @param {string} qrId - QR code identifier
 * @returns {string} Full URL to content page
 */
const getQRCodeURL = (qrId) => {
  // Use environment variables for base URL or default to localhost
  const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/content/${qrId}`;
};

/**
 * Extract QR ID from content URL
 * @param {string} contentUrl - Full content URL
 * @returns {string|null} QR ID or null if invalid
 */
const extractQRIdFromURL = (contentUrl) => {
  try {
    const validation = validateQRFormat(contentUrl);
    return validation.isValid ? validation.qr_id : null;
  } catch (error) {
    return null;
  }
};

/**
 * Generate QR code file name for downloads
 * @param {string} qrId - QR code identifier
 * @param {string} itemName - Item name for descriptive filename
 * @returns {string} Filename for QR code download
 */
const generateQRFileName = (qrId, itemName = 'item') => {
  // Sanitize item name for filename
  const sanitizedName = itemName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 20); // Limit length

  const shortQrId = qrId.substring(0, 8); // First 8 characters of UUID
  return `qr_${sanitizedName}_${shortQrId}.png`;
};

/**
 * Get QR code generation statistics
 * @param {Array} qrCodes - Array of QR code objects
 * @returns {Object} Statistics about QR codes
 */
const getQRStatistics = (qrCodes) => {
  if (!Array.isArray(qrCodes)) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      scan_count: 0
    };
  }

  const stats = qrCodes.reduce((acc, qr) => {
    acc.total++;
    if (qr.status === 'active') acc.active++;
    else acc.inactive++;
    acc.scan_count += qr.scan_count || 0;
    return acc;
  }, {
    total: 0,
    active: 0,
    inactive: 0,
    scan_count: 0
  });

  return {
    ...stats,
    activity_rate: stats.total > 0 ? (stats.active / stats.total * 100).toFixed(1) : '0.0'
  };
};

module.exports = {
  generateUniqueCode,
  createQRCode,
  validateQRFormat,
  getQRCodeURL,
  extractQRIdFromURL,
  generateQRFileName,
  getQRStatistics
}; 