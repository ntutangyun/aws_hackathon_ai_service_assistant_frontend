/**
 * API Configuration
 * Dynamically determines the backend API URL based on the deployment environment
 */

const getApiUrl = () => {
  // Get the current hostname
  const hostname = window.location.hostname;
  const origin = window.location.origin;

  // Check if we're running on localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }

  // Check if we're hosted on AWS Amplify
  if (hostname.includes('amplifyapp.com')) {
    return 'https://2629vr8fyj.us-east-1.awsapprunner.com';
  }

  // Check for custom domain (optional - adjust as needed)
  // if (hostname.includes('yourdomain.com')) {
  //   return 'https://wdmniyiwug.us-east-1.awsapprunner.com';
  // }

  // Fallback to environment variable or localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:8000';
};

// Export the API URL
export const API_URL = getApiUrl();

// Log the API URL for debugging (remove in production)
console.log('🌐 API Endpoint:', API_URL);
console.log('📍 Current Host:', window.location.hostname);

export default {
  API_URL,
  getApiUrl
};
