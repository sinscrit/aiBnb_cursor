/**
 * QR Code Controller
 * QR Code-Based Instructional System - QR Code Business Logic Layer
 */

const QRService = require('../services/QRService');
const QRCodeDAO = require('../dao/QRCodeDAO');
const ItemDAO = require('../dao/ItemDAO');
const Joi = require('joi');

class QRController {
  /**
   * Generate QR code for an item
   * POST /api/qrcodes
   */
  async generateQRCode(req, res) {
    try {
      // Validate request body
      const schema = Joi.object({
        itemId: Joi.string().uuid().required(),
        options: Joi.object({
          width: Joi.number().min(128).max(1024).optional(),
          margin: Joi.number().min(0).max(5).optional(),
          errorCorrectionLevel: Joi.string().valid('L', 'M', 'Q', 'H').optional()
        }).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const { itemId, options = {} } = value;

      // Verify item exists and belongs to demo user
      const itemResult = await ItemDAO.getItemById(itemId);
      if (!itemResult.success) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      const item = itemResult.item;

      // Generate QR code using QRService
      const qrCodeData = await QRService.createQRCode(itemId, options);

      // Save QR mapping to database
      const qrMapping = await QRCodeDAO.createQRMapping(
        itemId, 
        qrCodeData.qrId,
        {
          contentUrl: qrCodeData.contentUrl,
          generationOptions: qrCodeData.options
        }
      );

      res.status(201).json({
        success: true,
        message: 'QR code generated successfully',
        data: {
          qrCode: {
            id: qrMapping.id,
            qrId: qrCodeData.qrId,
            itemId: itemId,
            contentUrl: qrCodeData.contentUrl,
            qrCodeDataURL: qrCodeData.qrCodeDataURL,
            status: qrMapping.status,
            scanCount: qrMapping.scan_count,
            createdAt: qrMapping.created_at
          }
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate QR code',
        error: error.message
      });
    }
  }

  /**
   * Get item data by QR code (for content display)
   * GET /api/qrcodes/:qrId/mapping
   */
  async getQRMapping(req, res) {
    try {
      const { qrId } = req.params;

      // Validate QR ID format
      if (!QRService.validateQRFormat(qrId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid QR code format'
        });
      }

      // Get QR mapping with item and property data
      const qrMapping = await QRCodeDAO.getQRMappingByQRId(qrId);
      
      if (!qrMapping) {
        return res.status(404).json({
          success: false,
          message: 'QR code not found or inactive'
        });
      }

      // Increment scan count
      await QRCodeDAO.incrementScanCount(qrId);

      res.status(200).json({
        success: true,
        message: 'QR mapping retrieved successfully',
        data: {
          qrCode: {
            id: qrMapping.id,
            qrId: qrMapping.qr_id,
            status: qrMapping.status,
            scanCount: qrMapping.scan_count + 1, // Return incremented count
            lastScanned: new Date().toISOString()
          },
          item: qrMapping.items,
          contentUrl: QRService.getQRCodeURL(qrId)
        }
      });
    } catch (error) {
      console.error('Error getting QR mapping:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get QR mapping',
        error: error.message
      });
    }
  }

  /**
   * List QR codes for an item or property
   * GET /api/qrcodes?itemId=xxx or GET /api/qrcodes?propertyId=xxx
   */
  async listQRCodes(req, res) {
    try {
      const { itemId, propertyId } = req.query;

      let qrCodes = [];

      if (itemId) {
        // Validate item exists
        const itemResult = await ItemDAO.getItemById(itemId);
        if (!itemResult.success) {
          return res.status(404).json({
            success: false,
            message: 'Item not found'
          });
        }

        const item = itemResult.item;
        qrCodes = await QRCodeDAO.getQRCodesByItemId(itemId);
      } else if (propertyId) {
        qrCodes = await QRCodeDAO.getQRCodesByPropertyId(propertyId);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Either itemId or propertyId query parameter is required'
        });
      }

      // Format response data
      const formattedQRCodes = qrCodes.map(qr => ({
        id: qr.id,
        qrId: qr.qr_id,
        itemId: qr.item_id,
        status: qr.status,
        scanCount: qr.scan_count || 0,
        lastScanned: qr.last_scanned,
        contentUrl: QRService.getQRCodeURL(qr.qr_id),
        createdAt: qr.created_at,
        item: qr.items || null
      }));

      res.status(200).json({
        success: true,
        message: `Found ${formattedQRCodes.length} QR codes`,
        data: {
          qrCodes: formattedQRCodes,
          count: formattedQRCodes.length
        }
      });
    } catch (error) {
      console.error('Error listing QR codes:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list QR codes',
        error: error.message
      });
    }
  }

  /**
   * Update QR code status
   * PUT /api/qrcodes/:qrId/status
   */
  async updateQRStatus(req, res) {
    try {
      const { qrId } = req.params;
      
      // Validate request body
      const schema = Joi.object({
        status: Joi.string().valid('active', 'inactive', 'expired').required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const { status } = value;

      // Validate QR ID format
      if (!QRService.validateQRFormat(qrId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid QR code format'
        });
      }

      // Check if QR code exists
      const exists = await QRCodeDAO.qrCodeExists(qrId);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'QR code not found'
        });
      }

      // Update QR status
      const updatedQR = await QRCodeDAO.updateQRStatus(qrId, status);

      res.status(200).json({
        success: true,
        message: `QR code status updated to ${status}`,
        data: {
          qrCode: {
            id: updatedQR.id,
            qrId: updatedQR.qr_id,
            itemId: updatedQR.item_id,
            status: updatedQR.status,
            scanCount: updatedQR.scan_count,
            updatedAt: updatedQR.updated_at
          }
        }
      });
    } catch (error) {
      console.error('Error updating QR status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update QR status',
        error: error.message
      });
    }
  }

  /**
   * Download QR code image
   * GET /api/qrcodes/:qrId/download
   */
  async downloadQRCode(req, res) {
    try {
      const { qrId } = req.params;
      const { size = '512', format = 'png' } = req.query;

      // Validate QR ID format
      if (!QRService.validateQRFormat(qrId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid QR code format'
        });
      }

      // Get QR mapping to verify it exists
      const qrMapping = await QRCodeDAO.getQRMappingByQRId(qrId);
      if (!qrMapping) {
        return res.status(404).json({
          success: false,
          message: 'QR code not found or inactive'
        });
      }

      // Generate high-resolution QR code for download
      const downloadOptions = {
        width: parseInt(size),
        margin: 2,
        errorCorrectionLevel: 'H'
      };

      const qrCodeData = await QRService.createDownloadableQRCode(
        qrMapping.item_id, 
        downloadOptions
      );

      // Set appropriate headers for file download
      const filename = `qr-${qrMapping.items?.name || 'item'}-${qrId}.${format}`;
      res.setHeader('Content-Type', `image/${format}`);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', qrCodeData.qrCodeBuffer.length);

      // Send the QR code buffer
      res.status(200).send(qrCodeData.qrCodeBuffer);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download QR code',
        error: error.message
      });
    }
  }

  /**
   * Generate batch QR codes for multiple items
   * POST /api/qrcodes/batch
   */
  async generateBatchQRCodes(req, res) {
    try {
      // Validate request body
      const schema = Joi.object({
        itemIds: Joi.array().items(Joi.string().uuid()).min(1).max(50).required(),
        options: Joi.object({
          width: Joi.number().min(128).max(1024).optional(),
          margin: Joi.number().min(0).max(5).optional(),
          errorCorrectionLevel: Joi.string().valid('L', 'M', 'Q', 'H').optional()
        }).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const { itemIds, options = {} } = value;

      const results = [];
      const errors = [];

      // Process each item
      for (const itemId of itemIds) {
        try {
          // Verify item exists
          const itemResult = await ItemDAO.getItemById(itemId);
          if (!itemResult.success) {
            errors.push({
              itemId,
              error: 'Item not found'
            });
            continue;
          }

          const item = itemResult.item;

          // Generate QR code
          const qrCodeData = await QRService.createQRCode(itemId, options);

          // Save QR mapping
          const qrMapping = await QRCodeDAO.createQRMapping(
            itemId,
            qrCodeData.qrId,
            {
              contentUrl: qrCodeData.contentUrl,
              generationOptions: qrCodeData.options
            }
          );

          results.push({
            itemId,
            itemName: item.name,
            qrId: qrCodeData.qrId,
            contentUrl: qrCodeData.contentUrl,
            status: 'success'
          });
        } catch (itemError) {
          errors.push({
            itemId,
            error: itemError.message
          });
        }
      }

      const successCount = results.length;
      const errorCount = errors.length;

      res.status(successCount > 0 ? 201 : 400).json({
        success: successCount > 0,
        message: `Batch QR generation completed: ${successCount} successful, ${errorCount} failed`,
        data: {
          successful: results,
          failed: errors,
          summary: {
            total: itemIds.length,
            successful: successCount,
            failed: errorCount
          }
        }
      });
    } catch (error) {
      console.error('Error generating batch QR codes:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate batch QR codes',
        error: error.message
      });
    }
  }

  /**
   * Get QR code statistics
   * GET /api/qrcodes/stats
   */
  async getQRStats(req, res) {
    try {
      // Get demo user ID
      const demoUserId = req.user?.id || '550e8400-e29b-41d4-a716-446655440000';

      const stats = await QRCodeDAO.getQRCodeStats(demoUserId);

      res.status(200).json({
        success: true,
        message: 'QR code statistics retrieved successfully',
        data: {
          stats
        }
      });
    } catch (error) {
      console.error('Error getting QR stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get QR statistics',
        error: error.message
      });
    }
  }

  /**
   * Delete QR code
   * DELETE /api/qrcodes/:qrId
   */
  async deleteQRCode(req, res) {
    try {
      const { qrId } = req.params;

      // Validate QR ID format
      if (!QRService.validateQRFormat(qrId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid QR code format'
        });
      }

      // Check if QR code exists
      const exists = await QRCodeDAO.qrCodeExists(qrId);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'QR code not found'
        });
      }

      // Delete QR mapping (soft delete)
      const deletedQR = await QRCodeDAO.deleteQRMapping(qrId);

      res.status(200).json({
        success: true,
        message: 'QR code deleted successfully',
        data: {
          deletedQRCode: {
            qrId: deletedQR.qr_id,
            itemId: deletedQR.item_id,
            status: deletedQR.status,
            deletedAt: deletedQR.updated_at
          }
        }
      });
    } catch (error) {
      console.error('Error deleting QR code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete QR code',
        error: error.message
      });
    }
  }
}

module.exports = new QRController();