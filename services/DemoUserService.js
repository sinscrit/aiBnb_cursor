/**
 * Demo User Service - Hardcoded User Functions for MVP1
 * QR Code-Based Instructional System - Authentication Bypass Service
 */

const SupabaseService = require('./SupabaseService');

// Hardcoded demo user data - matches the migration 002_demo_user_setup.sql
const DEMO_USER = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'demo@qrinstruct.com',
  name: 'Demo User',
  avatar_url: 'https://via.placeholder.com/150/007bff/ffffff?text=DU',
  metadata: {
    role: 'demo',
    account_type: 'demo',
    limitations: 'MVP1 demo user with full access'
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

/**
 * Get the current demo user object
 * @returns {Object} Hardcoded demo user object
 */
const getCurrentUser = () => {
  console.log('🎭 Demo Mode: Using hardcoded demo user');
  return {
    ...DEMO_USER,
    // Add some runtime properties
    session_id: `demo-session-${Date.now()}`,
    logged_in_at: new Date().toISOString(),
    demo_mode: true
  };
};

/**
 * Get the demo user UUID
 * @returns {string} Demo user UUID
 */
const getDemoUserId = () => {
  return DEMO_USER.id;
};

/**
 * Validate that the demo user exists in the database
 * @returns {Promise<Object>} Validation result
 */
const validateDemoUser = async () => {
  try {
    const client = SupabaseService.getSupabaseClient();
    
    // Try to query the demo user from the database
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', DEMO_USER.id)
      .eq('email', DEMO_USER.email)
      .single();
    
    if (error) {
      return {
        valid: false,
        message: 'Demo user not found in database',
        error: error.message,
        suggestion: 'Run migration 002_demo_user_setup.sql to create demo user'
      };
    }
    
    if (!data) {
      return {
        valid: false,
        message: 'Demo user query returned no results',
        suggestion: 'Check if demo user migration was applied correctly'
      };
    }
    
    return {
      valid: true,
      message: 'Demo user found in database',
      user: data,
      hardcoded_match: data.id === DEMO_USER.id && data.email === DEMO_USER.email
    };
    
  } catch (error) {
    return {
      valid: false,
      message: 'Error validating demo user',
      error: error.message,
      fallback: 'Using hardcoded demo user data'
    };
  }
};

/**
 * Get demo user properties for testing
 * @returns {Promise<Object>} Demo user properties
 */
const getDemoUserProperties = async () => {
  try {
    const client = SupabaseService.getSupabaseClient();
    
    const { data, error } = await client
      .from('properties')
      .select('*')
      .eq('user_id', DEMO_USER.id);
    
    if (error) {
      console.warn('Could not fetch demo properties from database:', error.message);
      return {
        success: false,
        error: error.message,
        properties: []
      };
    }
    
    return {
      success: true,
      properties: data || [],
      count: data ? data.length : 0
    };
    
  } catch (error) {
    console.warn('Error fetching demo properties:', error.message);
    return {
      success: false,
      error: error.message,
      properties: []
    };
  }
};

/**
 * Get demo user items for testing
 * @returns {Promise<Object>} Demo user items
 */
const getDemoUserItems = async () => {
  try {
    const client = SupabaseService.getSupabaseClient();
    
    // Get items for all demo user properties
    const { data, error } = await client
      .from('items')
      .select(`
        *,
        properties (
          id,
          name,
          user_id
        )
      `)
      .eq('properties.user_id', DEMO_USER.id);
    
    if (error) {
      console.warn('Could not fetch demo items from database:', error.message);
      return {
        success: false,
        error: error.message,
        items: []
      };
    }
    
    return {
      success: true,
      items: data || [],
      count: data ? data.length : 0
    };
    
  } catch (error) {
    console.warn('Error fetching demo items:', error.message);
    return {
      success: false,
      error: error.message,
      items: []
    };
  }
};

/**
 * Get demo user QR codes for testing
 * @returns {Promise<Object>} Demo user QR codes
 */
const getDemoUserQRCodes = async () => {
  try {
    const client = SupabaseService.getSupabaseClient();
    
    // Get QR codes for all demo user items
    const { data, error } = await client
      .from('qr_codes')
      .select(`
        *,
        items (
          id,
          name,
          properties (
            id,
            name,
            user_id
          )
        )
      `)
      .eq('items.properties.user_id', DEMO_USER.id);
    
    if (error) {
      console.warn('Could not fetch demo QR codes from database:', error.message);
      return {
        success: false,
        error: error.message,
        qr_codes: []
      };
    }
    
    return {
      success: true,
      qr_codes: data || [],
      count: data ? data.length : 0
    };
    
  } catch (error) {
    console.warn('Error fetching demo QR codes:', error.message);
    return {
      success: false,
      error: error.message,
      qr_codes: []
    };
  }
};

/**
 * Check if a user ID matches the demo user
 * @param {string} userId - User ID to check
 * @returns {boolean} True if user ID is the demo user
 */
const isDemoUser = (userId) => {
  return userId === DEMO_USER.id;
};

/**
 * Get demo user session information
 * @returns {Object} Demo session information
 */
const getDemoSession = () => {
  return {
    user: getCurrentUser(),
    authenticated: true,
    demo_mode: true,
    session_type: 'demo',
    expires_at: null, // Demo session never expires
    created_at: new Date().toISOString(),
    permissions: ['read', 'write', 'delete'], // Full permissions for demo
    limitations: [
      'Demo data only',
      'No real email sending',
      'Limited to MVP1 features'
    ]
  };
};

module.exports = {
  getCurrentUser,
  getDemoUserId,
  validateDemoUser,
  getDemoUserProperties,
  getDemoUserItems,
  getDemoUserQRCodes,
  isDemoUser,
  getDemoSession,
  // Export constants for use in other modules
  DEMO_USER_ID: DEMO_USER.id,
  DEMO_USER_EMAIL: DEMO_USER.email
}; 