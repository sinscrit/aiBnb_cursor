/**
 * QR Code Controller - Business Logic Layer
 * QR Code-Based Instructional System - QR Code Management Controller
 */

const QRService = require('../services/QRService');
const QRCodeDAO = require('../dao/QRCodeDAO');
const ItemDAO = require('../dao/ItemDAO');

  /**
   * Generate QR code for an item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateQRCode = async (req, res) => {
  try {
    const { itemId } = req.body;
    const options = req.body.options || {};

    // Validate required fields
    if (!itemId) {
        return res.status(400).json({
          success: false,
        error: 'Item ID is required'
        });
      }

    // Verify item exists and user has access
      const itemResult = await ItemDAO.getItemById(itemId);
      if (!itemResult.success) {
        return res.status(404).json({
          success: false,
        error: 'Item not found'
        });
      }

      const item = itemResult.item;

      // Generate QR code using QRService
    const qrResult = await QRService.createQRCode(itemId, options);
    if (!qrResult.success) {
      return res.status(500).json({
        success: false,
        error: qrResult.error
      });
    }

      // Save QR mapping to database
    const mappingResult = await QRCodeDAO.createQRMapping(
        itemId, 
      qrResult.qr_id, 
      qrResult
    );
    
    if (!mappingResult.success) {
      return res.status(500).json({
        success: false,
        error: mappingResult.error
      });
    }

    // Generate filename for downloads
    const filename = QRService.generateQRFileName(qrResult.qr_id, item.name);

      res.status(201).json({
        success: true,
        message: 'QR code generated successfully',
        data: {
        qr_id: qrResult.qr_id,
        item_id: itemId,
        item_name: item.name,
        content_url: qrResult.content_url,
        qr_code_data_url: qrResult.qr_code_data_url,
        download_url: `/api/qrcodes/${qrResult.qr_id}/download`,
        filename: filename,
        size: qrResult.size,
        format: qrResult.format,
        scan_count: 0,
        status: 'active',
        database_record: mappingResult.data.qr_mapping
        }
      });

    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).json({
        success: false,
      error: 'Internal server error while generating QR code'
      });
  }
};

  /**
 * Get item data by QR code ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
   */
const getQRMapping = async (req, res) => {
    try {
      const { qrId } = req.params;

    if (!qrId) {
        return res.status(400).json({
          success: false,
        error: 'QR ID is required'
        });
      }

    // Get QR mapping with item details
    const mappingResult = await QRCodeDAO.getQRMappingByQRId(qrId);
    if (!mappingResult.success) {
        return res.status(404).json({
          success: false,
        error: mappingResult.error
        });
      }

    const data = mappingResult.data;

      res.status(200).json({
        success: true,
        message: 'QR mapping retrieved successfully',
        data: {
        qr_code: {
          id: data.qr_code.id,
          qr_id: data.qr_code.qr_id,
          content_url: QRService.getQRCodeURL(data.qr_code.qr_id),
          scan_count: data.scan_count,
          status: data.qr_code.status,
          last_scanned: data.qr_code.last_scanned,
          created_at: data.qr_code.created_at
        },
        item: {
          id: data.item.id,
          name: data.item.name,
          description: data.item.description,
          location: data.item.location,
          media_url: data.item.media_url,
          media_type: data.item.media_type,
          metadata: data.item.metadata
        },
        property: data.property ? {
          id: data.property.id,
          name: data.property.name,
          description: data.property.description,
          address: data.property.address,
          property_type: data.property.property_type
        } : null
        }
      });

    } catch (error) {
      console.error('Error getting QR mapping:', error);
      res.status(500).json({
        success: false,
      error: 'Internal server error while retrieving QR mapping'
      });
    }
};

  /**
 * List QR codes for an item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
   */
const listQRCodes = async (req, res) => {
    try {
    const { itemId } = req.query;

    if (!itemId) {
      return res.status(400).json({
            success: false,
        error: 'Item ID is required as query parameter'
          });
        }

    // Get QR codes for the item
    const qrResult = await QRCodeDAO.getQRCodesByItemId(itemId);
    if (!qrResult.success) {
      return res.status(404).json({
          success: false,
        error: qrResult.error
        });
      }

    const data = qrResult.data;

    // Generate download URLs for each QR code
    const qrCodesWithUrls = data.qr_codes.map(qr => ({
        id: qr.id,
      qr_id: qr.qr_id,
      content_url: QRService.getQRCodeURL(qr.qr_id),
        status: qr.status,
      scan_count: qr.scan_count,
      last_scanned: qr.last_scanned,
      created_at: qr.created_at,
      download_url: `/api/qrcodes/${qr.qr_id}/download`,
      filename: QRService.generateQRFileName(qr.qr_id, data.item.name)
      }));

      res.status(200).json({
        success: true,
      message: data.count > 0 ? `Found ${data.count} QR codes for item` : 'No QR codes found for item',
        data: {
        qr_codes: qrCodesWithUrls,
        item: {
          id: data.item.id,
          name: data.item.name,
          description: data.item.description,
          location: data.item.location
        },
        statistics: {
          total_count: data.count,
          active_count: data.active_count,
          inactive_count: data.count - data.active_count,
          total_scans: data.total_scans
        }
        }
      });

    } catch (error) {
      console.error('Error listing QR codes:', error);
      res.status(500).json({
        success: false,
      error: 'Internal server error while listing QR codes'
      });
  }
};

  /**
   * Update QR code status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
   */
const updateQRStatus = async (req, res) => {
    try {
      const { qrId } = req.params;
    const { status } = req.body;

    if (!qrId) {
        return res.status(400).json({
          success: false,
        error: 'QR ID is required'
        });
      }

    if (!status || !['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
        error: 'Status must be either "active" or "inactive"'
        });
      }

    // Update QR code status
    const updateResult = await QRCodeDAO.updateQRStatus(qrId, status);
    if (!updateResult.success) {
        return res.status(404).json({
          success: false,
        error: updateResult.error
        });
      }

      res.status(200).json({
        success: true,
      message: updateResult.message,
        data: {
        qr_code: {
          id: updateResult.data.qr_code.id,
          qr_id: updateResult.data.qr_code.qr_id,
          status: updateResult.data.qr_code.status,
          updated_at: updateResult.data.qr_code.updated_at
        },
        previous_status: updateResult.data.previous_status
        }
      });

    } catch (error) {
      console.error('Error updating QR status:', error);
      res.status(500).json({
        success: false,
      error: 'Internal server error while updating QR status'
      });
  }
};

  /**
   * Download QR code image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
   */
const downloadQRCode = async (req, res) => {
    try {
      const { qrId } = req.params;
    const { size = '256', format = 'png' } = req.query;

    if (!qrId) {
        return res.status(400).json({
          success: false,
        error: 'QR ID is required'
        });
      }

      // Get QR mapping to verify it exists
    const mappingResult = await QRCodeDAO.getQRMappingByQRId(qrId);
    if (!mappingResult.success) {
        return res.status(404).json({
          success: false,
        error: 'QR code not found'
        });
      }

    const qrData = mappingResult.data;
    const item = qrData.item;

    // Generate fresh QR code for download with specified options
      const downloadOptions = {
      width: parseInt(size) || 256,
      errorCorrectionLevel: 'H', // High error correction for printing
      margin: 2
      };

    const qrResult = await QRService.createQRCode(qrData.qr_code.item_id, downloadOptions);
    if (!qrResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate QR code for download'
      });
    }

    // Generate appropriate filename
    const filename = QRService.generateQRFileName(qrId, item.name);

      // Set appropriate headers for file download
    res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-QR-ID', qrId);
    res.setHeader('X-Item-Name', item.name);

    // Send the QR code buffer as response
    res.status(200).send(qrResult.qr_code_buffer);

    } catch (error) {
      console.error('Error downloading QR code:', error);
      res.status(500).json({
      success: false,
      error: 'Internal server error while downloading QR code'
    });
  }
};

/**
 * Delete QR code mapping
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteQRCode = async (req, res) => {
  try {
    const { qrId } = req.params;

    if (!qrId) {
      return res.status(400).json({
        success: false,
        error: 'QR ID is required'
      });
    }

    // Delete QR code mapping
    const deleteResult = await QRCodeDAO.deleteQRMapping(qrId);
    if (!deleteResult.success) {
      return res.status(404).json({
        success: false,
        error: deleteResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: deleteResult.message,
      data: {
        deleted_qr: deleteResult.data.deleted_qr,
        item_name: deleteResult.data.item_name
      }
    });

  } catch (error) {
    console.error('Error deleting QR code:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while deleting QR code'
      });
    }
};

  /**
 * Get QR code statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
   */
const getQRStatistics = async (req, res) => {
    try {
    const { itemId, propertyId } = req.query;

    if (!itemId && !propertyId) {
      return res.status(400).json({
        success: false,
        error: 'Either itemId or propertyId is required as query parameter'
      });
    }

    // Get QR statistics
    const statsResult = await QRCodeDAO.getQRStatistics(itemId, propertyId);
    if (!statsResult.success) {
      return res.status(500).json({
        success: false,
        error: statsResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: statsResult.message,
      data: {
        statistics: statsResult.data.statistics,
        filter: statsResult.data.filter,
        generated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error getting QR statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while retrieving QR statistics'
    });
  }
};

/**
 * Batch generate QR codes for multiple items
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const batchGenerateQRCodes = async (req, res) => {
  try {
    const { itemIds, options = {} } = req.body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
        return res.status(400).json({
          success: false,
        error: 'Array of item IDs is required'
        });
      }

    if (itemIds.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 items allowed for batch generation'
      });
    }

      const results = [];
      const errors = [];

    // Generate QR codes for each item
      for (const itemId of itemIds) {
        try {
          // Verify item exists
          const itemResult = await ItemDAO.getItemById(itemId);
          if (!itemResult.success) {
            errors.push({
            item_id: itemId,
              error: 'Item not found'
            });
            continue;
          }

          // Generate QR code
        const qrResult = await QRService.createQRCode(itemId, options);
        if (!qrResult.success) {
          errors.push({
            item_id: itemId,
            error: qrResult.error
          });
          continue;
        }

        // Save mapping
        const mappingResult = await QRCodeDAO.createQRMapping(
            itemId,
          qrResult.qr_id, 
          qrResult
        );

        if (!mappingResult.success) {
          errors.push({
            item_id: itemId,
            error: mappingResult.error
          });
          continue;
        }

        results.push({
          item_id: itemId,
          item_name: itemResult.item.name,
          qr_id: qrResult.qr_id,
          content_url: qrResult.content_url,
          download_url: `/api/qrcodes/${qrResult.qr_id}/download`,
          filename: QRService.generateQRFileName(qrResult.qr_id, itemResult.item.name)
        });

      } catch (error) {
        errors.push({
          item_id: itemId,
          error: `Unexpected error: ${error.message}`
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
        statistics: {
          requested: itemIds.length,
            successful: successCount,
          failed: errorCount,
          success_rate: `${((successCount / itemIds.length) * 100).toFixed(1)}%`
          }
        }
      });

    } catch (error) {
    console.error('Error in batch QR generation:', error);
      res.status(500).json({
        success: false,
      error: 'Internal server error during batch QR generation'
      });
    }
};

module.exports = {
  generateQRCode,
  getQRMapping,
  listQRCodes,
  updateQRStatus,
  downloadQRCode,
  deleteQRCode,
  getQRStatistics,
  batchGenerateQRCodes
};