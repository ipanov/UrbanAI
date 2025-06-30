import React, { useState, useEffect } from 'react';
import { X, Shield, Settings, Check } from 'lucide-react';
import './CookieConsentBanner.css';

interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: number;
  version: string;
}

interface CookieConsentBannerProps {
  onConsentChange?: (preferences: ConsentPreferences) => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    functional: false,
    marketing: false,
    timestamp: Date.now(),
    version: '1.0'
  });

  useEffect(() => {
    const existingConsent = localStorage.getItem('urbanai_cookie_consent');
    if (!existingConsent) {
      setShowBanner(true);
    } else {
      try {
        const consent = JSON.parse(existingConsent);
        const consentAge = Date.now() - consent.timestamp;
        const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
        
        if (consentAge > maxAge) {
          setShowBanner(true);
        } else {
          setPreferences(consent);
          onConsentChange?.(consent);
        }
      } catch {
        setShowBanner(true);
      }
    }
  }, [onConsentChange]);

  const saveConsent = (newPreferences: ConsentPreferences) => {
    localStorage.setItem('urbanai_cookie_consent', JSON.stringify(newPreferences));
    
    // Set consent cookie (essential)
    document.cookie = `urbanai_consent=${JSON.stringify({
      timestamp: newPreferences.timestamp,
      version: newPreferences.version
    })}; path=/; secure; samesite=strict; max-age=${365 * 24 * 60 * 60}`;
    
    setPreferences(newPreferences);
    onConsentChange?.(newPreferences);
  };

  const acceptAll = () => {
    const newPreferences: ConsentPreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    saveConsent(newPreferences);
    setShowBanner(false);
  };

  const rejectAll = () => {
    const newPreferences: ConsentPreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    saveConsent(newPreferences);
    setShowBanner(false);
  };

  const saveCustomPreferences = () => {
    const newPreferences: ConsentPreferences = {
      ...preferences,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    saveConsent(newPreferences);
    setShowSettings(false);
    setShowBanner(false);
  };

  const updateCategory = (category: keyof ConsentPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="cookie-consent-banner" role="dialog" aria-labelledby="cookie-banner-title">
        <div className="cookie-consent-content">
          <div className="cookie-consent-text">
            <div className="cookie-banner-header">
              <Shield className="privacy-icon" size={20} />
              <h2 id="cookie-banner-title">Your Privacy Matters</h2>
            </div>
            <p>
              We use cookies to provide essential functionality and, with your consent, 
              to analyze usage and improve our service. Your personal data stays with your 
              OAuth provider and is never stored on our servers.
            </p>
            <a 
              href="/privacy/cookies" 
              target="_blank" 
              rel="noopener noreferrer"
              className="privacy-link"
            >
              Learn more about our privacy-first approach
            </a>
          </div>
          
          <div className="cookie-consent-actions">
            <button 
              className="btn btn-outline"
              onClick={() => setShowSettings(true)}
              aria-label="Customize cookie settings"
            >
              <Settings size={16} />
              Customize
            </button>
            <button 
              className="btn btn-secondary"
              onClick={rejectAll}
            >
              Reject All
            </button>
            <button 
              className="btn btn-primary"
              onClick={acceptAll}
            >
              <Check size={16} />
              Accept All
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="cookie-settings-modal">
          <div className="modal-backdrop" onClick={() => setShowSettings(false)} />
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
            <header className="modal-header">
              <h2 id="cookie-settings-title">Cookie Preferences</h2>
              <button 
                className="modal-close"
                onClick={() => setShowSettings(false)}
                aria-label="Close cookie settings"
              >
                <X size={20} />
              </button>
            </header>
            
            <div className="modal-body">
              {/* Essential Cookies */}
              <div className="cookie-category">
                <div className="category-header">
                  <h3>Essential Cookies</h3>
                  <span className="category-status required">Always Active</span>
                </div>
                <p>These cookies are necessary for the website to function and cannot be disabled.</p>
                <details>
                  <summary>View cookie details</summary>
                  <ul className="cookie-details">
                    <li><strong>urbanai_session</strong>: Authentication and security (24 hours)</li>
                    <li><strong>urbanai_csrf</strong>: CSRF protection (Session)</li>
                    <li><strong>urbanai_lang</strong>: Language preference (1 year)</li>
                  </ul>
                </details>
              </div>

              {/* Analytics Cookies */}
              <div className="cookie-category">
                <div className="category-header">
                  <h3>Analytics Cookies</h3>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={preferences.analytics}
                      onChange={(e) => updateCategory('analytics', e.target.checked)}
                    />
                    <span className="slider" />
                  </label>
                </div>
                <p>Help us understand how visitors interact with our website by collecting anonymous information.</p>
                <details>
                  <summary>View cookie details</summary>
                  <ul className="cookie-details">
                    <li><strong>Google Analytics</strong>: Anonymous usage statistics (2 years)</li>
                    <li><strong>urbanai_analytics</strong>: Internal analytics (1 year)</li>
                  </ul>
                </details>
              </div>

              {/* Functional Cookies */}
              <div className="cookie-category">
                <div className="category-header">
                  <h3>Functional Cookies</h3>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={preferences.functional}
                      onChange={(e) => updateCategory('functional', e.target.checked)}
                    />
                    <span className="slider" />
                  </label>
                </div>
                <p>Enable enhanced functionality like personalized content and improved user experience.</p>
                <details>
                  <summary>View cookie details</summary>
                  <ul className="cookie-details">
                    <li><strong>urbanai_map_prefs</strong>: Map display preferences (6 months)</li>
                    <li><strong>urbanai_dashboard</strong>: Dashboard layout customization (1 year)</li>
                  </ul>
                </details>
              </div>

              {/* Marketing Cookies */}
              <div className="cookie-category">
                <div className="category-header">
                  <h3>Marketing Cookies</h3>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={preferences.marketing}
                      onChange={(e) => updateCategory('marketing', e.target.checked)}
                    />
                    <span className="slider" />
                  </label>
                </div>
                <p>Used to deliver relevant content and track engagement with our communications.</p>
                <details>
                  <summary>View cookie details</summary>
                  <ul className="cookie-details">
                    <li><strong>Email tracking</strong>: Newsletter engagement (1 year)</li>
                    <li><strong>Social media</strong>: Social sharing features (3 months)</li>
                  </ul>
                </details>
              </div>
            </div>
            
            <footer className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={saveCustomPreferences}
              >
                Save Preferences
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsentBanner;