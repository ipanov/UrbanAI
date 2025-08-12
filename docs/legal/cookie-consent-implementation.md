# UrbanAI Cookie Consent Implementation Guide

## Overview

This document provides technical implementation guidance for GDPR-compliant cookie consent in UrbanAI applications. It covers legal requirements, UX best practices, and technical implementation details.

## Legal Requirements Under GDPR

### Article 7 - Conditions for Consent
- **Freely Given**: Users can refuse without consequences to core functionality
- **Specific**: Separate consent for different cookie categories
- **Informed**: Clear explanation of what each cookie does
- **Unambiguous**: Clear affirmative action required
- **Withdrawable**: Easy opt-out mechanisms

### ePrivacy Directive (Cookie Law)
- **Prior Consent**: Required before placing non-essential cookies
- **Clear Information**: About cookie purposes and data processing
- **Easy Withdrawal**: Simple way to change cookie preferences

---

## Cookie Categories

### 1. Essential Cookies (No Consent Required)
**Purpose**: Absolutely necessary for core website functionality

**Examples**:
- Session authentication tokens
- CSRF protection tokens
- Load balancer session affinity
- Accessibility preferences (font size, contrast)
- Language selection
- Privacy preferences (cookie consent status)

**Legal Basis**: Legitimate interest (service delivery)

**Technical Implementation**:
```javascript
// Essential cookies - can be set immediately
const essentialCookies = {
  'urbanai_session': {
    purpose: 'Authentication and security',
    expiry: '24 hours',
    domain: '.urbanai.app',
    httpOnly: true,
    secure: true,
    sameSite: 'Strict'
  },
  'urbanai_csrf': {
    purpose: 'CSRF protection',
    expiry: 'Session',
    httpOnly: true,
    secure: true
  },
  'urbanai_lang': {
    purpose: 'Language preference',
    expiry: '1 year',
    secure: true
  }
};
```

### 2. Analytics Cookies (Consent Required)
**Purpose**: Understanding website usage and performance

**Examples**:
- Google Analytics tracking
- Page view statistics
- User journey analysis
- Performance monitoring
- A/B testing data

**Legal Basis**: Consent (Article 6(1)(a) GDPR)

**Technical Implementation**:
```javascript
// Analytics cookies - require consent
const analyticsCookies = {
  'ga': {
    purpose: 'Google Analytics - user identification',
    provider: 'Google',
    expiry: '2 years',
    privacyPolicy: 'https://policies.google.com/privacy'
  },
  'gat': {
    purpose: 'Google Analytics - throttling',
    provider: 'Google',
    expiry: '1 minute'
  },
  'urbanai_analytics': {
    purpose: 'Internal usage analytics',
    provider: 'UrbanAI',
    expiry: '1 year'
  }
};
```

### 3. Functional Cookies (Consent Required)
**Purpose**: Enhanced functionality and personalization

**Examples**:
- Map preferences (zoom level, layer selection)
- Dashboard layout customization
- Recently viewed cases
- Search preferences
- Third-party integrations

**Legal Basis**: Consent (Article 6(1)(a) GDPR)

**Technical Implementation**:
```javascript
// Functional cookies - require consent
const functionalCookies = {
  'urbanai_map_prefs': {
    purpose: 'Map display preferences',
    expiry: '6 months',
    enhances: 'Map functionality'
  },
  'urbanai_dashboard': {
    purpose: 'Dashboard layout customization',
    expiry: '1 year',
    enhances: 'User interface'
  }
};
```

### 4. Marketing Cookies (Explicit Consent Required)
**Purpose**: Marketing, advertising, and social media

**Examples**:
- Social media integration
- Email marketing tracking
- Newsletter engagement
- Cross-site tracking

**Legal Basis**: Explicit consent with opt-in

**Technical Implementation**:
```javascript
// Marketing cookies - explicit opt-in required
const marketingCookies = {
  'fb_pixel': {
    purpose: 'Facebook social integration',
    provider: 'Facebook',
    expiry: '3 months',
    privacyPolicy: 'https://www.facebook.com/privacy/policy'
  },
  'urbanai_newsletter': {
    purpose: 'Newsletter engagement tracking',
    provider: 'UrbanAI',
    expiry: '1 year'
  }
};
```

---

## Technical Implementation

### 1. Cookie Consent Manager Class

```javascript
class UrbanAICookieConsent {
  constructor() {
    this.consentData = this.loadConsent();
    this.bannerShown = false;
    this.init();
  }

  init() {
    // Set essential cookies immediately
    this.setEssentialCookies();
    
    // Check if consent is needed
    if (!this.hasValidConsent()) {
      this.showConsentBanner();
    } else {
      // Apply saved preferences
      this.applyConsentPreferences();
    }
  }

  hasValidConsent() {
    if (!this.consentData) return false;
    
    // Check if consent is still valid (not expired)
    const consentAge = Date.now() - this.consentData.timestamp;
    const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
    
    return consentAge < maxAge;
  }

  showConsentBanner() {
    if (this.bannerShown) return;
    
    const banner = this.createConsentBanner();
    document.body.appendChild(banner);
    this.bannerShown = true;
    
    // Accessibility: Focus management
    banner.querySelector('.consent-accept').focus();
    
    // Analytics: Track banner display (cookieless)
    this.trackBannerDisplay();
  }

  createConsentBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.setAttribute('aria-describedby', 'cookie-banner-description');
    
    banner.innerHTML = `
      <div class="cookie-consent-content">
        <div class="cookie-consent-text">
          <h2 id="cookie-banner-title">Cookie Preferences</h2>
          <p id="cookie-banner-description">
            We use cookies to provide essential functionality and, with your consent, 
            to analyze usage and improve our service. You can customize your preferences below.
          </p>
          <a href="/privacy/cookies" target="_blank" rel="noopener">
            Learn more about our cookie policy
          </a>
        </div>
        
        <div class="cookie-consent-actions">
          <button class="btn btn-secondary consent-customize" 
                  onclick="urbanaiConsent.showDetailedSettings()">
            Customize Settings
          </button>
          <button class="btn btn-outline consent-reject" 
                  onclick="urbanaiConsent.rejectAll()">
            Reject All
          </button>
          <button class="btn btn-primary consent-accept" 
                  onclick="urbanaiConsent.acceptAll()">
            Accept All
          </button>
        </div>
      </div>
    `;
    
    return banner;
  }

  showDetailedSettings() {
    const modal = this.createDetailedModal();
    document.body.appendChild(modal);
    
    // Accessibility: Trap focus in modal
    this.trapFocus(modal);
  }

  createDetailedModal() {
    const modal = document.createElement('div');
    modal.className = 'cookie-settings-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'cookie-settings-title');
    
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="urbanaiConsent.closeModal()"></div>
      <div class="modal-content">
        <header class="modal-header">
          <h2 id="cookie-settings-title">Cookie Settings</h2>
          <button class="modal-close" onclick="urbanaiConsent.closeModal()" 
                  aria-label="Close cookie settings">
            ×
          </button>
        </header>
        
        <div class="modal-body">
          ${this.generateCookieCategories()}
        </div>
        
        <footer class="modal-footer">
          <button class="btn btn-outline" onclick="urbanaiConsent.closeModal()">
            Cancel
          </button>
          <button class="btn btn-primary" onclick="urbanaiConsent.savePreferences()">
            Save Preferences
          </button>
        </footer>
      </div>
    `;
    
    return modal;
  }

  generateCookieCategories() {
    return `
      <div class="cookie-category">
        <div class="category-header">
          <h3>Essential Cookies</h3>
          <span class="category-status required">Always Active</span>
        </div>
        <p>These cookies are necessary for the website to function and cannot be disabled.</p>
        <details>
          <summary>View cookie details</summary>
          <ul>
            <li><strong>urbanai_session</strong>: Authentication and security (24 hours)</li>
            <li><strong>urbanai_csrf</strong>: CSRF protection (Session)</li>
            <li><strong>urbanai_lang</strong>: Language preference (1 year)</li>
          </ul>
        </details>
      </div>
      
      <div class="cookie-category">
        <div class="category-header">
          <h3>Analytics Cookies</h3>
          <label class="toggle-switch">
            <input type="checkbox" id="analytics-consent" 
                   onchange="urbanaiConsent.updateCategory('analytics', this.checked)">
            <span class="slider"></span>
          </label>
        </div>
        <p>Help us understand how visitors interact with our website by collecting anonymous information.</p>
        <details>
          <summary>View cookie details</summary>
          <ul>
            <li><strong>Google Analytics</strong>: Usage statistics (2 years)</li>
            <li><strong>urbanai_analytics</strong>: Internal analytics (1 year)</li>
          </ul>
        </details>
      </div>
      
      <div class="cookie-category">
        <div class="category-header">
          <h3>Functional Cookies</h3>
          <label class="toggle-switch">
            <input type="checkbox" id="functional-consent" 
                   onchange="urbanaiConsent.updateCategory('functional', this.checked)">
            <span class="slider"></span>
          </label>
        </div>
        <p>Enable enhanced functionality like personalized content and improved user experience.</p>
        <details>
          <summary>View cookie details</summary>
          <ul>
            <li><strong>urbanai_map_prefs</strong>: Map preferences (6 months)</li>
            <li><strong>urbanai_dashboard</strong>: Dashboard layout (1 year)</li>
          </ul>
        </details>
      </div>
      
      <div class="cookie-category">
        <div class="category-header">
          <h3>Marketing Cookies</h3>
          <label class="toggle-switch">
            <input type="checkbox" id="marketing-consent" 
                   onchange="urbanaiConsent.updateCategory('marketing', this.checked)">
            <span class="slider"></span>
          </label>
        </div>
        <p>Used to deliver relevant content and track engagement with our communications.</p>
        <details>
          <summary>View cookie details</summary>
          <ul>
            <li><strong>Email tracking</strong>: Newsletter engagement (1 year)</li>
            <li><strong>Social media</strong>: Social sharing features (3 months)</li>
          </ul>
        </details>
      </div>
    `;
  }

  acceptAll() {
    const consent = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    this.saveConsent(consent);
    this.applyConsentPreferences();
    this.hideConsentBanner();
    
    // Track consent (cookieless until consent given)
    this.trackConsentChoice('accept_all');
  }

  rejectAll() {
    const consent = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    this.saveConsent(consent);
    this.applyConsentPreferences();
    this.hideConsentBanner();
    
    // Track consent (cookieless)
    this.trackConsentChoice('reject_all');
  }

  savePreferences() {
    const consent = {
      essential: true,
      analytics: document.getElementById('analytics-consent').checked,
      functional: document.getElementById('functional-consent').checked,
      marketing: document.getElementById('marketing-consent').checked,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    this.saveConsent(consent);
    this.applyConsentPreferences();
    this.closeModal();
    this.hideConsentBanner();
    
    // Track consent
    this.trackConsentChoice('customize');
  }

  applyConsentPreferences() {
    // Always apply essential cookies
    this.setEssentialCookies();
    
    // Apply optional cookies based on consent
    if (this.consentData.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }
    
    if (this.consentData.functional) {
      this.enableFunctionalCookies();
    } else {
      this.disableFunctionalCookies();
    }
    
    if (this.consentData.marketing) {
      this.enableMarketingCookies();
    } else {
      this.disableMarketingCookies();
    }
  }

  enableAnalytics() {
    // Initialize Google Analytics
    if (typeof gtag === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      script.async = true;
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: true,
        respect_dnt: true
      });
    }
    
    // Initialize internal analytics
    this.initInternalAnalytics();
  }

  disableAnalytics() {
    // Disable Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        send_page_view: false
      });
    }
    
    // Clear analytics cookies
    this.clearCookiesByPattern(/^(_ga|_gid|_gat)/);    this.clearInternalAnalytics();
  }

  saveConsent(consent) {
    // Save to localStorage
    localStorage.setItem('urbanai_cookie_consent', JSON.stringify(consent));
    
    // Set consent cookie (essential)
    this.setCookie('urbanai_consent', JSON.stringify({
      version: consent.version,
      timestamp: consent.timestamp,
      hash: this.hashConsent(consent)
    }), 365);
    
    this.consentData = consent;
  }

  loadConsent() {
    try {
      const stored = localStorage.getItem('urbanai_cookie_consent');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('Failed to load cookie consent:', e);
      return null;
    }
  }

  // Utility methods
  setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; secure; samesite=strict`;
  }

  clearCookiesByPattern(pattern) {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (pattern.test(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  }

  trackConsentChoice(choice) {
    // Cookieless tracking for consent choices
    fetch('/api/analytics/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        choice: choice,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        language: navigator.language
      })
    }).catch(e => console.warn('Failed to track consent:', e));
  }
}

// Initialize consent manager
const urbanaiConsent = new UrbanAICookieConsent();
```

### 2. CSS Styling for GDPR Compliance

```css
/* Cookie Consent Banner */
.cookie-consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  padding: 16px;
  font-family: 'Inter', sans-serif;
}

.cookie-consent-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.cookie-consent-text {
  flex: 1;
}

.cookie-consent-text h2 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.cookie-consent-text p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.cookie-consent-text a {
  color: #2563eb;
  text-decoration: underline;
  font-size: 14px;
}

.cookie-consent-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .cookie-consent-content {
    flex-direction: column;
    text-align: center;
  }
  
  .cookie-consent-actions {
    width: 100%;
    justify-content: center;
  }
}

/* Cookie Settings Modal */
.cookie-settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  line-height: 1;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 0 24px 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Cookie Categories */
.cookie-category {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.cookie-category:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.category-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.category-status.required {
  background: #e5e7eb;
  color: #6b7280;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e7eb;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2563eb;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border-color: #d1d5db;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* Accessibility */
.cookie-consent-banner:focus-within,
.modal-content:focus-within {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Details/Summary styling */
details {
  margin-top: 12px;
}

summary {
  cursor: pointer;
  color: #2563eb;
  font-size: 14px;
  font-weight: 500;
}

summary:hover {
  text-decoration: underline;
}

details ul {
  margin: 12px 0 0 0;
  padding-left: 20px;
}

details li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}
```

### 3. Server-Side Implementation

```javascript
// Express.js middleware for cookie consent
const cookieConsent = {
  // Check if user has given consent for specific cookie category
  hasConsent(req, category) {
    try {
      const consentCookie = req.cookies['urbanai_consent'];
      if (!consentCookie) return false;
      
      const consent = JSON.parse(consentCookie);
      const stored = JSON.parse(req.body.urbanai_cookie_consent || '{}');
      
      // Verify consent integrity
      if (this.hashConsent(stored) !== consent.hash) {
        return false;
      }
      
      return stored[category] === true;
    } catch (e) {
      return false;
    }
  },

  // Middleware to check analytics consent
  requireAnalyticsConsent(req, res, next) {
    if (!this.hasConsent(req, 'analytics')) {
      return res.status(403).json({
        error: 'Analytics consent required',
        message: 'Please enable analytics cookies to use this feature'
      });
    }
    next();
  },

  // Middleware to check functional consent
  requireFunctionalConsent(req, res, next) {
    if (!this.hasConsent(req, 'functional')) {
      return res.status(403).json({
        error: 'Functional consent required',
        message: 'Please enable functional cookies to use this feature'
      });
    }
    next();
  },

  // Set consent-aware response headers
  setConsentHeaders(res, category) {
    res.set({
      'X-Cookie-Category': category,
      'X-Consent-Required': 'true',
      'X-Privacy-Policy': 'https://urbanai.app/privacy'
    });
  }
};

// Usage in routes
app.get('/api/analytics/events', 
  cookieConsent.requireAnalyticsConsent,
  (req, res) => {
    // Analytics endpoint - requires consent
    res.json({ events: getAnalyticsEvents() });
  }
);

app.post('/api/user/preferences',
  cookieConsent.requireFunctionalConsent,
  (req, res) => {
    // User preferences - requires functional consent
    saveUserPreferences(req.body);
    res.json({ success: true });
  }
);
```

---

## Integration with Authentication

### OAuth Provider Considerations

```javascript
// Update OAuth login to respect cookie consent
class OAuthIntegration {
  static redirectToProvider(provider, consentData) {
    let redirectUrl = `/auth/${provider}`;
    
    // Add consent-aware parameters
    const params = new URLSearchParams({
      consent_analytics: consentData.analytics,
      consent_functional: consentData.functional,
      consent_marketing: consentData.marketing
    });
    
    window.location.href = `${redirectUrl}?${params}`;
  }
  
  static handleOAuthCallback(providerData, consentData) {
    // Only store provider data based on consent
    const userData = {
      // Always store (essential)
      userGuid: providerData.sub,
      role: 'citizen'
    };
    
    // Only set functional cookies if consented
    if (consentData.functional) {
      this.setUserPreferences(providerData);
    }
    
    // Only track analytics if consented
    if (consentData.analytics) {
      this.trackSuccessfulLogin(provider);
    }
    
    return userData;
  }
}
```

---

## Testing and Compliance

### 1. Automated Testing

```javascript
// Jest tests for cookie consent
describe('Cookie Consent Manager', () => {
  beforeEach(() => {
    // Clear all cookies and localStorage
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    localStorage.clear();
  });

  test('should show consent banner on first visit', () => {
    new UrbanAICookieConsent();
    expect(document.querySelector('.cookie-consent-banner')).toBeTruthy();
  });

  test('should set only essential cookies before consent', () => {
    new UrbanAICookieConsent();
    
    const cookies = document.cookie.split(';').map(c => c.trim());
    const essentialCookies = cookies.filter(c => 
      c.startsWith('urbanai_session') || 
      c.startsWith('urbanai_csrf') ||
      c.startsWith('urbanai_lang')
    );
    
    expect(essentialCookies.length).toBeGreaterThan(0);
    expect(cookies.find(c => c.startsWith('_ga'))).toBeFalsy();
  });

  test('should respect analytics consent choice', () => {
    const consent = new UrbanAICookieConsent();
    
    // Simulate analytics consent
    consent.saveConsent({
      essential: true,
      analytics: true,
      functional: false,
      marketing: false,
      timestamp: Date.now(),
      version: '1.0'
    });
    
    consent.applyConsentPreferences();
    
    // Check that analytics is enabled
    expect(typeof gtag).toBe('function');
  });

  test('should clear analytics cookies when consent withdrawn', () => {
    const consent = new UrbanAICookieConsent();
    
    // First enable analytics
    consent.enableAnalytics();
    
    // Then disable
    consent.disableAnalytics();
    
    const cookies = document.cookie;
    expect(cookies).not.toMatch(/_ga/);
    expect(cookies).not.toMatch(/_gid/);
  });
});
```

### 2. Manual Compliance Checklist

- [ ] **Banner Display**: Appears on first visit before any non-essential cookies
- [ ] **Clear Information**: Explains what cookies do in plain language
- [ ] **Granular Control**: Separate toggles for each cookie category
- [ ] **Easy Withdrawal**: Settings accessible from any page
- [ ] **Essential Cookies**: Work without consent
- [ ] **No Pre-Checked Boxes**: All optional cookies default to off
- [ ] **Continue Without Consent**: Core functionality available after rejecting all
- [ ] **Consent Renewal**: Expires after reasonable period (max 13 months)
- [ ] **Accessibility**: Keyboard navigation, screen reader support
- [ ] **Mobile Friendly**: Works on all device sizes

---

## Best Practices Summary

### Legal Compliance
1. **No Pre-Consent Cookies**: Only essential cookies before user choice
2. **Clear Categories**: Separate consent for different purposes
3. **Easy Withdrawal**: One-click opt-out available
4. **Regular Renewal**: Consent expires and requires refresh
5. **Record Keeping**: Maintain consent records for compliance

### User Experience
1. **Non-Intrusive**: Banner doesn't block core functionality
2. **Clear Language**: Avoid technical jargon
3. **Quick Choices**: Accept/reject all options available
4. **Detailed Control**: Granular settings for power users
5. **Performance**: Minimal impact on page load speed

### Technical Implementation
1. **Progressive Enhancement**: Works without JavaScript
2. **Accessibility**: Full keyboard and screen reader support
3. **Performance**: Lazy load non-essential scripts
4. **Security**: Prevent consent tampering
5. **Analytics**: Track consent choices (cookieless methods)

This implementation ensures UrbanAI meets all GDPR requirements while providing an excellent user experience and maintaining the privacy-first approach that differentiates the platform.