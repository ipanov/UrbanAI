import React from 'react';
import { Link } from 'react-router-dom';
import { UrbanAILogoPlaceholder } from './UrbanAILogo';
import { Card, Typography } from './atoms';
import { Cookie, Shield, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import './LegalPages.css';

/**
 * Cookie Policy Page
 *
 * Comprehensive cookie policy designed for GDPR and CCPA compliance.
 * Explains cookie usage, user rights, and provides management options.
 */
const CookiePolicyPage: React.FC = () => {
  const lastUpdated = "December 30, 2024";

  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <header className="legal-header">
          <Link to="/" className="logo-link">
            <UrbanAILogoPlaceholder variant="primary" size={32} />
          </Link>
          <div className="header-content">
            <Typography variant="h1">Cookie Policy</Typography>
            <Typography variant="body2" color="secondary">
              Last updated: {lastUpdated}
            </Typography>
          </div>
        </header>

        {/* Summary Card */}
        <Card className="cookie-summary" variant="elevated" padding="lg">
          <div className="summary-header">
            <Cookie size={24} className="summary-icon" />
            <Typography variant="h2">Cookie Usage at a Glance</Typography>
          </div>
          <div className="summary-points">
            <div className="summary-point">
              <CheckCircle size={16} />
              <Typography variant="body1">
                <strong>Essential Cookies Only:</strong> We use minimal cookies necessary for authentication and security.
              </Typography>
            </div>
            <div className="summary-point">
              <CheckCircle size={16} />
              <Typography variant="body1">
                <strong>Your Control:</strong> You can manage cookie preferences and opt-out anytime.
              </Typography>
            </div>
            <div className="summary-point">
              <CheckCircle size={16} />
              <Typography variant="body1">
                <strong>Privacy-First:</strong> No tracking cookies or third-party advertising.
              </Typography>
            </div>
          </div>
        </Card>

        {/* Table of Contents */}
        <Card className="toc-card" variant="bordered" padding="md">
          <Typography variant="h3">Contents</Typography>
          <nav className="table-of-contents">
            <a href="#what-are-cookies">1. What Are Cookies</a>
            <a href="#cookies-we-use">2. Cookies We Use</a>
            <a href="#third-party-cookies">3. Third-Party Cookies</a>
            <a href="#managing-cookies">4. Managing Your Cookie Preferences</a>
            <a href="#legal-basis">5. Legal Basis for Cookie Usage</a>
            <a href="#data-retention">6. Cookie Data Retention</a>
            <a href="#international">7. International Data Transfers</a>
            <a href="#updates">8. Updates to This Policy</a>
            <a href="#contact">9. Contact Us</a>
          </nav>
        </Card>

        {/* Main Content */}
        <div className="legal-content">

          {/* Section 1 */}
          <section id="what-are-cookies" className="legal-section">
            <Typography variant="h2">1. What Are Cookies</Typography>

            <Card className="info-card" padding="md">
              <Typography variant="h4">Understanding Cookies</Typography>
              <Typography variant="body1">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                They are widely used by website owners to make their websites work more efficiently, as well as to provide
                reporting information and enhance user experience.
              </Typography>
              <Typography variant="body1">
                Cookies set by the website owner (UrbanAI) are called "first-party cookies." Cookies set by parties
                other than the website owner are called "third-party cookies."
              </Typography>
            </Card>

            <Typography variant="body1">
              <strong>Important:</strong> Cookies cannot access any other information on your device beyond what you
              have specifically allowed them to store. They cannot read your emails, access your files, or retrieve
              any personal information that wasn't provided directly to the website.
            </Typography>
          </section>

          {/* Section 2 */}
          <section id="cookies-we-use" className="legal-section">
            <Typography variant="h2">2. Cookies We Use</Typography>

            <Typography variant="body1">
              UrbanAI follows a privacy-first approach and uses only essential cookies necessary for the service to function.
              We do not use tracking cookies, advertising cookies, or any cookies that collect personal information for marketing purposes.
            </Typography>

            <div className="cookie-categories">
              <Card className="cookie-category essential" padding="md">
                <div className="category-header">
                  <Shield size={20} className="category-icon" />
                  <Typography variant="h4">Essential Cookies (Always Active)</Typography>
                </div>
                <Typography variant="body1">
                  These cookies are strictly necessary for UrbanAI to function properly and cannot be disabled.
                </Typography>
                <div className="cookie-list">
                  <div className="cookie-item">
                    <Typography variant="body2"><strong>urbanai_session</strong></Typography>
                    <Typography variant="body2">Authentication and session management</Typography>
                    <Typography variant="body2" color="secondary">Expires: 24 hours</Typography>
                  </div>
                  <div className="cookie-item">
                    <Typography variant="body2"><strong>urbanai_csrf</strong></Typography>
                    <Typography variant="body2">Security token for form submissions</Typography>
                    <Typography variant="body2" color="secondary">Expires: Session</Typography>
                  </div>
                </div>
              </Card>

              <Card className="cookie-category functional" padding="md">
                <div className="category-header">
                  <Settings size={20} className="category-icon" />
                  <Typography variant="h4">Functional Cookies (Optional)</Typography>
                </div>
                <Typography variant="body1">
                  These cookies enhance your experience but are not essential for basic functionality.
                </Typography>
                <div className="cookie-list">
                  <div className="cookie-item">
                    <Typography variant="body2"><strong>urbanai_theme</strong></Typography>
                    <Typography variant="body2">Remembers your theme preference (light/dark)</Typography>
                    <Typography variant="body2" color="secondary">Expires: 6 months</Typography>
                  </div>
                  <div className="cookie-item">
                    <Typography variant="body2"><strong>urbanai_lang</strong></Typography>
                    <Typography variant="body2">Remembers your language preference</Typography>
                    <Typography variant="body2" color="secondary">Expires: 6 months</Typography>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="warning-card" variant="bordered" padding="md">
              <AlertTriangle size={20} />
              <div>
                <Typography variant="h4">Cookies We DON'T Use</Typography>
                <ul>
                  <li>Advertising or marketing cookies</li>
                  <li>Social media tracking cookies</li>
                  <li>Analytics cookies that identify individuals</li>
                  <li>Third-party tracking pixels or beacons</li>
                  <li>Any cookies that collect personal data for non-essential purposes</li>
                </ul>
              </div>
            </Card>
          </section>

          {/* Section 3 */}
          <section id="third-party-cookies" className="legal-section">
            <Typography variant="h2">3. Third-Party Cookies</Typography>

            <Typography variant="body1">
              UrbanAI integrates with trusted OAuth providers (Microsoft, Google, Facebook) for authentication.
              These providers may set their own cookies when you use their login services.
            </Typography>

            <div className="third-party-services">
              <Card className="service-card" padding="sm">
                <Typography variant="h4">OAuth Providers</Typography>
                <Typography variant="body2">
                  Microsoft, Google, Facebook - for authentication only.
                  Their cookie usage is governed by their respective privacy policies.
                </Typography>
                <Typography variant="body2">
                  <a href="https://privacy.microsoft.com/" target="_blank" rel="noopener noreferrer">Microsoft Privacy</a> •
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy</a> •
                  <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Facebook Privacy</a>
                </Typography>
              </Card>

              <Card className="service-card" padding="sm">
                <Typography variant="h4">Azure Cloud Services</Typography>
                <Typography variant="body2">
                  Our infrastructure uses Microsoft Azure, which may set security-related cookies.
                  Subject to Microsoft's privacy policies and GDPR compliance.
                </Typography>
                <Typography variant="body2">
                  <a href="https://privacy.microsoft.com/" target="_blank" rel="noopener noreferrer">Azure Privacy</a>
                </Typography>
              </Card>
            </div>
          </section>

          {/* Section 4 */}
          <section id="managing-cookies" className="legal-section">
            <Typography variant="h2">4. Managing Your Cookie Preferences</Typography>

            <Typography variant="body1">
              You have several options to control cookies on UrbanAI:
            </Typography>

            <div className="management-options">
              <Card className="option-card" padding="md">
                <Typography variant="h4">Cookie Settings Banner</Typography>
                <Typography variant="body1">
                  When you first visit UrbanAI, you'll see a cookie consent banner where you can:
                </Typography>
                <ul>
                  <li>Accept all cookies</li>
                  <li>Customize your preferences</li>
                  <li>Reject non-essential cookies</li>
                </ul>
                <Typography variant="body1">
                  You can revisit these settings anytime by clicking "Cookie Settings" in the footer.
                </Typography>
              </Card>

              <Card className="option-card" padding="md">
                <Typography variant="h4">Browser Settings</Typography>
                <Typography variant="body1">
                  You can control cookies through your browser settings:
                </Typography>
                <ul>
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                  <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                </ul>
              </Card>

              <Card className="option-card" padding="md">
                <Typography variant="h4">Opt-Out Links</Typography>
                <Typography variant="body1">
                  For third-party services, you can opt-out directly:
                </Typography>
                <ul>
                  <li><a href="https://account.microsoft.com/privacy" target="_blank" rel="noopener noreferrer">Microsoft Privacy Settings</a></li>
                  <li><a href="https://myaccount.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Settings</a></li>
                  <li><a href="https://www.facebook.com/settings?tab=privacy" target="_blank" rel="noopener noreferrer">Facebook Privacy Settings</a></li>
                </ul>
              </Card>
            </div>

            <Typography variant="body1">
              <strong>Note:</strong> Disabling essential cookies may affect UrbanAI's functionality.
              You may not be able to log in or use certain features if you disable necessary cookies.
            </Typography>
          </section>

          {/* Section 5 */}
          <section id="legal-basis" className="legal-section">
            <Typography variant="h2">5. Legal Basis for Cookie Usage</Typography>

            <Typography variant="body1">
              Our use of cookies is based on the following legal grounds:
            </Typography>

            <div className="legal-basis-grid">
              <Card className="basis-card" padding="sm">
                <Typography variant="h4">Contract Performance</Typography>
                <Typography variant="body2">
                  Essential cookies are necessary to provide the UrbanAI service you requested.
                </Typography>
              </Card>

              <Card className="basis-card" padding="sm">
                <Typography variant="h4">Legitimate Interest</Typography>
                <Typography variant="body2">
                  Functional cookies help us improve your experience and maintain security.
                </Typography>
              </Card>

              <Card className="basis-card" padding="sm">
                <Typography variant="h4">Consent</Typography>
                <Typography variant="body2">
                  We obtain your explicit consent before setting non-essential cookies.
                </Typography>
              </Card>
            </div>

            <Typography variant="body1">
              Under GDPR, CCPA, and other privacy laws, you have the right to withdraw consent
              and modify your cookie preferences at any time.
            </Typography>
          </section>

          {/* Section 6 */}
          <section id="data-retention" className="legal-section">
            <Typography variant="h2">6. Cookie Data Retention</Typography>

            <Typography variant="body1">
              We retain cookie data only as long as necessary for their intended purpose:
            </Typography>

            <div className="retention-info">
              <div className="retention-item">
                <Typography variant="body2"><strong>Session Cookies:</strong></Typography>
                <Typography variant="body2">Automatically deleted when you close your browser</Typography>
              </div>
              <div className="retention-item">
                <Typography variant="body2"><strong>Authentication Cookies:</strong></Typography>
                <Typography variant="body2">Maximum 24 hours for security</Typography>
              </div>
              <div className="retention-item">
                <Typography variant="body2"><strong>Preference Cookies:</strong></Typography>
                <Typography variant="body2">Up to 6 months or until you change preferences</Typography>
              </div>
            </div>

            <Typography variant="body1">
              Cookie data is stored securely and encrypted both in transit and at rest.
              We do not use cookie data for any purpose other than what's described in this policy.
            </Typography>
          </section>

          {/* Section 7 */}
          <section id="international" className="legal-section">
            <Typography variant="h2">7. International Data Transfers</Typography>

            <Typography variant="body1">
              UrbanAI is hosted on Microsoft Azure data centers. Cookie data may be transferred to and processed in:
            </Typography>
            <ul>
              <li>European Union countries (GDPR compliant)</li>
              <li>United States (adequacy decision under GDPR)</li>
              <li>Other Microsoft Azure regions with appropriate safeguards</li>
            </ul>

            <Typography variant="body1">
              All transfers are protected by Microsoft's Data Protection Addendum and Standard Contractual Clauses,
              ensuring your data receives the same level of protection as within the EU.
            </Typography>
          </section>

          {/* Section 8 */}
          <section id="updates" className="legal-section">
            <Typography variant="h2">8. Updates to This Policy</Typography>

            <Typography variant="body1">
              We may update this Cookie Policy to reflect changes in our practices, technology, or legal requirements.
              When we make material changes, we will:
            </Typography>
            <ul>
              <li>Update the "Last Modified" date at the top of this page</li>
              <li>Notify you through the application or via email</li>
              <li>Provide a summary of the changes</li>
              <li>Give you time to review and adjust your preferences if needed</li>
            </ul>

            <Typography variant="body1">
              We encourage you to review this policy periodically to stay informed about our cookie practices.
            </Typography>
          </section>

          {/* Section 9 */}
          <section id="contact" className="legal-section">
            <Typography variant="h2">9. Contact Us</Typography>

            <Typography variant="body1">
              Questions about this Cookie Policy or your cookie preferences? Contact us:
            </Typography>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@urbanai.site</p>
              <p><strong>Cookie Questions:</strong> cookies@urbanai.site</p>
              <p><strong>Data Protection Officer:</strong> dpo@urbanai.site</p>
              <p><strong>Address:</strong> UrbanAI Privacy Team<br />
              [Your business address]</p>
            </div>

            <Typography variant="body1">
              We respond to cookie-related inquiries within 48 hours during business days.
            </Typography>
          </section>

          {/* Cookie Settings Widget */}
          <section className="legal-section">
            <Card className="cookie-settings-widget" variant="elevated" padding="lg">
              <Typography variant="h3">Manage Your Cookie Preferences</Typography>
              <Typography variant="body1">
                Click below to access your cookie settings and modify your preferences at any time.
              </Typography>
              <button className="cookie-settings-button">
                <Settings size={16} />
                Cookie Settings
              </button>
            </Card>
          </section>
        </div>

        {/* Footer Navigation */}
        <footer className="legal-footer">
          <div className="footer-links">
            <Link to="/" className="footer-link">← Back to Home</Link>
            <Link to="/privacy" className="footer-link">Privacy Policy →</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
