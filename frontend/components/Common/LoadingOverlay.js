/**
 * Loading Overlay Component
 * QR Code-Based Instructional System - Frontend Loading States
 * Task 25.4: Implement Frontend Loading State Management
 */

import React from 'react';
import LoadingSpinner, { SPINNER_SIZES, SPINNER_VARIANTS } from './LoadingSpinner';

/**
 * Loading Overlay Types
 */
export const OVERLAY_TYPES = {
  FULL_PAGE: 'full-page',
  MODAL: 'modal',
  COMPONENT: 'component',
  CARD: 'card'
};

/**
 * Loading Overlay Component
 * @param {Object} props - Component props
 * @param {boolean} props.show - Show/hide overlay
 * @param {string} props.type - Overlay type (full-page, modal, component, card)
 * @param {string} props.message - Loading message
 * @param {string} props.spinnerSize - Spinner size
 * @param {string} props.spinnerVariant - Spinner color variant
 * @param {boolean} props.blur - Add backdrop blur effect
 * @param {boolean} props.dimmed - Dim the background
 * @param {Function} props.onCancel - Cancel handler (adds cancel button)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {React.ReactNode} props.children - Custom content
 * @returns {JSX.Element|null} Loading overlay component
 */
const LoadingOverlay = ({
  show = false,
  type = OVERLAY_TYPES.COMPONENT,
  message = 'Loading...',
  spinnerSize = SPINNER_SIZES.LARGE,
  spinnerVariant = SPINNER_VARIANTS.PRIMARY,
  blur = false,
  dimmed = true,
  onCancel = null,
  className = '',
  style = {},
  children,
  ...props
}) => {
  // Don't render if not shown
  if (!show) return null;

  // Type-specific configurations
  const typeConfigs = {
    [OVERLAY_TYPES.FULL_PAGE]: {
      position: 'fixed inset-0 z-50',
      background: 'bg-white bg-opacity-80',
      padding: 'p-8',
      spinner: SPINNER_SIZES.EXTRA_LARGE
    },
    [OVERLAY_TYPES.MODAL]: {
      position: 'fixed inset-0 z-40',
      background: 'bg-black bg-opacity-50',
      padding: 'p-8',
      spinner: SPINNER_SIZES.LARGE
    },
    [OVERLAY_TYPES.COMPONENT]: {
      position: 'absolute inset-0 z-30',
      background: 'bg-white bg-opacity-90',
      padding: 'p-4',
      spinner: SPINNER_SIZES.MEDIUM
    },
    [OVERLAY_TYPES.CARD]: {
      position: 'absolute inset-0 z-20',
      background: 'bg-white bg-opacity-95',
      padding: 'p-6',
      spinner: SPINNER_SIZES.MEDIUM
    }
  };

  const config = typeConfigs[type] || typeConfigs[OVERLAY_TYPES.COMPONENT];

  // Build CSS classes
  const overlayClasses = [
    config.position,
    dimmed ? config.background : 'bg-transparent',
    blur ? 'backdrop-blur-sm' : '',
    'flex items-center justify-center',
    config.padding,
    className
  ].filter(Boolean).join(' ');

  // Handle escape key to cancel (if onCancel provided)
  React.useEffect(() => {
    if (!onCancel) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div className={overlayClasses} style={style} {...props}>
      <div className="flex flex-col items-center space-y-4 max-w-sm w-full">
        {/* Custom content or default spinner */}
        {children || (
          <LoadingSpinner
            size={spinnerSize || config.spinner}
            variant={spinnerVariant}
            message={message}
            centered
          />
        )}

        {/* Cancel button if onCancel provided */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 
                       border border-gray-300 rounded-md hover:bg-gray-50 
                       transition-colors duration-200 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Full Page Loading Overlay
 * @param {Object} props - Component props
 * @returns {JSX.Element|null} Full page overlay
 */
export const FullPageOverlay = ({ message = 'Loading page...', ...props }) => (
  <LoadingOverlay
    type={OVERLAY_TYPES.FULL_PAGE}
    message={message}
    spinnerVariant={SPINNER_VARIANTS.PRIMARY}
    {...props}
  />
);

/**
 * Modal Loading Overlay
 * @param {Object} props - Component props
 * @returns {JSX.Element|null} Modal overlay
 */
export const ModalOverlay = ({ message = 'Processing...', ...props }) => (
  <LoadingOverlay
    type={OVERLAY_TYPES.MODAL}
    message={message}
    spinnerVariant={SPINNER_VARIANTS.WHITE}
    blur
    {...props}
  />
);

/**
 * Component Loading Overlay
 * @param {Object} props - Component props
 * @returns {JSX.Element|null} Component overlay
 */
export const ComponentOverlay = ({ message = 'Loading...', ...props }) => (
  <LoadingOverlay
    type={OVERLAY_TYPES.COMPONENT}
    message={message}
    {...props}
  />
);

/**
 * Card Loading Overlay
 * @param {Object} props - Component props
 * @returns {JSX.Element|null} Card overlay
 */
export const CardOverlay = ({ message = 'Loading...', ...props }) => (
  <LoadingOverlay
    type={OVERLAY_TYPES.CARD}
    message={message}
    {...props}
  />
);

/**
 * Button Loading Overlay (for async button actions)
 * @param {Object} props - Component props
 * @returns {JSX.Element|null} Button overlay
 */
export const ButtonOverlay = ({ show, children, ...props }) => {
  if (!show) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 flex items-center justify-center 
                      bg-white bg-opacity-75 rounded">
        <LoadingSpinner
          size={SPINNER_SIZES.SMALL}
          variant={SPINNER_VARIANTS.PRIMARY}
        />
      </div>
    </div>
  );
};

/**
 * Custom Loading Message Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Loading message component
 */
export const LoadingMessage = ({
  message,
  submessage = '',
  progress = null,
  className = '',
  ...props
}) => (
  <div className={`text-center space-y-2 ${className}`} {...props}>
    {message && (
      <p className="text-lg font-medium text-gray-800">{message}</p>
    )}
    
    {submessage && (
      <p className="text-sm text-gray-600">{submessage}</p>
    )}
    
    {progress !== null && (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    )}
  </div>
);

/**
 * Progress Loading Overlay (with progress bar)
 * @param {Object} props - Component props
 * @returns {JSX.Element|null} Progress overlay
 */
export const ProgressOverlay = ({
  show,
  progress = 0,
  message = 'Processing...',
  submessage = '',
  ...props
}) => (
  <LoadingOverlay
    show={show}
    spinnerSize={SPINNER_SIZES.MEDIUM}
    {...props}
  >
    <LoadingMessage
      message={message}
      submessage={submessage}
      progress={progress}
    />
  </LoadingOverlay>
);

export default LoadingOverlay; 