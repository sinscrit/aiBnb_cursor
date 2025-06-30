/**
 * Property Data Access Object (DAO)
 * QR Code-Based Instructional System - Property Management Database Operations
 */

const SupabaseService = require('../services/SupabaseService');
const { v4: uuidv4 } = require('uuid');

/**
 * Create a new property for a user
 * @param {string} userId - User ID who owns the property
 * @param {Object} propertyData - Property data to insert
 * @returns {Promise<Object>} Result with created property or error
 */
const createProperty = async (userId, propertyData) => {
  try {
    const client = SupabaseService.getSupabaseClient();
    
    if (!userId || !propertyData.name) {
      throw new Error('User ID and property name are required');
    }
    
    const property = {
      id: uuidv4(),
      user_id: userId,
      name: propertyData.name.trim(),
      description: propertyData.description ? propertyData.description.trim() : null,
      address: propertyData.address ? propertyData.address.trim() : null,
      property_type: propertyData.property_type || 'other',
      settings: propertyData.settings || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const validTypes = ['apartment', 'house', 'condo', 'studio', 'other'];
    if (!validTypes.includes(property.property_type)) {
      throw new Error(`Property type must be one of: ${validTypes.join(', ')}`);
    }
    
    const { data, error } = await client
      .from('properties')
      .insert([property])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create property: ${error.message}`);
    }
    
    return {
      success: true,
      property: data,
      message: 'Property created successfully'
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      property: null
    };
  }
};

/**
 * Get all properties for a specific user
 * @param {string} userId - User ID to get properties for
 * @returns {Promise<Object>} Result with properties list or error
 */
const getPropertiesByUserId = async (userId) => {
  try {
    const client = SupabaseService.getSupabaseClient();
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const { data, error } = await client
      .from('properties')
      .select(`
        *,
        items (
          id,
          name,
          location
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }
    
    const propertiesWithCounts = (data || []).map(property => ({
      ...property,
      item_count: property.items ? property.items.length : 0,
      has_items: property.items && property.items.length > 0
    }));
    
    return {
      success: true,
      properties: propertiesWithCounts,
      count: propertiesWithCounts.length,
      message: `Found ${propertiesWithCounts.length} properties`
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      properties: [],
      count: 0
    };
  }
};

/**
 * Get a single property by ID
 * @param {string} propertyId - Property ID to retrieve
 * @returns {Promise<Object>} Result with property data or error
 */
const getPropertyById = async (propertyId) => {
  try {
    const client = SupabaseService.getSupabaseClient();
    
    if (!propertyId) {
      throw new Error('Property ID is required');
    }
    
    const { data, error } = await client
      .from('properties')
      .select(`
        *,
        items (
          id,
          name,
          description,
          location,
          media_url,
          media_type,
          created_at
        )
      `)
      .eq('id', propertyId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Property not found');
      }
      throw new Error(`Failed to fetch property: ${error.message}`);
    }
    
    const propertyWithDetails = {
      ...data,
      item_count: data.items ? data.items.length : 0,
      has_items: data.items && data.items.length > 0
    };
    
    return {
      success: true,
      property: propertyWithDetails,
      message: 'Property retrieved successfully'
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      property: null
    };
  }
};

/**
 * Update an existing property
 * @param {string} propertyId - Property ID to update
 * @param {Object} updates - Property data to update
 * @returns {Promise<Object>} Result with updated property or error
 */
const updateProperty = async (propertyId, updates) => {
  try {
    const client = SupabaseService.getSupabaseClient();
    
    if (!propertyId) {
      throw new Error('Property ID is required');
    }
    
    const updateData = {
      updated_at: new Date().toISOString()
    };
    
    if (updates.name !== undefined) {
      if (!updates.name || typeof updates.name !== 'string') {
        throw new Error('Property name must be a non-empty string');
      }
      updateData.name = updates.name.trim();
    }
    
    if (updates.description !== undefined) {
      updateData.description = updates.description ? updates.description.trim() : null;
    }
    
    if (updates.address !== undefined) {
      updateData.address = updates.address ? updates.address.trim() : null;
    }
    
    if (updates.property_type !== undefined) {
      const validTypes = ['apartment', 'house', 'condo', 'studio', 'other'];
      if (!validTypes.includes(updates.property_type)) {
        throw new Error(`Property type must be one of: ${validTypes.join(', ')}`);
      }
      updateData.property_type = updates.property_type;
    }
    
    if (updates.settings !== undefined) {
      updateData.settings = updates.settings || {};
    }
    
    const { data, error } = await client
      .from('properties')
      .update(updateData)
      .eq('id', propertyId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update property: ${error.message}`);
    }
    
    return {
      success: true,
      property: data,
      message: 'Property updated successfully'
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      property: null
    };
  }
};

/**
 * Delete a property (with cascade handling)
 * @param {string} propertyId - Property ID to delete
 * @returns {Promise<Object>} Result with deletion status or error
 */
const deleteProperty = async (propertyId) => {
  try {
    const client = SupabaseService.getSupabaseClient();
    
    if (!propertyId) {
      throw new Error('Property ID is required');
    }
    
    // First check if property exists and get item count
    const existingProperty = await getPropertyById(propertyId);
    if (!existingProperty.success) {
      throw new Error('Property not found');
    }
    
    const { data, error } = await client
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to delete property: ${error.message}`);
    }
    
    return {
      success: true,
      property: data,
      message: 'Property deleted successfully',
      cascade_info: {
        items_affected: existingProperty.property.item_count,
        note: 'Associated items and QR codes deleted via CASCADE constraints'
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      property: null
    };
  }
};

/**
 * Get property statistics for a user
 * @param {string} userId - User ID to get statistics for
 * @returns {Promise<Object>} Result with property statistics or error
 */
const getPropertyStatistics = async (userId) => {
  try {
    const client = SupabaseService.getSupabaseClient();
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Get properties with item counts using the property_summary view
    const { data, error } = await client
      .from('property_summary')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Database error fetching property statistics:', error);
      // Fallback to manual calculation if view doesn't exist
      const propertiesResult = await getPropertiesByUserId(userId);
      if (!propertiesResult.success) {
        throw new Error('Failed to fetch property statistics');
      }
      
      const stats = {
        total_properties: propertiesResult.count,
        total_items: propertiesResult.properties.reduce((sum, prop) => sum + prop.item_count, 0),
        total_qr_codes: 0, // Would need separate query
        properties_with_items: propertiesResult.properties.filter(prop => prop.has_items).length
      };
      
      return {
        success: true,
        statistics: stats,
        message: 'Property statistics calculated'
      };
    }
    
    const stats = {
      total_properties: data.length,
      total_items: data.reduce((sum, prop) => sum + (prop.item_count || 0), 0),
      total_qr_codes: data.reduce((sum, prop) => sum + (prop.qr_count || 0), 0),
      properties_with_items: data.filter(prop => prop.item_count > 0).length
    };
    
    return {
      success: true,
      statistics: stats,
      message: 'Property statistics retrieved successfully'
    };
    
  } catch (error) {
    console.error('Error fetching property statistics:', error.message);
    return {
      success: false,
      error: error.message,
      statistics: null
    };
  }
};

module.exports = {
  createProperty,
  getPropertiesByUserId,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertyStatistics
}; 