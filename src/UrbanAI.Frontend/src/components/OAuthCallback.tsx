import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildApiUrl } from '../config/api';

interface OAuthCallbackProps {
  onSuccess?: (token: string) => void;
  onError?: (error: string) => void;
}

/**
 * OAuth Callback Component
 * Handles the return from OAuth providers and completes the authentication flow
 */
const OAuthCallback: React.FC<OAuthCallbackProps> = ({ onSuccess, onError }) => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;
    const handleOAuthCallback = async () => {
      try {
        // Get OAuth parameters from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle OAuth errors
        if (error) {
          const errorMessage = `OAuth Error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`;
          setError(errorMessage);
          onError?.(errorMessage);
          setLoading(false);
          return;
        }

        // Check required parameters
        if (!code || !state) {
          const errorMessage = 'Missing required OAuth parameters';
          setError(errorMessage);
          onError?.(errorMessage);
          setLoading(false);
          return;
        }

        // Get stored OAuth parameters
        const storedState = sessionStorage.getItem('oauth_state');
        const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
        const provider = sessionStorage.getItem('oauth_provider');

        // Validate state parameter (CSRF protection)
        if (state !== storedState) {
          const errorMessage = 'Invalid state parameter - possible CSRF attack';
          setError(errorMessage);
          onError?.(errorMessage);
          setLoading(false);
          return;
        }

        if (!provider || !codeVerifier) {
          const errorMessage = 'Missing stored OAuth parameters';
          setError(errorMessage);
          onError?.(errorMessage);
          setLoading(false);
          return;
        }

        // Handle the OAuth callback through our backend
        const callbackUrl = `${buildApiUrl('auth/callback')}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
        
        const response = await fetch(callbackUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OAuth callback failed: ${errorText}`);
        }

        const data = await response.json();
        
        // Now we have the user info, proceed with registration
        await registerUser(data.provider, data.externalId, data.name, data.email);

      } catch (err: any) {
        console.error('OAuth callback error:', err);
        const errorMessage = err?.message ?? 'OAuth authentication failed';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setLoading(false);
        // Clean up stored OAuth parameters
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_code_verifier');
        sessionStorage.removeItem('oauth_provider');
      }
    };

    handleOAuthCallback();
  }, [searchParams, onSuccess, onError]);

  const registerUser = async (provider: string, externalId: string, name: string, email: string) => {
    try {
      const response = await fetch(buildApiUrl('auth/register-external'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, externalId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Registration failed (${response.status})`);
      }

      const json = await response.json();
      const token = json?.token ?? json?.Token;
      
      if (!token) {
        throw new Error('No authentication token returned from server');
      }

      // Store token locally (no PII stored)
      localStorage.setItem('urbanai_token', token);
      
      // Notify parent component
      onSuccess?.(token);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      console.error('User registration error:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="oauth-callback-loading">
        <div className="loading-spinner"></div>
        <p>Completing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oauth-callback-error">
        <h2>Authentication Failed</h2>
        <p>{error}</p>
        <button onClick={() => window.location.href = '/login'}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="oauth-callback-success">
      <h2>Authentication Successful</h2>
      <p>Redirecting to dashboard...</p>
    </div>
  );
};

export default OAuthCallback;
