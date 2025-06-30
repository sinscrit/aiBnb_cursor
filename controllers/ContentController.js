const QRCodeDAO = require('../dao/QRCodeDAO');
const ItemDAO = require('../dao/ItemDAO');
const PropertyDAO = require('../dao/PropertyDAO');

/**
 * ContentController - Handles content display functionality
 * Serves dynamic content pages for QR codes with item information
 */
class ContentController {
  
  /**
   * Get content by QR code for display page
   * GET /api/content/:qrCode
   */
  async getContentByQRCode(req, res) {
    try {
      const { qrCode } = req.params;

      if (!qrCode || qrCode.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'QR code parameter is required',
          code: 'MISSING_QR_CODE'
        });
      }

      // Get QR mapping to find the associated item
      const qrMappingResult = await QRCodeDAO.getQRMappingByQRId(qrCode);
      
      if (!qrMappingResult.success || !qrMappingResult.data) {
        return res.status(404).json({
          success: false,
          error: 'QR code not found or invalid',
          code: 'QR_NOT_FOUND',
          qr_code: qrCode
        });
      }

      const { qr_code, item, property } = qrMappingResult.data;

      // Check if QR code is active
      if (qr_code.status !== 'active') {
        return res.status(410).json({
          success: false,
          error: 'QR code is not active',
          code: 'QR_INACTIVE',
          qr_code: qrCode,
          status: qr_code.status
        });
      }

      // Validate that item and property data were retrieved
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Item not found for this QR code',
          code: 'ITEM_NOT_FOUND',
          qr_code: qrCode
        });
      }

      if (!property) {
        return res.status(404).json({
          success: false,
          error: 'Property not found for this item',
          code: 'PROPERTY_NOT_FOUND',
          qr_code: qrCode
        });
      }

      // Note: scan count already incremented by getQRMappingByQRId method

      // Build content response
      const contentData = {
        qr_code: qrCode,
        scan_count: qrMappingResult.data.scan_count, // Use the already incremented count
        item: {
          id: item.id,
          name: item.name,
          description: item.description,
          location: item.location,
          media_url: item.media_url,
          media_type: item.media_type,
          metadata: item.metadata
        },
        property: {
          id: property.id,
          name: property.name,
          description: property.description,
          address: property.address,
          property_type: property.property_type,
          settings: property.settings
        },
        content_meta: {
          title: `${item.name} - ${property.name}`,
          description: item.description,
          keywords: [item.name, property.name, item.location, item.metadata?.category].filter(Boolean),
          canonical_url: `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/content/${qrCode}`
        }
      };

      res.json({
        success: true,
        message: 'Content retrieved successfully',
        data: contentData
      });

    } catch (error) {
      console.error('Error in getContentByQRCode:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while retrieving content',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Get content metadata for SEO/preview purposes
   * GET /api/content/:qrCode/meta
   */
  async getContentMeta(req, res) {
    try {
      const { qrCode } = req.params;

      if (!qrCode || qrCode.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'QR code parameter is required'
        });
      }

      // Get QR mapping
      const qrMappingResult = await QRCodeDAO.getQRMappingByQRId(qrCode);
      
      if (!qrMappingResult.success || !qrMappingResult.data || qrMappingResult.data.qr_code.status !== 'active') {
        return res.status(404).json({
          success: false,
          error: 'QR code not found or inactive'
        });
      }

      const { qr_code, item, property } = qrMappingResult.data;

      if (!item || !property) {
        return res.status(404).json({
          success: false,
          error: 'Content not found'
        });
      }

      const metadata = {
        title: `${item.name} - ${property.name}`,
        description: item.description,
        keywords: [item.name, property.name, item.location, item.metadata?.category].filter(Boolean).join(', '),
        canonical_url: `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/content/${qrCode}`,
        og_image: item.media_type === 'image' ? item.media_url : null,
        item_type: item.metadata?.category || 'instruction',
        property_type: property.property_type,
        location: item.location
      };

      res.json({
        success: true,
        data: metadata
      });

    } catch (error) {
      console.error('Error in getContentMeta:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while retrieving metadata'
      });
    }
  }

  /**
   * Record content view/interaction for analytics
   * POST /api/content/:qrCode/view
   */
  async recordContentView(req, res) {
    try {
      const { qrCode } = req.params;
      const { 
        view_duration, 
        user_agent, 
        referrer, 
        viewport_size 
      } = req.body;

      if (!qrCode || qrCode.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'QR code parameter is required'
        });
      }

      // Verify QR code exists and is active
      const qrMappingResult = await QRCodeDAO.getQRMappingByQRId(qrCode);
      
      if (!qrMappingResult.success || !qrMappingResult.data || qrMappingResult.data.qr_code.status !== 'active') {
        return res.status(404).json({
          success: false,
          error: 'QR code not found or inactive'
        });
      }

      // Record analytics (for future implementation)
      // This could be expanded to store in a separate analytics table
      const analyticsData = {
        qr_code: qrCode,
        item_id: qrMappingResult.data.item.id,
        view_duration: view_duration || 0,
        user_agent: user_agent || 'unknown',
        referrer: referrer || 'direct',
        viewport_size: viewport_size || 'unknown',
        timestamp: new Date().toISOString()
      };

      // Note: scan count already incremented by getQRMappingByQRId method

      res.json({
        success: true,
        message: 'Content view recorded successfully',
        data: {
          qr_code: qrCode,
          recorded_at: analyticsData.timestamp
        }
      });

    } catch (error) {
      console.error('Error in recordContentView:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while recording view'
      });
    }
  }

  /**
   * Get content statistics for a QR code
   * GET /api/content/:qrCode/stats
   */
  async getContentStats(req, res) {
    try {
      const { qrCode } = req.params;

      if (!qrCode || qrCode.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'QR code parameter is required'
        });
      }

      // Get QR mapping with stats
      const qrMappingResult = await QRCodeDAO.getQRMappingByQRId(qrCode);
      
      if (!qrMappingResult.success || !qrMappingResult.data) {
        return res.status(404).json({
          success: false,
          error: 'QR code not found'
        });
      }

      const qrCodeData = qrMappingResult.data.qr_code;
      const stats = {
        qr_code: qrCode,
        status: qrCodeData.status,
        scan_count: qrCodeData.scan_count || 0,
        created_at: qrCodeData.created_at,
        last_scanned: qrCodeData.last_scanned,
        is_active: qrCodeData.status === 'active'
      };

      res.json({
        success: true,
        message: 'Content statistics retrieved successfully',
        data: stats
      });

    } catch (error) {
      console.error('Error in getContentStats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while retrieving statistics'
      });
    }
  }
}

module.exports = new ContentController(); 