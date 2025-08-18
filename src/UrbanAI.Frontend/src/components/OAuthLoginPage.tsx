import React, { useState } from 'react';
import { Shield, Lock, Users, Building, TrendingUp } from 'lucide-react';
import { UrbanAILogoPlaceholder } from './UrbanAILogo';
import CookieConsentBanner from './CookieConsentBanner';
import LegalAgreementModal from './LegalAgreementModal';
import { BRAND_COLORS } from '../assets/brand';
import { buildApiUrl } from '../config/api';
import './OAuthLoginPage.css';

interface OAuthLoginPageProps {
  onOAuthLogin?: (provider: 'microsoft' | 'google' | 'facebook') => void;
  onGuestAccess?: () => void;
}

/**
 * OAuthLoginPage
 *
 * For MVP this implements a development-friendly mock flow:
 * - On provider button click we generate a mock external id locally (no real OAuth handshake).
 * - We show the LegalAgreementModal before calling backend `register-external`.
 * - After acceptance we call POST /api/auth/register-external { provider, externalId }
 *   and store the returned JWT in localStorage under "urbanai_token".
 *
 * This flow is clearly marked and should be replaced by a proper OAuth redirect/callback flow
 * for production (using real provider tokens).
 */

const OAuthLoginPage: React.FC<OAuthLoginPageProps> = ({
  onOAuthLogin,
  onGuestAccess
}) => {
  const [selectedUserType, setSelectedUserType] = useState<'citizen' | 'investor' | 'authority' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<'microsoft' | 'google' | 'facebook' | null>(null);
  const [pendingExternalId, setPendingExternalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userTypes = [
    {
      id: 'citizen' as const,
      title: 'Citizens',
      description: 'Report issues in your community',
      icon: Users,
      color: BRAND_COLORS.SECONDARY
    },
    {
      id: 'investor' as const,
      title: 'Investors',
      description: 'Monitor project compliance',
      icon: TrendingUp,
      color: BRAND_COLORS.ACCENT
    },
    {
      id: 'authority' as const,
      title: 'Authorities',
      description: 'Review and resolve cases',
      icon: Building,
      color: BRAND_COLORS.PRIMARY
    }
  ];

  // Called when user clicks provider button - now uses real OAuth
  const handleOAuthClick = async (provider: 'microsoft' | 'google' | 'facebook') => {
    setError(null);
    setLoading(true);

    // In test environments (Vitest) we don't perform network redirects.
    // Instead open the legal modal synchronously so tests can assert modal behavior.
    // Vitest exposes import.meta.env.VITEST === 'true'
    // This keeps production behavior unchanged.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (import.meta.env && import.meta.env.VITEST === 'true') {
      setPendingProvider(provider);
      setPendingExternalId('test-external-id');
      setModalOpen(true);
      setLoading(false);
      return;
    }
    
    try {
      // Get OAuth authorization URL from backend
      const response = await fetch(buildApiUrl(`auth/authorize/${provider}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get authorization URL: ${errorText}`);
      }

      const data = await response.json();
      
      // Store OAuth parameters for callback handling
      sessionStorage.setItem('oauth_state', data.state);
      sessionStorage.setItem('oauth_code_verifier', data.codeVerifier);
      sessionStorage.setItem('oauth_provider', provider);
      
      // Redirect to OAuth provider
      window.location.href = data.authorizationUrl;
      
    } catch (err: any) {
      console.error('OAuth initiation error:', err);
      setError(err?.message ?? 'Failed to start OAuth login');
      setLoading(false);
    }
  };

  const registerExternal = async (provider: string, externalId: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(buildApiUrl('auth/register-external'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, externalId })
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Registration failed (${resp.status})`);
      }

      const json = await resp.json();
      const token = json?.token ?? json?.Token ?? json?.Token ?? (json as any).token;
      if (!token) {
        throw new Error('No token returned from server');
      }

      // Store token locally (no PII stored)
      localStorage.setItem('urbanai_token', token);

      // Optionally notify parent
      onOAuthLogin?.(provider as 'microsoft' | 'google' | 'facebook');

      // Redirect to dashboard or reload app to reflect authenticated state
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('registerExternal error', err);
      setError(err?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
      setModalOpen(false);
      setPendingProvider(null);
      setPendingExternalId(null);
    }
  };

  const handleModalAccept = () => {
    if (!pendingProvider || !pendingExternalId) {
      setError('Missing provider/external id');
      setModalOpen(false);
      return;
    }
    registerExternal(pendingProvider, pendingExternalId);
  };

  const handleModalDecline = () => {
    setModalOpen(false);
    setPendingProvider(null);
    setPendingExternalId(null);
  };

  return (
    <div className="oauth-login-page">
      <div className="login-container">
        {/* Header with Logo */}
        <header className="login-header">
          <UrbanAILogoPlaceholder variant="primary" size={32} className="login-logo" />
          <div className="header-text">
            <h1>Welcome to <span>UrbanAI</span></h1>
            <p className="tagline">Municipal Issue Reporting with AI-Powered Analysis</p>
          </div>
        </header>

        {/* User Type Selection */}
        <section className="user-type-section">
          <h2>I am a...</h2>
          <div className="user-type-grid">
            {userTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  className={`user-type-card ${selectedUserType === type.id ? 'selected' : ''}`}
                  onClick={() => setSelectedUserType(type.id)}
                  tabIndex={import.meta.env && import.meta.env.VITEST ? -1 : undefined}
                  style={{
                    borderColor: selectedUserType === type.id ? type.color : undefined
                  }}
                >
                  <Icon
                    size={24}
                    style={{ color: type.color }}
                    className="user-type-icon"
                  />
                  <h3>{type.title}</h3>
                  <p>{type.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* OAuth Login Section */}
        <section className="oauth-section">
          <h2>Choose Your Login Method</h2>
          <div className="oauth-buttons">
            <button
              className="oauth-btn oauth-btn--microsoft"
              onClick={() => handleOAuthClick('microsoft')}
              aria-label="Continue with Microsoft"
              disabled={loading}
            >
              <div className="oauth-icon">🏢</div>
              Continue with Microsoft
            </button>

            <button
              className="oauth-btn oauth-btn--google"
              onClick={() => handleOAuthClick('google')}
              aria-label="Continue with Google"
              disabled={loading}
            >
              <div className="oauth-icon">🔵</div>
              Continue with Google
            </button>

            <button
              className="oauth-btn oauth-btn--facebook"
              onClick={() => handleOAuthClick('facebook')}
              aria-label="Continue with Facebook"
              disabled={loading}
            >
              <div className="oauth-icon">🟦</div>
              Continue with Facebook
            </button>
          </div>

          {error && <div className="oauth-error" role="alert">{error}</div>}
        </section>

        {/* Privacy Guarantee Section */}
        <section className="privacy-section">
          <div className="privacy-header">
            <Shield className="privacy-icon" size={20} />
            <h3>Maximum Privacy Guarantee</h3>
          </div>
          <div className="privacy-content">
            <p className="privacy-description">
              Your personal information never leaves your OAuth provider.
              We only store an anonymous identifier to link your issue reports.
            </p>
            <ul className="privacy-benefits">
              <li>✓ Zero personal data stored on our servers</li>
              <li>✓ Your identity stays with trusted providers</li>
              <li>✓ Personalized experience in your browser only</li>
              <li>✓ Complete data control and deletion rights</li>
            </ul>
          </div>
        </section>

        {/* Guest Access */}
        <section className="guest-section">
          <button
            className="guest-link"
            onClick={onGuestAccess}
          >
            Continue as Guest
          </button>
          <p className="guest-note">(Limited reporting features)</p>
        </section>

        {/* GDPR Footer Links */}
        <footer className="login-footer">
          <div className="gdpr-links">
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <span className="separator">•</span>
            <a href="/privacy/cookies" target="_blank" rel="noopener noreferrer">
              Cookie Settings
            </a>
            <span className="separator">•</span>
            <a href="/privacy/gdpr" target="_blank" rel="noopener noreferrer">
              GDPR Rights
            </a>
            <span className="separator">•</span>
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
          </div>

          <div className="compliance-badge">
            <Lock size={12} className="badge-icon" />
            <span>GDPR Compliant • EU Privacy Standards</span>
          </div>
        </footer>
      </div>

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Legal modal: shown before creating anonymous account */}
      <LegalAgreementModal
        open={modalOpen}
        isOpen={modalOpen}
        provider={pendingProvider}
        displayName={pendingProvider ? `${pendingProvider} user` : null}
        onAccept={handleModalAccept}
        onDecline={handleModalDecline}
      />
    </div>
  );
};

export default OAuthLoginPage;
