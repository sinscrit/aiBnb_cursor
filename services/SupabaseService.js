/**
 * Supabase Service - Client Initialization
 * QR Code-Based Instructional System - Database Connection Service
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Environment variable validation
const validateEnvironment = () => {
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing Supabase environment variables:', missingVars.join(', '));
    console.warn('📝 Please update your .env file with actual Supabase project credentials');
    return false;
  }
  return true;
};

// Initialize Supabase clients
let supabaseClient = null;
let supabaseServiceClient = null;

try {
  // Validate environment variables
  const isValid = validateEnvironment();
  
  if (isValid) {
    // Anonymous client for general operations
    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false, // For server-side usage
        }
      }
    );
    
    // Service role client for admin operations
    supabaseServiceClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          persistSession: false,
        }
      }
    );
    
    console.log('✅ Supabase clients initialized successfully');
  } else {
    console.log('⚠️ Supabase clients created with placeholder configuration');
    // Create placeholder clients for development
    supabaseClient = {
      from: () => ({ select: () => Promise.resolve({ data: [], error: new Error('Placeholder client - configure Supabase credentials') }) })
    };
    supabaseServiceClient = supabaseClient;
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase clients:', error.message);
  // Create placeholder clients to prevent crashes
  supabaseClient = {
    from: () => ({ select: () => Promise.resolve({ data: [], error: new Error('Supabase initialization failed') }) })
  };
  supabaseServiceClient = supabaseClient;
}

/**
 * Get the anonymous Supabase client
 * @returns {Object} Supabase client instance
 */
const getSupabaseClient = () => {
  return supabaseClient;
};

/**
 * Get the service role Supabase client (for admin operations)
 * @returns {Object} Supabase service client instance
 */
const getSupabaseServiceClient = () => {
  return supabaseServiceClient;
};

/**
 * Test database connection with a simple query
 * @returns {Promise<Object>} Connection test result
 */
const testConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Try to query a system table that should always exist
    const { data, error } = await supabaseClient
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
    
    if (error) {
      return {
        success: false,
        message: 'Supabase connection test failed',
        error: error.message
      };
    }
    
    return {
      success: true,
      message: 'Supabase connection successful',
      data: data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Supabase connection test error',
      error: error.message
    };
  }
};

/**
 * Validate environment variables are properly configured
 * @returns {Object} Validation result
 */
const validateConfig = () => {
  const isValid = validateEnvironment();
  return {
    isValid,
    message: isValid 
      ? 'Environment variables are properly configured' 
      : 'Some environment variables are missing or using placeholder values'
  };
};

module.exports = {
  getSupabaseClient,
  getSupabaseServiceClient,
  testConnection,
  validateConfig,
  // Direct access to clients (use getters for better practices)
  supabase: supabaseClient,
  supabaseService: supabaseServiceClient
}; 