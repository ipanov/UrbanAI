import React, { useState } from 'react';
import { Shield, Lock, Users, Building, TrendingUp } from 'lucide-react';
import { UrbanAILogoPlaceholder } from './UrbanAILogo';
import CookieConsentBanner from './CookieConsentBanner';
import { BRAND_COLORS } from '../assets/brand';
import './OAuthLoginPage.css';

interface OAuthLoginPageProps {
  onOAuthLogin?: (provider: 'microsoft' | 'google' | 'facebook') => void;
  onGuestAccess?: () => void;
}

const OAuthLoginPage: React.FC<OAuthLoginPageProps> = ({
  onOAuthLogin,
  onGuestAccess
}) => {
  const [selectedUserType, setSelectedUserType] = useState<'citizen' | 'investor' | 'authority' | null>(null);

  const handleOAuthClick = (provider: 'microsoft' | 'google' | 'facebook') => {
    onOAuthLogin?.(provider);
  };

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

  return (
    <div className="oauth-login-page">
      <div className="login-container">
        {/* Header with Logo */}
        <header className="login-header">
          <UrbanAILogoPlaceholder variant="primary" size={32} className="login-logo" />
          <div className="header-text">
            <h1>Welcome to UrbanAI</h1>
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
                  className={`user-type-card ${
                    selectedUserType === type.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedUserType(type.id)}
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
            >
              <div className="oauth-icon">🏢</div>
              <span>Continue with Microsoft</span>
            </button>
            
            <button 
              className="oauth-btn oauth-btn--google"
              onClick={() => handleOAuthClick('google')}
            >
              <div className="oauth-icon">🔵</div>
              <span>Continue with Google</span>
            </button>
            
            <button 
              className="oauth-btn oauth-btn--facebook"
              onClick={() => handleOAuthClick('facebook')}
            >
              <div className="oauth-icon">🟦</div>
              <span>Continue with Facebook</span>
            </button>
          </div>
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
    </div>
  );
};

export default OAuthLoginPage;
