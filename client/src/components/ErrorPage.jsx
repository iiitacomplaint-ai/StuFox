/**
 * ErrorPage Component
 * UPDATED: Converted from generic error page to college complaint system styling
 * UPDATED: Changed color scheme to match complaint system (purple/indigo theme)
 * UPDATED: Added navigation back to dashboard option
 * UPDATED: Added support for different error types (404, 403, 500, etc.)
 * UPDATED: Added go back button as alternative to refresh
 * UPDATED: Improved error message display with optional error code
 * UPDATED: Added contact support information
 * 
 * @description Error page component for displaying various error states in the complaint system
 * @version 2.0.0 (Updated for complaint management system)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Inline SVG for AlertTriangle
const AlertTriangle = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

// Inline SVG for ShieldAlert
const ShieldAlert = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// Inline SVG for FileSearch
const FileSearch = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
);

// Inline SVG for ServerCrash
const ServerCrash = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="8" y1="22" x2="16" y2="22"/>
    <circle cx="12" cy="6" r="2"/>
    <circle cx="12" cy="18" r="2"/>
  </svg>
);

/**
 * ErrorPage Component
 * @param {Object} props - Component props
 * @param {string} [props.type="error"] - Error type: 'error', '404', '403', '500'
 * @param {string} [props.message="Something went wrong!"] - Custom error message
 * @param {number} [props.errorCode] - Optional error code to display
 * @param {string} [props.title] - Custom title for the error page
 */
const ErrorPage = ({ 
  type = "error", 
  message = "Something went wrong!", 
  errorCode = null,
  title = null 
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoHome = () => {
    navigate('/dashboard'); // Navigate to dashboard
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Configuration based on error type
  const errorConfig = {
    error: {
      icon: <AlertTriangle size={80} className="text-purple-600 mb-6" />,
      defaultTitle: "Oops! An Error Occurred",
      color: "purple",
      buttonText: "Refresh Page",
      buttonAction: handleRefresh
    },
    404: {
      icon: <FileSearch size={80} className="text-yellow-600 mb-6" />,
      defaultTitle: "Page Not Found",
      color: "yellow",
      buttonText: "Go Back",
      buttonAction: handleGoBack
    },
    403: {
      icon: <ShieldAlert size={80} className="text-red-600 mb-6" />,
      defaultTitle: "Access Denied",
      color: "red",
      buttonText: "Go to Dashboard",
      buttonAction: handleGoHome
    },
    500: {
      icon: <ServerCrash size={80} className="text-orange-600 mb-6" />,
      defaultTitle: "Server Error",
      color: "orange",
      buttonText: "Try Again",
      buttonAction: handleRefresh
    }
  };

  const config = errorConfig[type] || errorConfig.error;
  const displayTitle = title || config.defaultTitle;
  
  // Button color based on error type
  const buttonColors = {
    purple: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
    yellow: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    red: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    orange: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-md w-full text-center transform transition-all">
        {/* Error Icon */}
        <div className="mb-4">
          {config.icon}
        </div>

        {/* Error Code (if provided) */}
        {errorCode && (
          <div className="mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              Error {errorCode}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="mt-2 text-3xl font-extrabold text-gray-800">
          {displayTitle}
        </h2>

        {/* Error Message */}
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          {message}
        </p>

        {/* Help Text */}
        <p className="mt-2 text-sm text-gray-500">
          If the problem persists, please contact support.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={config.buttonAction}
            className={`px-6 py-3 ${buttonColors[config.color]} text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75 flex-1`}
          >
            {config.buttonText}
          </button>
          
          {type !== 'error' && (
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 flex-1"
            >
              Refresh Page
            </button>
          )}
        </div>

        {/* Support Contact */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Need help? Contact us at <a href="mailto:support@collegecomplaint.edu" className="text-purple-600 hover:underline">support@collegecomplaint.edu</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;