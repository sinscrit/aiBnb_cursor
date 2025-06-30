/**
 * QR Code Data Access Object
 * QR Code-Based Instructional System - QR Code Database Operations
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Create QR code mapping for an item
 * @param {string} itemId - Item UUID
 * @param {string} qrId - QR code identifier
 * @param {object} metadata - Additional QR code data
 * @returns {Promise<object>} Created QR code record
 */
const createQRMapping = async (itemId, qrId, metadata = {}) => {
  try {
    const qrCodeData = {
      item_id: itemId,
      qr_id: qrId,
      status: 'active',
      scan_count: 0,
      metadata: metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('qr_codes')
      .insert([qrCodeData])
      .select()
      .single();

    if (error) {
      console.error('Error creating QR mapping:', error);
      throw error;
    }

    console.log(`QR mapping created: ${qrId} -> Item ${itemId}`);
    return data;
  } catch (error) {
    console.error('QRCodeDAO.createQRMapping error:', error);
    throw new Error('Failed to create QR code mapping: ' + error.message);
  }
};

/**
 * Retrieve item data by QR code identifier
 * @param {string} qrId - QR code identifier
 * @returns {Promise<object|null>} QR code record with item data
 */
const getQRMappingByQRId = async (qrId) => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select(`
        *,
        items (
          id,
          property_id,
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
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error getting QR mapping:', error);
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('QRCodeDAO.getQRMappingByQRId error:', error);
    throw new Error('Failed to get QR mapping: ' + error.message);
  }
};

/**
 * Get all QR codes for a specific item
 * @param {string} itemId - Item UUID
 * @returns {Promise<Array>} Array of QR code records
 */
const getQRCodesByItemId = async (itemId) => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting QR codes for item:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('QRCodeDAO.getQRCodesByItemId error:', error);
    throw new Error('Failed to get QR codes for item: ' + error.message);
  }
};

/**
 * Get all QR codes for a specific property (via items)
 * @param {string} propertyId - Property UUID
 * @returns {Promise<Array>} Array of QR code records with item data
 */
const getQRCodesByPropertyId = async (propertyId) => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select(`
        *,
        items (
          id,
          name,
          description,
          location,
          media_url,
          media_type
        )
      `)
      .eq('items.property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting QR codes for property:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('QRCodeDAO.getQRCodesByPropertyId error:', error);
    throw new Error('Failed to get QR codes for property: ' + error.message);
  }
};

/**
 * Update QR code status
 * @param {string} qrId - QR code identifier
 * @param {string} status - New status (active, inactive, expired)
 * @returns {Promise<object>} Updated QR code record
 */
const updateQRStatus = async (qrId, status) => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('qr_id', qrId)
      .select()
      .single();

    if (error) {
      console.error('Error updating QR status:', error);
      throw error;
    }

    console.log(`QR code ${qrId} status updated to: ${status}`);
    return data;
  } catch (error) {
    console.error('QRCodeDAO.updateQRStatus error:', error);
    throw new Error('Failed to update QR status: ' + error.message);
  }
};

/**
 * Increment scan count for QR code
 * @param {string} qrId - QR code identifier
 * @returns {Promise<object>} Updated QR code record
 */
const incrementScanCount = async (qrId) => {
  try {
    // First get current scan count
    const { data: currentData, error: getError } = await supabase
      .from('qr_codes')
      .select('scan_count')
      .eq('qr_id', qrId)
      .single();

    if (getError) {
      console.error('Error getting current scan count:', getError);
      throw getError;
    }

    const newScanCount = (currentData.scan_count || 0) + 1;

    // Update with incremented count
    const { data, error } = await supabase
      .from('qr_codes')
      .update({
        scan_count: newScanCount,
        last_scanned: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('qr_id', qrId)
      .select()
      .single();

    if (error) {
      console.error('Error incrementing scan count:', error);
      throw error;
    }

    console.log(`QR code ${qrId} scan count incremented to: ${newScanCount}`);
    return data;
  } catch (error) {
    console.error('QRCodeDAO.incrementScanCount error:', error);
    throw new Error('Failed to increment scan count: ' + error.message);
  }
};

/**
 * Delete QR code mapping
 * @param {string} qrId - QR code identifier
 * @returns {Promise<object>} Deleted QR code record
 */
const deleteQRMapping = async (qrId) => {
  try {
    // First update status to inactive (soft delete)
    const { data, error } = await supabase
      .from('qr_codes')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('qr_id', qrId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting QR mapping:', error);
      throw error;
    }

    console.log(`QR code ${qrId} marked as inactive`);
    return data;
  } catch (error) {
    console.error('QRCodeDAO.deleteQRMapping error:', error);
    throw new Error('Failed to delete QR mapping: ' + error.message);
  }
};

/**
 * Delete all QR codes for an item (used when item is deleted)
 * @param {string} itemId - Item UUID
 * @returns {Promise<Array>} Array of deactivated QR code records
 */
const deleteQRCodesByItemId = async (itemId) => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('item_id', itemId)
      .select();

    if (error) {
      console.error('Error deleting QR codes for item:', error);
      throw error;
    }

    const count = data ? data.length : 0;
    console.log(`${count} QR codes marked as inactive for item ${itemId}`);
    return data || [];
  } catch (error) {
    console.error('QRCodeDAO.deleteQRCodesByItemId error:', error);
    throw new Error('Failed to delete QR codes for item: ' + error.message);
  }
};

/**
 * Get QR code statistics
 * @param {string} userId - User UUID (demo user)
 * @returns {Promise<object>} QR code statistics
 */
const getQRCodeStats = async (userId) => {
  try {
    // Get total QR codes for user's items
    const { data: totalData, error: totalError } = await supabase
      .from('qr_codes')
      .select('id', { count: 'exact' })
      .eq('items.properties.user_id', userId);

    if (totalError) {
      console.error('Error getting total QR count:', totalError);
      throw totalError;
    }

    // Get active QR codes
    const { data: activeData, error: activeError } = await supabase
      .from('qr_codes')
      .select('id', { count: 'exact' })
      .eq('items.properties.user_id', userId)
      .eq('status', 'active');

    if (activeError) {
      console.error('Error getting active QR count:', activeError);
      throw activeError;
    }

    // Get total scans
    const { data: scanData, error: scanError } = await supabase
      .from('qr_codes')
      .select('scan_count')
      .eq('items.properties.user_id', userId);

    if (scanError) {
      console.error('Error getting scan data:', scanError);
      throw scanError;
    }

    const totalScans = scanData.reduce((sum, record) => sum + (record.scan_count || 0), 0);

    return {
      totalQRCodes: totalData.length || 0,
      activeQRCodes: activeData.length || 0,
      inactiveQRCodes: (totalData.length || 0) - (activeData.length || 0),
      totalScans: totalScans
    };
  } catch (error) {
    console.error('QRCodeDAO.getQRCodeStats error:', error);
    throw new Error('Failed to get QR code statistics: ' + error.message);
  }
};

/**
 * Check if QR code exists
 * @param {string} qrId - QR code identifier
 * @returns {Promise<boolean>} True if QR code exists
 */
const qrCodeExists = async (qrId) => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('id')
      .eq('qr_id', qrId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error checking QR existence:', error);
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('QRCodeDAO.qrCodeExists error:', error);
    return false;
  }
};

module.exports = {
  createQRMapping,
  getQRMappingByQRId,
  getQRCodesByItemId,
  getQRCodesByPropertyId,
  updateQRStatus,
  incrementScanCount,
  deleteQRMapping,
  deleteQRCodesByItemId,
  getQRCodeStats,
  qrCodeExists
}; 