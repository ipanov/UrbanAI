import React from 'react';
import { Link } from 'react-router-dom';
import { UrbanAILogoPlaceholder } from './UrbanAILogo';
import { Card, Typography } from './atoms';
import { Shield, Eye, Lock, User, Database, AlertTriangle } from 'lucide-react';
import './LegalPages.css';

/**
 * Privacy Policy Page
 * 
 * Comprehensive privacy policy designed for GDPR compliance and transparency.
 * Uses progressive disclosure and plain language as per UX best practices.
 */
const PrivacyPolicyPage: React.FC = () => {
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
            <Typography variant="h1">Privacy Policy</Typography>
            <Typography variant="body2" color="secondary">
              Last updated: {lastUpdated}
            </Typography>
          </div>
        </header>

        {/* Summary Card */}
        <Card className="privacy-summary" variant="elevated" padding="lg">
          <div className="summary-header">
            <Shield size={24} className="summary-icon" />
            <Typography variant="h2">Privacy at a Glance</Typography>
          </div>
          <div className="summary-points">
            <div className="summary-point">
              <Lock size={16} />
              <Typography variant="body1">
                <strong>Zero Personal Data Storage:</strong> We only store an anonymous identifier linked to your OAuth provider. Your name, email, and personal details never leave your device.
              </Typography>
            </div>
            <div className="summary-point">
              <Eye size={16} />
              <Typography variant="body1">
                <strong>Complete Transparency:</strong> You can see exactly what data we collect (spoiler: it's just an anonymous ID) and delete it anytime.
              </Typography>
            </div>
            <div className="summary-point">
              <User size={16} />
              <Typography variant="body1">
                <strong>Your Identity Stays Private:</strong> We rely on trusted providers like Microsoft and Google to verify you're real, but we never see your personal information.
              </Typography>
            </div>
          </div>
        </Card>

        {/* Table of Contents */}
        <Card className="toc-card" variant="bordered" padding="md">
          <Typography variant="h3">Contents</Typography>
          <nav className="table-of-contents">
            <a href="#what-we-collect">1. What Information We Collect</a>
            <a href="#how-we-use">2. How We Use Your Information</a>
            <a href="#data-storage">3. Data Storage and Security</a>
            <a href="#third-party">4. Third-Party Services</a>
            <a href="#your-rights">5. Your Privacy Rights</a>
            <a href="#cookies">6. Cookies and Local Storage</a>
            <a href="#data-retention">7. Data Retention</a>
            <a href="#international">8. International Data Transfers</a>
            <a href="#children">9. Children's Privacy</a>
            <a href="#changes">10. Changes to This Policy</a>
            <a href="#contact">11. Contact Us</a>
          </nav>
        </Card>

        {/* Main Content */}
        <div className="legal-content">
          
          {/* Section 1 */}
          <section id="what-we-collect" className="legal-section">
            <Typography variant="h2">1. What Information We Collect</Typography>
            
            <Card className="info-card" padding="md">
              <Typography variant="h4">Information We DO Collect:</Typography>
              <ul>
                <li><strong>Anonymous OAuth Identifier:</strong> A unique ID from your OAuth provider (Microsoft, Google, Facebook) that doesn't reveal your identity</li>
                <li><strong>Issue Reports:</strong> The urban issues you report, including location, description, and photos you choose to share</li>
                <li><strong>Usage Analytics:</strong> Anonymous usage patterns to improve our service</li>
              </ul>
            </Card>

            <Card className="warning-card" variant="bordered" padding="md">
              <AlertTriangle size={20} />
              <div>
                <Typography variant="h4">Information We DON'T Collect:</Typography>
                <ul>
                  <li>Your name, email address, or phone number</li>
                  <li>Your physical address or detailed location data</li>
                  <li>Your browsing history or activity on other websites</li>
                  <li>Your OAuth provider's access tokens or credentials</li>
                  <li>Any personally identifiable information (PII)</li>
                </ul>
              </div>
            </Card>
          </section>

          {/* Section 2 */}
          <section id="how-we-use" className="legal-section">
            <Typography variant="h2">2. How We Use Your Information</Typography>
            <Typography variant="body1">We use your information solely for:</Typography>
            <ul>
              <li><strong>Service Provision:</strong> Enabling you to report and track urban issues</li>
              <li><strong>Authentication:</strong> Verifying you're a legitimate user without storing your personal details</li>
              <li><strong>Issue Management:</strong> Processing and routing your reports to relevant authorities</li>
              <li><strong>Service Improvement:</strong> Analyzing usage patterns to enhance functionality</li>
            </ul>
            
            <Typography variant="body1" className="highlight-text">
              <strong>We never:</strong> Sell your data, share it with advertisers, or use it for marketing purposes unrelated to urban issue reporting.
            </Typography>
          </section>

          {/* Section 3 */}
          <section id="data-storage" className="legal-section">
            <Typography variant="h2">3. Data Storage and Security</Typography>
            
            <Card className="security-card" padding="md">
              <Database size={20} />
              <div>
                <Typography variant="h4">Our Security Measures:</Typography>
                <ul>
                  <li><strong>Encryption:</strong> All data is encrypted in transit (HTTPS) and at rest</li>
                  <li><strong>Azure Cloud Security:</strong> Hosted on Microsoft Azure with enterprise-grade security</li>
                  <li><strong>Access Controls:</strong> Strict authentication and authorization for system access</li>
                  <li><strong>Regular Security Audits:</strong> Continuous monitoring and security assessments</li>
                  <li><strong>Data Minimization:</strong> We collect only what's absolutely necessary</li>
                </ul>
              </div>
            </Card>
          </section>

          {/* Section 4 */}
          <section id="third-party" className="legal-section">
            <Typography variant="h2">4. Third-Party Services</Typography>
            
            <div className="third-party-services">
              <Card className="service-card" padding="sm">
                <Typography variant="h4">OAuth Providers</Typography>
                <Typography variant="body2">
                  Microsoft, Google, Facebook - for authentication only. 
                  We don't access your data from these providers.
                </Typography>
              </Card>
              
              <Card className="service-card" padding="sm">
                <Typography variant="h4">Microsoft Azure</Typography>
                <Typography variant="body2">
                  Cloud hosting and database services. 
                  Subject to Microsoft's privacy policies and GDPR compliance.
                </Typography>
              </Card>
              
              <Card className="service-card" padding="sm">
                <Typography variant="h4">Analytics Services</Typography>
                <Typography variant="body2">
                  Anonymous usage analytics to improve our service. 
                  No personal data is shared.
                </Typography>
              </Card>
            </div>
          </section>

          {/* Section 5 */}
          <section id="your-rights" className="legal-section">
            <Typography variant="h2">5. Your Privacy Rights (GDPR & Beyond)</Typography>
            
            <Typography variant="body1">Under GDPR, CCPA, and other privacy laws, you have the right to:</Typography>
            
            <div className="rights-grid">
              <Card className="right-card" padding="sm">
                <Typography variant="h4">Access</Typography>
                <Typography variant="body2">Request a copy of all data we have about you</Typography>
              </Card>
              
              <Card className="right-card" padding="sm">
                <Typography variant="h4">Rectification</Typography>
                <Typography variant="body2">Correct any inaccurate information</Typography>
              </Card>
              
              <Card className="right-card" padding="sm">
                <Typography variant="h4">Erasure</Typography>
                <Typography variant="body2">Delete your account and all associated data</Typography>
              </Card>
              
              <Card className="right-card" padding="sm">
                <Typography variant="h4">Portability</Typography>
                <Typography variant="body2">Export your data in a machine-readable format</Typography>
              </Card>
              
              <Card className="right-card" padding="sm">
                <Typography variant="h4">Objection</Typography>
                <Typography variant="body2">Object to processing of your data</Typography>
              </Card>
              
              <Card className="right-card" padding="sm">
                <Typography variant="h4">Restriction</Typography>
                <Typography variant="body2">Limit how we process your data</Typography>
              </Card>
            </div>
            
            <Typography variant="body1">
              To exercise these rights, contact us at <a href="mailto:privacy@urbanai.site">privacy@urbanai.site</a>
            </Typography>
          </section>

          {/* Remaining sections condensed for space */}
          <section id="cookies" className="legal-section">
            <Typography variant="h2">6. Cookies and Local Storage</Typography>
            <Typography variant="body1">
              We use minimal cookies and local storage for:
            </Typography>
            <ul>
              <li>Session management (authentication state)</li>
              <li>User preferences (theme, language)</li>
              <li>OAuth flow security (CSRF protection)</li>
            </ul>
            <Typography variant="body1">
              You can disable cookies in your browser, but some features may not work properly.
            </Typography>
          </section>

          <section id="data-retention" className="legal-section">
            <Typography variant="h2">7. Data Retention</Typography>
            <Typography variant="body1">
              We retain data only as long as necessary:
            </Typography>
            <ul>
              <li><strong>Anonymous IDs:</strong> Until you delete your account</li>
              <li><strong>Issue Reports:</strong> As required for municipal records (typically 7 years)</li>
              <li><strong>Usage Analytics:</strong> Aggregated and anonymized after 2 years</li>
            </ul>
          </section>

          <section id="international" className="legal-section">
            <Typography variant="h2">8. International Data Transfers</Typography>
            <Typography variant="body1">
              Your data is processed in Microsoft Azure data centers within the European Union and United States, 
              with appropriate safeguards under Standard Contractual Clauses and Microsoft's Data Protection Addendum.
            </Typography>
          </section>

          <section id="children" className="legal-section">
            <Typography variant="h2">9. Children's Privacy</Typography>
            <Typography variant="body1">
              UrbanAI is not intended for children under 16. We do not knowingly collect information from children. 
              If you believe a child has provided us with information, please contact us immediately.
            </Typography>
          </section>

          <section id="changes" className="legal-section">
            <Typography variant="h2">10. Changes to This Policy</Typography>
            <Typography variant="body1">
              We may update this policy occasionally. When we do, we'll:
            </Typography>
            <ul>
              <li>Post the updated policy on this page</li>
              <li>Update the "Last Modified" date</li>
              <li>Notify you of material changes via email or in-app notification</li>
            </ul>
          </section>

          <section id="contact" className="legal-section">
            <Typography variant="h2">11. Contact Us</Typography>
            <Typography variant="body1">
              Questions about this privacy policy? Contact us:
            </Typography>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@urbanai.site</p>
              <p><strong>Data Protection Officer:</strong> dpo@urbanai.site</p>
              <p><strong>Address:</strong> UrbanAI Privacy Team<br />
              [Your business address]</p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <footer className="legal-footer">
          <div className="footer-links">
            <Link to="/" className="footer-link">← Back to Home</Link>
            <Link to="/terms" className="footer-link">Terms of Service →</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;