// API Configuration - Environment-aware configuration system
import { AppConfig, ApiConfig } from './types';

// Validate that required environment variables are present
const validateEnvVars = () => {
  const requiredVars = ['VITE_API_BASE_URL', 'VITE_OAUTH_REDIRECT_URI'];
  const missingVars: string[] = [];
  
  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Using default values for development.');
  }
};

// Initialize environment validation
validateEnvVars();

// Environment detection
const getEnvironment = (): 'development' | 'production' | 'staging' => {
  const env = import.meta.env.MODE;
  if (env === 'production') return 'production';
  if (env === 'staging') return 'staging';
  return 'development';
};

// API Configuration
export const API_CONFIG: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  oauth: {
    redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI || 'http://localhost:3000/auth/callback'
  }
};

// Complete Application Configuration
export const APP_CONFIG: AppConfig = {
  api: API_CONFIG,
  environment: getEnvironment(),
  debug: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.VITEST === true
};

// Helper functions for building API URLs
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_CONFIG.baseUrl}/${cleanEndpoint}`;
};

export const buildOAuthUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_CONFIG.baseUrl}/${cleanEndpoint}`;
};

// Configuration validation
export const validateConfig = (): boolean => {
  const errors: string[] = [];
  
  if (!API_CONFIG.baseUrl) {
    errors.push('API base URL is not configured');
  }
  
  if (!API_CONFIG.oauth.redirectUri) {
    errors.push('OAuth redirect URI is not configured');
  }
  
  if (errors.length > 0) {
    console.error('Configuration validation errors:', errors);
    return false;
  }
  
  return true;
};

// Log configuration in development mode
if (APP_CONFIG.environment === 'development') {
  console.log('API Configuration:', {
    baseUrl: API_CONFIG.baseUrl,
    redirectUri: API_CONFIG.oauth.redirectUri,
    environment: APP_CONFIG.environment,
    debug: APP_CONFIG.debug
  });
}
