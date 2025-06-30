/**
 * QR Code Data Access Object (DAO)
 * QR Code-Based Instructional System - QR Code Database Layer
 */

const SupabaseService = require('../services/SupabaseService');

/**
 * Create a QR code mapping for an item
 * @param {string} itemId - Item UUID
 * @param {string} qrId - QR code UUID
 * @param {Object} qrData - QR code data object
 * @returns {Promise<Object>} Result object with success flag and QR mapping data
 */
const createQRMapping = async (itemId, qrId, qrData) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    // Validate required fields
    if (!itemId) {
      return {
        success: false,
        error: 'Item ID is required'
      };
    }

    if (!qrId) {
      return {
        success: false,
        error: 'QR ID is required'
      };
    }

    // Verify the item exists
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .select('id, name, property_id')
      .eq('id', itemId)
      .single();

    if (itemError || !itemData) {
      return {
        success: false,
        error: 'Item not found'
      };
    }

    // Check if QR code already exists for this item
    const { data: existingQR, error: checkError } = await supabase
      .from('qr_codes')
      .select('id')
      .eq('item_id', itemId)
      .eq('status', 'active');

    if (checkError) {
      return {
        success: false,
        error: `Error checking existing QR codes: ${checkError.message}`
      };
    }

    // Prepare QR code data for database
    const qrMappingData = {
      item_id: itemId,
      qr_id: qrId,
      status: 'active',
      scan_count: 0,
      last_scanned: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the QR code mapping
    const { data: insertedQR, error: insertError } = await supabase
      .from('qr_codes')
      .insert([qrMappingData])
      .select()
      .single();

    if (insertError) {
      return {
        success: false,
        error: `Failed to create QR mapping: ${insertError.message}`
      };
    }

    return {
      success: true,
      message: 'QR code mapping created successfully',
      data: {
        qr_mapping: insertedQR,
        item: itemData,
        existing_qr_count: existingQR ? existingQR.length : 0
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `QR mapping creation failed: ${error.message}`
    };
  }
};

/**
 * Retrieve item data by QR code ID
 * @param {string} qrId - QR code UUID
 * @returns {Promise<Object>} Result object with item data or error
 */
const getQRMappingByQRId = async (qrId) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    if (!qrId) {
      return {
        success: false,
        error: 'QR ID is required'
      };
    }

    // Get QR code mapping with item details
    const { data: qrMapping, error: qrError } = await supabase
      .from('qr_codes')
      .select(`
        id,
        item_id,
        qr_id,
        status,
        scan_count,
        last_scanned,
        created_at,
        updated_at,
        items (
          id,
          name,
          description,
          location,
          media_url,
          media_type,
          metadata,
          created_at,
          updated_at,
          properties (
            id,
            name,
            description,
            address,
            property_type
          )
        )
      `)
      .eq('qr_id', qrId)
      .single();

    if (qrError || !qrMapping) {
      return {
        success: false,
        error: 'QR code mapping not found'
      };
    }

    // Update scan count
    await incrementScanCount(qrId);

    return {
      success: true,
      message: 'QR mapping retrieved successfully',
      data: {
        qr_code: qrMapping,
        item: qrMapping.items,
        property: qrMapping.items?.properties,
        scan_count: qrMapping.scan_count + 1 // Reflect the increment
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to retrieve QR mapping: ${error.message}`
    };
  }
};

/**
 * Get all QR codes for a specific item
 * @param {string} itemId - Item UUID
 * @returns {Promise<Object>} Result object with QR codes or error
 */
const getQRCodesByItemId = async (itemId) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    if (!itemId) {
      return {
        success: false,
        error: 'Item ID is required'
      };
    }

    // Get all QR codes for the item
    const { data: qrCodes, error: qrError } = await supabase
      .from('qr_codes')
      .select(`
        id,
        item_id,
        qr_id,
        status,
        scan_count,
        last_scanned,
        created_at,
        updated_at
      `)
      .eq('item_id', itemId)
      .order('created_at', { ascending: false });

    if (qrError) {
      return {
        success: false,
        error: `Failed to retrieve QR codes: ${qrError.message}`
      };
    }

    // Get item details
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .select('id, name, description, location, property_id')
      .eq('id', itemId)
      .single();

    if (itemError || !itemData) {
      return {
        success: false,
        error: 'Item not found'
      };
    }

    return {
      success: true,
      message: `Found ${qrCodes ? qrCodes.length : 0} QR codes for item`,
      data: {
        qr_codes: qrCodes || [],
        item: itemData,
        count: qrCodes ? qrCodes.length : 0,
        active_count: qrCodes ? qrCodes.filter(qr => qr.status === 'active').length : 0,
        total_scans: qrCodes ? qrCodes.reduce((sum, qr) => sum + (qr.scan_count || 0), 0) : 0
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to retrieve QR codes for item: ${error.message}`
    };
  }
};

/**
 * Update QR code status
 * @param {string} qrId - QR code UUID
 * @param {string} status - New status ('active' or 'inactive')
 * @returns {Promise<Object>} Result object with success flag and updated data
 */
const updateQRStatus = async (qrId, status) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    if (!qrId) {
      return {
        success: false,
        error: 'QR ID is required'
      };
    }

    if (!['active', 'inactive'].includes(status)) {
      return {
        success: false,
        error: 'Status must be either "active" or "inactive"'
      };
    }

    // Update QR code status
    const { data: updatedQR, error: updateError } = await supabase
      .from('qr_codes')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('qr_id', qrId)
      .select()
      .single();

    if (updateError || !updatedQR) {
      return {
        success: false,
        error: 'QR code not found or update failed'
      };
    }

    return {
      success: true,
      message: `QR code status updated to ${status}`,
      data: {
        qr_code: updatedQR,
        previous_status: updatedQR.status === status ? 'unknown' : (status === 'active' ? 'inactive' : 'active')
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to update QR status: ${error.message}`
    };
  }
};

/**
 * Delete QR code mapping
 * @param {string} qrId - QR code UUID
 * @returns {Promise<Object>} Result object with success flag and deletion info
 */
const deleteQRMapping = async (qrId) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    if (!qrId) {
      return {
        success: false,
        error: 'QR ID is required'
      };
    }

    // Get QR details before deletion
    const existingQR = await getQRMappingByQRId(qrId);
    if (!existingQR.success) {
      return existingQR;
    }

    const qrCode = existingQR.data.qr_code;

    // Delete the QR code mapping
    const { error: deleteError } = await supabase
      .from('qr_codes')
      .delete()
      .eq('qr_id', qrId);

    if (deleteError) {
      return {
        success: false,
        error: `Failed to delete QR mapping: ${deleteError.message}`
      };
    }

    return {
      success: true,
      message: 'QR code mapping deleted successfully',
      data: {
        deleted_qr: {
          id: qrCode.id,
          item_id: qrCode.item_id,
          status: qrCode.status,
          scan_count: qrCode.scan_count,
          created_at: qrCode.created_at
        },
        item_name: existingQR.data.item?.name || 'Unknown Item'
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `QR mapping deletion failed: ${error.message}`
    };
  }
};

/**
 * Increment scan count for a QR code
 * @param {string} qrId - QR code UUID
 * @returns {Promise<Object>} Result object with updated scan count
 */
const incrementScanCount = async (qrId) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    if (!qrId) {
      return {
        success: false,
        error: 'QR ID is required'
      };
    }

    // First get current scan count
    const { data: currentQR, error: getError } = await supabase
      .from('qr_codes')
      .select('scan_count')
      .eq('qr_id', qrId)
      .single();

    if (getError) {
      return {
        success: false,
        error: `Failed to get current scan count: ${getError.message}`
      };
    }

    const newScanCount = (currentQR?.scan_count || 0) + 1;

    // Update with incremented count
    const { data: updatedQR, error: updateError } = await supabase
      .from('qr_codes')
      .update({ 
        scan_count: newScanCount,
        last_scanned: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('qr_id', qrId)
      .select('scan_count')
      .single();

    if (updateError) {
      return {
        success: false,
        error: `Failed to increment scan count: ${updateError.message}`
      };
    }

    return {
      success: true,
      message: 'Scan count incremented',
      data: {
        scan_count: updatedQR?.scan_count || 0
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to increment scan count: ${error.message}`
    };
  }
};

/**
 * Get QR code statistics for an item or property
 * @param {string} itemId - Item UUID (optional)
 * @param {string} propertyId - Property UUID (optional)
 * @returns {Promise<Object>} Result object with QR statistics
 */
const getQRStatistics = async (itemId = null, propertyId = null) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    let query = supabase
      .from('qr_codes')
      .select(`
        id,
        status,
        scan_count,
        created_at,
        items (
          id,
          name,
          property_id
        )
      `);

    // Filter by item or property
    if (itemId) {
      query = query.eq('item_id', itemId);
    } else if (propertyId) {
      query = query.eq('items.property_id', propertyId);
    }

    const { data: qrCodes, error: qrError } = await query;

    if (qrError) {
      return {
        success: false,
        error: `Failed to retrieve QR statistics: ${qrError.message}`
      };
    }

    // Calculate statistics
    const stats = {
      total_qr_codes: qrCodes ? qrCodes.length : 0,
      active_qr_codes: qrCodes ? qrCodes.filter(qr => qr.status === 'active').length : 0,
      inactive_qr_codes: qrCodes ? qrCodes.filter(qr => qr.status === 'inactive').length : 0,
      total_scans: qrCodes ? qrCodes.reduce((sum, qr) => sum + (qr.scan_count || 0), 0) : 0,
      average_scans: 0,
      most_scanned: null,
      least_scanned: null
    };

    if (stats.total_qr_codes > 0) {
      stats.average_scans = (stats.total_scans / stats.total_qr_codes).toFixed(2);
      
      const sortedByScans = qrCodes.sort((a, b) => (b.scan_count || 0) - (a.scan_count || 0));
      stats.most_scanned = {
        qr_id: sortedByScans[0].id,
        item_name: sortedByScans[0].items?.name || 'Unknown',
        scan_count: sortedByScans[0].scan_count || 0
      };
      stats.least_scanned = {
        qr_id: sortedByScans[sortedByScans.length - 1].id,
        item_name: sortedByScans[sortedByScans.length - 1].items?.name || 'Unknown',
        scan_count: sortedByScans[sortedByScans.length - 1].scan_count || 0
      };
    }

    return {
      success: true,
      message: 'QR statistics retrieved successfully',
      data: {
        statistics: stats,
        filter: itemId ? `item: ${itemId}` : propertyId ? `property: ${propertyId}` : 'all'
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to retrieve QR statistics: ${error.message}`
    };
  }
};

module.exports = {
  createQRMapping,
  getQRMappingByQRId,
  getQRCodesByItemId,
  updateQRStatus,
  deleteQRMapping,
  incrementScanCount,
  getQRStatistics
}; 