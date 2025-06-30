/**
 * Item Data Access Object (DAO)
 * QR Code-Based Instructional System - Item Management Database Layer
 */

const SupabaseService = require('../services/SupabaseService');

/**
 * Create a new item for a property
 * @param {string} propertyId - Property UUID
 * @param {Object} itemData - Item data object
 * @returns {Promise<Object>} Result object with success flag and item data
 */
const createItem = async (propertyId, itemData) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    // Validate required fields
    if (!propertyId) {
      return {
        success: false,
        error: 'Property ID is required'
      };
    }

    if (!itemData || !itemData.name || itemData.name.trim() === '') {
      return {
        success: false,
        error: 'Item name is required'
      };
    }

    // Validate property exists
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, user_id, name')
      .eq('id', propertyId)
      .single();

    if (propertyError) {
      if (propertyError.code === 'PGRST116') {
        return {
          success: false,
          error: 'Property not found'
        };
      }
      return {
        success: false,
        error: `Property validation failed: ${propertyError.message}`
      };
    }

    // Prepare item data for insertion
    const itemToInsert = {
      property_id: propertyId,
      name: itemData.name.trim(),
      description: itemData.description || null,
      location: itemData.location || null,
      media_url: itemData.media_url || null,
      media_type: itemData.media_type || null,
      metadata: itemData.metadata || {}
    };

    // Insert the item
    const { data: insertedItem, error: insertError } = await supabase
      .from('items')
      .insert([itemToInsert])
      .select()
      .single();

    if (insertError) {
      return {
        success: false,
        error: `Failed to create item: ${insertError.message}`
      };
    }

    return {
      success: true,
      item: insertedItem,
      property_info: {
        property_id: property.id,
        property_name: property.name
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `Create item operation failed: ${error.message}`
    };
  }
};

/**
 * Get all items for a specific property
 * @param {string} propertyId - Property UUID
 * @returns {Promise<Object>} Result object with success flag and items array
 */
const getItemsByPropertyId = async (propertyId) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    if (!propertyId) {
      return {
        success: false,
        error: 'Property ID is required'
      };
    }

    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (itemsError) {
      return {
        success: false,
        error: `Failed to fetch items: ${itemsError.message}`
      };
    }

    return {
      success: true,
      items: items || [],
      count: items ? items.length : 0,
      property_id: propertyId
    };

  } catch (error) {
    return {
      success: false,
      error: `Get items operation failed: ${error.message}`
    };
  }
};

/**
 * Get a single item by ID
 * @param {string} itemId - Item UUID
 * @returns {Promise<Object>} Result object with success flag and item data
 */
const getItemById = async (itemId) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    if (!itemId) {
      return {
        success: false,
        error: 'Item ID is required'
      };
    }

    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (itemError) {
      if (itemError.code === 'PGRST116') {
        return {
          success: false,
          error: 'Item not found'
        };
      }
      return {
        success: false,
        error: `Failed to fetch item: ${itemError.message}`
      };
    }

    return {
      success: true,
      item: item
    };

  } catch (error) {
    return {
      success: false,
      error: `Get item operation failed: ${error.message}`
    };
  }
};

/**
 * Update an item
 * @param {string} itemId - Item UUID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Result object with success flag and updated item
 */
const updateItem = async (itemId, updateData) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    if (!itemId) {
      return {
        success: false,
        error: 'Item ID is required'
      };
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return {
        success: false,
        error: 'Update data is required'
      };
    }

    // Prepare update data
    const itemToUpdate = {};
    
    if (updateData.name !== undefined) {
      itemToUpdate.name = updateData.name.trim();
    }
    if (updateData.description !== undefined) {
      itemToUpdate.description = updateData.description || null;
    }
    if (updateData.location !== undefined) {
      itemToUpdate.location = updateData.location || null;
    }
    if (updateData.media_url !== undefined) {
      itemToUpdate.media_url = updateData.media_url || null;
    }
    if (updateData.media_type !== undefined) {
      itemToUpdate.media_type = updateData.media_type || null;
    }
    if (updateData.metadata !== undefined) {
      itemToUpdate.metadata = updateData.metadata || {};
    }

    // Add updated timestamp
    itemToUpdate.updated_at = new Date().toISOString();

    // Update the item
    const { data: updatedItem, error: updateError } = await supabase
      .from('items')
      .update(itemToUpdate)
      .eq('id', itemId)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return {
          success: false,
          error: 'Item not found'
        };
      }
      return {
        success: false,
        error: `Failed to update item: ${updateError.message}`
      };
    }

    return {
      success: true,
      item: updatedItem
    };

  } catch (error) {
    return {
      success: false,
      error: `Update item operation failed: ${error.message}`
    };
  }
};

/**
 * Update item location
 * @param {string} itemId - Item UUID
 * @param {string} location - New location within property
 * @returns {Promise<Object>} Result object with success flag and updated item
 */
const updateItemLocation = async (itemId, location) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    if (!itemId) {
      return {
        success: false,
        error: 'Item ID is required'
      };
    }

    // Verify item exists first
    const existingItem = await getItemById(itemId);
    if (!existingItem.success) {
      return existingItem;
    }

    // Update the location
    const { data: updatedItem, error: updateError } = await supabase
      .from('items')
      .update({ 
        location: location || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: `Failed to update item location: ${updateError.message}`
      };
    }

    return {
      success: true,
      item: updatedItem,
      previous_location: existingItem.item.location,
      new_location: location
    };

  } catch (error) {
    return {
      success: false,
      error: `Update item location operation failed: ${error.message}`
    };
  }
};

/**
 * Delete an item
 * @param {string} itemId - Item UUID
 * @returns {Promise<Object>} Result object with success flag and deletion info
 */
const deleteItem = async (itemId) => {
  try {
    // Get the Supabase client
    const supabase = SupabaseService.getSupabaseClient();
    
    if (!itemId) {
      return {
        success: false,
        error: 'Item ID is required'
      };
    }

    // Get item details before deletion
    const existingItem = await getItemById(itemId);
    if (!existingItem.success) {
      return existingItem;
    }

    const item = existingItem.item;

    // Delete the item
    const { error: deleteError } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId);

    if (deleteError) {
      return {
        success: false,
        error: `Failed to delete item: ${deleteError.message}`
      };
    }

    return {
      success: true,
      item: {
        id: item.id,
        name: item.name,
        location: item.location,
        property_id: item.property_id
      },
      cascade_info: {
        note: 'Associated QR codes deleted via CASCADE constraints'
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `Delete item operation failed: ${error.message}`
    };
  }
};

module.exports = {
  createItem,
  getItemsByPropertyId,
  getItemById,
  updateItem,
  updateItemLocation,
  deleteItem
};
