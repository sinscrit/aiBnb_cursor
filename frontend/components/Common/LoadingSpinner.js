/**
 * Loading Spinner Component
 * QR Code-Based Instructional System - Frontend Loading States
 * Task 25.4: Implement Frontend Loading State Management
 */

import React from 'react';

/**
 * Loading Spinner Sizes
 */
export const SPINNER_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra-large'
};

/**
 * Loading Spinner Variants
 */
export const SPINNER_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  WHITE: 'white'
};

/**
 * Loading Spinner Component
 * @param {Object} props - Component props
 * @param {string} props.size - Spinner size (small, medium, large, extra-large)
 * @param {string} props.variant - Spinner color variant
 * @param {string} props.message - Loading message to display
 * @param {boolean} props.centered - Center the spinner
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @returns {JSX.Element} Loading spinner component
 */
const LoadingSpinner = ({
  size = SPINNER_SIZES.MEDIUM,
  variant = SPINNER_VARIANTS.PRIMARY,
  message = '',
  centered = false,
  className = '',
  style = {},
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    [SPINNER_SIZES.SMALL]: 'w-4 h-4',
    [SPINNER_SIZES.MEDIUM]: 'w-8 h-8',
    [SPINNER_SIZES.LARGE]: 'w-12 h-12',
    [SPINNER_SIZES.EXTRA_LARGE]: 'w-16 h-16'
  };

  // Variant classes
  const variantClasses = {
    [SPINNER_VARIANTS.PRIMARY]: 'text-blue-600',
    [SPINNER_VARIANTS.SECONDARY]: 'text-gray-600',
    [SPINNER_VARIANTS.SUCCESS]: 'text-green-600',
    [SPINNER_VARIANTS.WARNING]: 'text-yellow-600',
    [SPINNER_VARIANTS.ERROR]: 'text-red-600',
    [SPINNER_VARIANTS.WHITE]: 'text-white'
  };

  // Build CSS classes
  const spinnerClasses = [
    'animate-spin',
    sizeClasses[size] || sizeClasses[SPINNER_SIZES.MEDIUM],
    variantClasses[variant] || variantClasses[SPINNER_VARIANTS.PRIMARY],
    className
  ].join(' ');

  const containerClasses = [
    'flex items-center',
    centered ? 'justify-center' : '',
    message ? 'space-x-2' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={style} {...props}>
      {/* Spinner SVG */}
      <svg
        className={spinnerClasses}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="img"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      {/* Loading Message */}
      {message && (
        <span className="text-sm text-gray-600 select-none">
          {message}
        </span>
      )}
    </div>
  );
};

/**
 * Inline Loading Spinner (for buttons, small spaces)
 * @param {Object} props - Component props
 * @returns {JSX.Element} Inline spinner component
 */
export const InlineSpinner = (props) => (
  <LoadingSpinner
    size={SPINNER_SIZES.SMALL}
    {...props}
  />
);

/**
 * Page Loading Spinner (for full page loading)
 * @param {Object} props - Component props
 * @returns {JSX.Element} Page spinner component
 */
export const PageSpinner = ({ message = 'Loading page...', ...props }) => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner
      size={SPINNER_SIZES.LARGE}
      message={message}
      centered
      {...props}
    />
  </div>
);

/**
 * Button Loading Spinner (for loading buttons)
 * @param {Object} props - Component props
 * @returns {JSX.Element} Button spinner component
 */
export const ButtonSpinner = (props) => (
  <LoadingSpinner
    size={SPINNER_SIZES.SMALL}
    variant={SPINNER_VARIANTS.WHITE}
    {...props}
  />
);

/**
 * Card Loading Spinner (for loading cards/components)
 * @param {Object} props - Component props
 * @returns {JSX.Element} Card spinner component
 */
export const CardSpinner = ({ message = 'Loading...', ...props }) => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner
      size={SPINNER_SIZES.MEDIUM}
      message={message}
      centered
      {...props}
    />
  </div>
);

/**
 * Dots Loading Animation (alternative to spinner)
 * @param {Object} props - Component props
 * @returns {JSX.Element} Dots animation component
 */
export const LoadingDots = ({ className = '', ...props }) => (
  <div className={`flex space-x-1 ${className}`} {...props}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
        style={{
          animationDelay: `${i * 0.2}s`,
          animationDuration: '1s'
        }}
      />
    ))}
  </div>
);

/**
 * Skeleton Loading Component (for content placeholders)
 * @param {Object} props - Component props
 * @returns {JSX.Element} Skeleton component
 */
export const SkeletonLoader = ({
  lines = 3,
  height = '1rem',
  className = '',
  ...props
}) => (
  <div className={`animate-pulse space-y-2 ${className}`} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="bg-gray-300 rounded"
        style={{
          height,
          width: i === lines - 1 ? '75%' : '100%'
        }}
      />
    ))}
  </div>
);

export default LoadingSpinner; 