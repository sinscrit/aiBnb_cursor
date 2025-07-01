/**
 * Loading State Management Utilities
 * QR Code-Based Instructional System - Frontend Loading States
 * Task 25.4: Implement Frontend Loading State Management
 */

/**
 * Loading state types
 */
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

/**
 * Loading operations types
 */
export const LOADING_OPERATIONS = {
  FETCH_PROPERTIES: 'fetchProperties',
  CREATE_PROPERTY: 'createProperty',
  UPDATE_PROPERTY: 'updateProperty',
  DELETE_PROPERTY: 'deleteProperty',
  FETCH_ITEMS: 'fetchItems',
  CREATE_ITEM: 'createItem',
  UPDATE_ITEM: 'updateItem',
  DELETE_ITEM: 'deleteItem',
  GENERATE_QR: 'generateQR',
  FETCH_QR_CODES: 'fetchQRCodes',
  DOWNLOAD_QR: 'downloadQR',
  FETCH_CONTENT: 'fetchContent'
};

/**
 * Create initial loading state
 * @param {string} operation - Operation name
 * @returns {Object} Initial loading state
 */
export const createInitialState = (operation) => ({
  [operation]: {
    state: LOADING_STATES.IDLE,
    message: '',
    error: null,
    startTime: null,
    endTime: null
  }
});

/**
 * Create loading state reducer
 * @param {Object} state - Current state
 * @param {Object} action - Action to dispatch
 * @returns {Object} New state
 */
export const loadingReducer = (state, action) => {
  const { type, operation, message, error } = action;
  
  switch (type) {
    case 'START_LOADING':
      return {
        ...state,
        [operation]: {
          state: LOADING_STATES.LOADING,
          message: message || `Loading ${operation}...`,
          error: null,
          startTime: Date.now(),
          endTime: null
        }
      };
      
    case 'SET_SUCCESS':
      return {
        ...state,
        [operation]: {
          ...state[operation],
          state: LOADING_STATES.SUCCESS,
          message: message || `${operation} completed successfully`,
          error: null,
          endTime: Date.now()
        }
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        [operation]: {
          ...state[operation],
          state: LOADING_STATES.ERROR,
          message: message || `${operation} failed`,
          error: error || 'Unknown error occurred',
          endTime: Date.now()
        }
      };
      
    case 'RESET_LOADING':
      return {
        ...state,
        [operation]: {
          state: LOADING_STATES.IDLE,
          message: '',
          error: null,
          startTime: null,
          endTime: null
        }
      };
      
    default:
      return state;
  }
};

/**
 * Calculate loading duration
 * @param {Object} loadingState - Loading state object
 * @returns {number|null} Duration in milliseconds
 */
export const getLoadingDuration = (loadingState) => {
  if (!loadingState.startTime) return null;
  const endTime = loadingState.endTime || Date.now();
  return endTime - loadingState.startTime;
};

/**
 * Check if operation is currently loading
 * @param {Object} state - Loading state
 * @param {string} operation - Operation name
 * @returns {boolean} Is loading
 */
export const isLoading = (state, operation) => {
  return state[operation]?.state === LOADING_STATES.LOADING;
};

/**
 * Check if operation succeeded
 * @param {Object} state - Loading state
 * @param {string} operation - Operation name
 * @returns {boolean} Is success
 */
export const isSuccess = (state, operation) => {
  return state[operation]?.state === LOADING_STATES.SUCCESS;
};

/**
 * Check if operation failed
 * @param {Object} state - Loading state
 * @param {string} operation - Operation name
 * @returns {boolean} Has error
 */
export const hasError = (state, operation) => {
  return state[operation]?.state === LOADING_STATES.ERROR;
};

/**
 * Get error message for operation
 * @param {Object} state - Loading state
 * @param {string} operation - Operation name
 * @returns {string|null} Error message
 */
export const getError = (state, operation) => {
  return state[operation]?.error || null;
};

/**
 * Get message for operation
 * @param {Object} state - Loading state
 * @param {string} operation - Operation name
 * @returns {string} Message
 */
export const getMessage = (state, operation) => {
  return state[operation]?.message || '';
};

/**
 * Loading timeout configuration
 */
export const LOADING_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  QUICK: 10000,   // 10 seconds
  UPLOAD: 60000,  // 60 seconds for file uploads
  DOWNLOAD: 45000 // 45 seconds for downloads
};

/**
 * Create loading timeout handler
 * @param {Function} timeoutCallback - Callback to execute on timeout
 * @param {number} timeout - Timeout duration in milliseconds
 * @returns {number} Timeout ID
 */
export const createLoadingTimeout = (timeoutCallback, timeout = LOADING_TIMEOUTS.DEFAULT) => {
  return setTimeout(timeoutCallback, timeout);
};

/**
 * Clear loading timeout
 * @param {number} timeoutId - Timeout ID to clear
 */
export const clearLoadingTimeout = (timeoutId) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
}; 