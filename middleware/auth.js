/**
 * Authentication Middleware - Demo User Authentication for MVP1
 * QR Code-Based Instructional System - Mock Authentication System
 */

const DemoUserService = require('../services/DemoUserService');

/**
 * Demo authentication middleware that sets the demo user
 * Bypasses actual JWT validation for MVP1 simplicity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateDemo = (req, res, next) => {
  try {
    // Skip authentication for health check and public routes
    if (req.path === '/health' || req.path.startsWith('/api/public/')) {
      return next();
    }
    
    console.log('🎭 Demo Auth: Setting demo user for request');
    
    // Get demo user ID from header or use default
    const demoUserId = req.headers['x-demo-user'] || DemoUserService.getDemoUserId();
    
    // Validate that the user ID matches our demo user
    if (demoUserId !== DemoUserService.getDemoUserId()) {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'Invalid demo user ID',
        details: 'The provided demo user ID does not match the expected value'
      });
    }
    
    // Set demo user in request object
    const demoUser = DemoUserService.getCurrentUser();
    const demoSession = DemoUserService.getDemoSession();
    
    // Add user and session to request object
    req.user = demoUser;
    req.session = demoSession;
    req.authenticated = true;
    req.demo_mode = true;
    
    // Add helper functions to request
    req.getUserId = () => demoUser.id;
    req.isDemoUser = () => true;
    req.hasPermission = (permission) => demoSession.permissions.includes(permission);
    
    // Log the demo authentication
    console.log(`   User: ${demoUser.name} (${demoUser.email})`);
    console.log(`   Session: ${demoSession.session_type}`);
    
    next();
  } catch (error) {
    console.error('❌ Demo authentication error:', error.message);
    res.status(500).json({
      error: 'Authentication Error',
      message: 'Demo user authentication failed',
      details: error.message
    });
  }
};

/**
 * Optional authentication middleware - sets user if available but doesn't require it
 * Used for routes that work for both authenticated and anonymous users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = (req, res, next) => {
  try {
    // Check if this is a QR code access route (should work anonymously)
    if (req.path.includes('/qr/') || req.path.includes('/content/')) {
      console.log('🔍 QR/Content access: Allowing anonymous access');
      req.authenticated = false;
      req.demo_mode = true;
      req.anonymous_access = true;
      return next();
    }
    
    // For other routes, apply demo authentication
    authenticateDemo(req, res, next);
  } catch (error) {
    // If optional auth fails, continue without authentication
    console.warn('⚠️ Optional auth failed, continuing without authentication:', error.message);
    req.authenticated = false;
    req.demo_mode = true;
    next();
  }
};

/**
 * Require authentication middleware - ensures user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAuth = (req, res, next) => {
  authenticateDemo(req, res, (err) => {
    if (err) {
      return next(err);
    }
    
    if (!req.authenticated || !req.user) {
      return res.status(401).json({
        error: 'Authentication Required',
        message: 'This endpoint requires authentication',
        demo_mode: true
      });
    }
    
    next();
  });
};

/**
 * Check if user owns a resource (for demo mode, always allow demo user)
 * @param {string} userId - User ID to check
 * @param {Object} req - Express request object
 * @returns {boolean} True if user owns the resource
 */
const checkOwnership = (userId, req) => {
  if (!req.authenticated || !req.user) {
    return false;
  }
  
  // In demo mode, only check if it's the demo user
  return DemoUserService.isDemoUser(req.user.id) && DemoUserService.isDemoUser(userId);
};

/**
 * Ownership validation middleware
 * @param {Function} getUserIdFromRequest - Function to extract user ID from request
 * @returns {Function} Express middleware function
 */
const validateOwnership = (getUserIdFromRequest) => {
  return (req, res, next) => {
    try {
      const resourceUserId = getUserIdFromRequest(req);
      
      if (!resourceUserId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Could not determine resource ownership'
        });
      }
      
      if (!checkOwnership(resourceUserId, req)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to access this resource',
          demo_mode: true
        });
      }
      
      next();
    } catch (error) {
      console.error('❌ Ownership validation error:', error.message);
      res.status(500).json({
        error: 'Authorization Error',
        message: 'Could not validate resource ownership',
        details: error.message
      });
    }
  };
};

/**
 * Demo mode header middleware - adds demo mode indicators to responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const addDemoHeaders = (req, res, next) => {
  // Add demo mode headers to all responses
  res.set({
    'X-Demo-Mode': 'true',
    'X-Demo-User': DemoUserService.DEMO_USER_EMAIL,
    'X-MVP-Version': '1.0',
    'X-Auth-Type': 'demo'
  });
  
  next();
};

/**
 * Create middleware for specific resource ownership validation
 */
const createOwnershipValidator = {
  // Property ownership validator
  property: validateOwnership((req) => {
    // For property routes, we might get user_id from property data
    // This would typically be resolved by looking up the property
    return DemoUserService.getDemoUserId();
  }),
  
  // Item ownership validator (through property ownership)
  item: validateOwnership((req) => {
    // For item routes, ownership is through the property
    return DemoUserService.getDemoUserId();
  }),
  
  // QR code ownership validator (through item/property ownership)
  qrCode: validateOwnership((req) => {
    // For QR code routes, ownership is through item/property chain
    return DemoUserService.getDemoUserId();
  })
};

module.exports = {
  authenticateDemo,
  optionalAuth,
  requireAuth,
  checkOwnership,
  validateOwnership,
  addDemoHeaders,
  createOwnershipValidator,
  
  // Utility functions
  getDemoUser: DemoUserService.getCurrentUser,
  isDemoMode: () => true, // Always true in MVP1
}; 