/**
 * QR Code Service
 * QR Code-Based Instructional System - QR Code Generation and Management
 */

const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

class QRService {
  /**
   * Generate a unique QR code identifier
   * @returns {string} Unique UUID for QR code
   */
  static generateUniqueCode() {
    return uuidv4();
  }

  /**
   * Create QR code image for an item
   * @param {string} itemId - Item UUID
   * @param {object} options - QR generation options
   * @returns {Promise<object>} QR code data and image
   */
  static async createQRCode(itemId, options = {}) {
    try {
      // Generate unique QR identifier
      const qrId = this.generateUniqueCode();
      
      // Create content URL
      const contentUrl = this.getQRCodeURL(qrId);
      
      // QR code generation options
      const qrOptions = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        width: options.width || 256,
        color: {
          dark: '#000000FF',
          light: '#FFFFFFFF'
        },
        ...options
      };

      // Generate QR code as data URL
      const qrCodeDataURL = await QRCode.toDataURL(contentUrl, qrOptions);
      
      // Generate QR code as buffer for file storage
      const qrCodeBuffer = await QRCode.toBuffer(contentUrl, qrOptions);

      return {
        qrId,
        itemId,
        contentUrl,
        qrCodeDataURL,
        qrCodeBuffer,
        options: qrOptions,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code: ' + error.message);
    }
  }

  /**
   * Validate QR code format
   * @param {string} qrData - QR code data to validate
   * @returns {boolean} True if valid format
   */
  static validateQRFormat(qrData) {
    try {
      // Check if it's a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(qrData);
    } catch (error) {
      console.error('Error validating QR format:', error);
      return false;
    }
  }

  /**
   * Generate content page URL for QR code
   * @param {string} qrId - QR code identifier
   * @returns {string} Content page URL
   */
  static getQRCodeURL(qrId) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    return `${baseUrl}/content/${qrId}`;
  }

  /**
   * Generate QR code for download (high resolution)
   * @param {string} itemId - Item UUID
   * @param {object} options - Download options
   * @returns {Promise<object>} High-resolution QR code data
   */
  static async createDownloadableQRCode(itemId, options = {}) {
    try {
      const downloadOptions = {
        width: options.width || 512,
        margin: options.margin || 2,
        errorCorrectionLevel: 'H', // High error correction for printing
        ...options
      };

      return await this.createQRCode(itemId, downloadOptions);
    } catch (error) {
      console.error('Error generating downloadable QR code:', error);
      throw new Error('Failed to generate downloadable QR code: ' + error.message);
    }
  }

  /**
   * Create batch QR codes for multiple items
   * @param {Array<string>} itemIds - Array of item UUIDs
   * @param {object} options - QR generation options
   * @returns {Promise<Array<object>>} Array of QR code data
   */
  static async createBatchQRCodes(itemIds, options = {}) {
    try {
      const qrCodes = [];
      
      for (const itemId of itemIds) {
        const qrCode = await this.createQRCode(itemId, options);
        qrCodes.push(qrCode);
      }

      return qrCodes;
    } catch (error) {
      console.error('Error generating batch QR codes:', error);
      throw new Error('Failed to generate batch QR codes: ' + error.message);
    }
  }

  /**
   * Validate content URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid content URL
   */
  static validateContentURL(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      // Expected format: /content/{qrId}
      return pathParts.length === 3 && 
             pathParts[1] === 'content' && 
             this.validateQRFormat(pathParts[2]);
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract QR ID from content URL
   * @param {string} url - Content URL
   * @returns {string|null} QR ID or null if invalid
   */
  static extractQRIdFromURL(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      if (pathParts.length === 3 && pathParts[1] === 'content') {
        const qrId = pathParts[2];
        return this.validateQRFormat(qrId) ? qrId : null;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = QRService; 