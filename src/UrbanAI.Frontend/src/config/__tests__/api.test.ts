import { vi, describe, it, expect, beforeEach } from 'vitest';
import { API_CONFIG, APP_CONFIG, buildApiUrl, buildOAuthUrl, validateConfig } from '../api';

describe('API Configuration', () => {
  beforeEach(() => {
    // Reset environment variables to default values
    vi.resetModules();
  });

  describe('API_CONFIG', () => {
    it('should have default values for development', () => {
      expect(API_CONFIG.baseUrl).toBe('http://localhost:5001');
      expect(API_CONFIG.oauth.redirectUri).toBe('http://localhost:3000/auth/callback');
    });

    it('should use environment variables when available', async () => {
      // Create a mock module to test environment variable usage
      vi.stubEnv('VITE_API_BASE_URL', 'https://api.test.com');
      vi.stubEnv('VITE_OAUTH_REDIRECT_URI', 'https://test.com/callback');
      
      // Re-import to get updated values
      const { API_CONFIG: TestAPI_CONFIG } = await import('../api');
      
      expect(TestAPI_CONFIG.baseUrl).toBe('https://api.test.com');
      expect(TestAPI_CONFIG.oauth.redirectUri).toBe('https://test.com/callback');
      
      // Restore original environment
      vi.unstubAllEnvs();
    });
  });

  describe('APP_CONFIG', () => {
    it('should detect development environment', () => {
      expect(APP_CONFIG.environment).toBe('development');
      expect(APP_CONFIG.debug).toBe(false);
    });
  });

  describe('URL Building', () => {
    it('should build API URLs correctly', () => {
      const url = buildApiUrl('auth/login');
      expect(url).toBe('http://localhost:5001/auth/login');
    });

    it('should handle leading slashes in endpoints', () => {
      const url = buildApiUrl('/auth/login');
      expect(url).toBe('http://localhost:5001/auth/login');
    });

    it('should build OAuth URLs correctly', () => {
      const url = buildOAuthUrl('auth/google/callback');
      expect(url).toBe('http://localhost:5001/auth/google/callback');
    });
  });

  describe('Configuration Validation', () => {
    it('should validate configuration correctly', () => {
      expect(validateConfig()).toBe(true);
    });
  });
});
