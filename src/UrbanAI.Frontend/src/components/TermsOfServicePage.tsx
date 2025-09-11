import React from 'react';
import { Link } from 'react-router-dom';
import { UrbanAILogoPlaceholder } from './UrbanAILogo';
import { Card, Typography } from './atoms';
import { Scale, AlertTriangle, Shield, Gavel, CheckCircle } from 'lucide-react';
import './LegalPages.css';

/**
 * Terms of Service Page
 * 
 * Comprehensive terms of service designed for legal protection while maintaining user-friendly language.
 * Covers service usage, user responsibilities, and limitation of liability.
 */
const TermsOfServicePage: React.FC = () => {
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
            <Typography variant="h1">Terms of Service</Typography>
            <Typography variant="body2" color="secondary">
              Last updated: {lastUpdated}
            </Typography>
          </div>
        </header>

        {/* Summary Card */}
        <Card className="terms-summary" variant="elevated" padding="lg">
          <div className="summary-header">
            <Scale size={24} className="summary-icon" />
            <Typography variant="h2">Terms in Plain English</Typography>
          </div>
          <div className="summary-points">
            <div className="summary-point">
              <CheckCircle size={16} />
              <Typography variant="body1">
                <strong>Use UrbanAI Responsibly:</strong> Report genuine urban issues, be respectful, and don't abuse the service.
              </Typography>
            </div>
            <div className="summary-point">
              <CheckCircle size={16} />
              <Typography variant="body1">
                <strong>We Facilitate, Don't Guarantee:</strong> We help you report issues to authorities, but we can't guarantee they'll be fixed.
              </Typography>
            </div>
            <div className="summary-point">
              <CheckCircle size={16} />
              <Typography variant="body1">
                <strong>Free Service with Fair Limits:</strong> UrbanAI is free to use, but we may limit usage to prevent abuse.
              </Typography>
            </div>
          </div>
        </Card>

        {/* Table of Contents */}
        <Card className="toc-card" variant="bordered" padding="md">
          <Typography variant="h3">Contents</Typography>
          <nav className="table-of-contents">
            <a href="#acceptance">1. Acceptance of Terms</a>
            <a href="#description">2. Service Description</a>
            <a href="#user-accounts">3. User Accounts and Authentication</a>
            <a href="#acceptable-use">4. Acceptable Use Policy</a>
            <a href="#user-content">5. User-Generated Content</a>
            <a href="#service-availability">6. Service Availability</a>
            <a href="#privacy-data">7. Privacy and Data Protection</a>
            <a href="#intellectual-property">8. Intellectual Property</a>
            <a href="#disclaimers">9. Disclaimers and Limitations</a>
            <a href="#indemnification">10. Indemnification</a>
            <a href="#termination">11. Termination</a>
            <a href="#governing-law">12. Governing Law</a>
            <a href="#changes">13. Changes to Terms</a>
            <a href="#contact">14. Contact Information</a>
          </nav>
        </Card>

        {/* Main Content */}
        <div className="legal-content">
          
          {/* Section 1 */}
          <section id="acceptance" className="legal-section">
            <Typography variant="h2">1. Acceptance of Terms</Typography>
            <Typography variant="body1">
              By accessing or using UrbanAI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of these terms, you may not access the Service.
            </Typography>
            <Typography variant="body1">
              These Terms apply to all users of the Service, including citizens reporting issues, 
              investors monitoring compliance, municipal authorities, and any other users.
            </Typography>
          </section>

          {/* Section 2 */}
          <section id="description" className="legal-section">
            <Typography variant="h2">2. Service Description</Typography>
            
            <Card className="service-description" padding="md">
              <Typography variant="h4">What UrbanAI Does:</Typography>
              <ul>
                <li><strong>Issue Reporting Platform:</strong> Enables users to report urban infrastructure problems, compliance issues, and municipal concerns</li>
                <li><strong>AI-Powered Analysis:</strong> Provides automated categorization, priority assessment, and routing of reported issues</li>
                <li><strong>Stakeholder Coordination:</strong> Facilitates communication between citizens, authorities, and other stakeholders</li>
                <li><strong>Compliance Monitoring:</strong> Helps track resolution progress and regulatory compliance</li>
              </ul>
            </Card>

            <Card className="service-limitations" variant="bordered" padding="md">
              <AlertTriangle size={20} />
              <div>
                <Typography variant="h4">What UrbanAI Doesn't Do:</Typography>
                <ul>
                  <li>We don't fix the issues ourselves - we facilitate reporting to proper authorities</li>
                  <li>We don't guarantee response times or resolution of reported issues</li>
                  <li>We don't provide emergency services - for emergencies, contact local emergency services directly</li>
                  <li>We don't serve as legal counsel or provide legal advice</li>
                </ul>
              </div>
            </Card>
          </section>

          {/* Section 3 */}
          <section id="user-accounts" className="legal-section">
            <Typography variant="h2">3. User Accounts and Authentication</Typography>
            
            <Typography variant="body1">
              <strong>Account Creation:</strong> You may create an account using OAuth authentication through supported providers 
              (Microsoft, Google, Facebook). We do not store your personal information from these providers.
            </Typography>
            
            <Typography variant="body1">
              <strong>Account Security:</strong> You are responsible for:
            </Typography>
            <ul>
              <li>Maintaining the security of your OAuth provider account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
            
            <Typography variant="body1">
              <strong>Account Termination:</strong> You may delete your account at any time through your profile settings. 
              We may suspend or terminate accounts that violate these Terms.
            </Typography>
          </section>

          {/* Section 4 */}
          <section id="acceptable-use" className="legal-section">
            <Typography variant="h2">4. Acceptable Use Policy</Typography>
            
            <div className="use-policy-grid">
              <Card className="allowed-card" padding="md">
                <CheckCircle size={20} className="policy-icon allowed" />
                <div>
                  <Typography variant="h4">Allowed Uses:</Typography>
                  <ul>
                    <li>Report genuine urban infrastructure issues</li>
                    <li>Monitor compliance and project progress</li>
                    <li>Engage constructively with other users</li>
                    <li>Provide accurate information and documentation</li>
                    <li>Use the service for legitimate civic engagement</li>
                  </ul>
                </div>
              </Card>
              
              <Card className="prohibited-card" variant="bordered" padding="md">
                <AlertTriangle size={20} className="policy-icon prohibited" />
                <div>
                  <Typography variant="h4">Prohibited Uses:</Typography>
                  <ul>
                    <li>Submit false, misleading, or spam reports</li>
                    <li>Harass, abuse, or threaten other users</li>
                    <li>Upload malicious content or attempt to compromise security</li>
                    <li>Use the service for political campaigning or commercial advertising</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Attempt to reverse engineer or hack the service</li>
                    <li>Create multiple accounts to circumvent restrictions</li>
                  </ul>
                </div>
              </Card>
            </div>
          </section>

          {/* Section 5 */}
          <section id="user-content" className="legal-section">
            <Typography variant="h2">5. User-Generated Content</Typography>
            
            <Typography variant="body1">
              <strong>Content Ownership:</strong> You retain ownership of content you submit (photos, descriptions, comments). 
              However, by submitting content, you grant UrbanAI a worldwide, royalty-free license to use, display, 
              and distribute your content for the purpose of operating the Service.
            </Typography>
            
            <Typography variant="body1">
              <strong>Content Standards:</strong> All user content must:
            </Typography>
            <ul>
              <li>Be accurate and factual to the best of your knowledge</li>
              <li>Not violate any third-party rights (privacy, intellectual property, etc.)</li>
              <li>Not contain offensive, discriminatory, or harmful material</li>
              <li>Be relevant to urban infrastructure and municipal issues</li>
            </ul>
            
            <Typography variant="body1">
              <strong>Content Moderation:</strong> We reserve the right to remove content that violates these Terms, 
              but we are not obligated to monitor or moderate all content.
            </Typography>
          </section>

          {/* Section 6 */}
          <section id="service-availability" className="legal-section">
            <Typography variant="h2">6. Service Availability</Typography>
            
            <Typography variant="body1">
              We strive to maintain service availability but cannot guarantee uninterrupted access. The Service may be temporarily 
              unavailable due to maintenance, updates, or circumstances beyond our control.
            </Typography>
            
            <Typography variant="body1">
              We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, 
              with or without notice.
            </Typography>
          </section>

          {/* Section 7 */}
          <section id="privacy-data" className="legal-section">
            <Typography variant="h2">7. Privacy and Data Protection</Typography>
            
            <Typography variant="body1">
              Your privacy is governed by our <Link to="/privacy" className="legal-link">Privacy Policy</Link>, 
              which is incorporated into these Terms by reference. By using the Service, you consent to our 
              data practices as described in the Privacy Policy.
            </Typography>
            
            <Card className="privacy-highlight" padding="md">
              <Shield size={20} />
              <div>
                <Typography variant="body1">
                  <strong>Key Privacy Commitments:</strong>
                </Typography>
                <ul>
                  <li>We store only anonymous identifiers, not personal information</li>
                  <li>Your profile data stays with your OAuth provider</li>
                  <li>You can delete your data at any time</li>
                  <li>We comply with GDPR, CCPA, and other privacy regulations</li>
                </ul>
              </div>
            </Card>
          </section>

          {/* Section 8 */}
          <section id="intellectual-property" className="legal-section">
            <Typography variant="h2">8. Intellectual Property</Typography>
            
            <Typography variant="body1">
              The UrbanAI service, including its software, design, text, and trademarks, is owned by UrbanAI and protected by 
              intellectual property laws. You may not copy, modify, distribute, or create derivative works without permission.
            </Typography>
            
            <Typography variant="body1">
              <strong>Third-Party Content:</strong> The Service may include content owned by third parties. 
              Such content remains the property of its respective owners.
            </Typography>
          </section>

          {/* Section 9 */}
          <section id="disclaimers" className="legal-section">
            <Typography variant="h2">9. Disclaimers and Limitations of Liability</Typography>
            
            <Card className="disclaimer-card" variant="bordered" padding="md">
              <Gavel size={20} />
              <div>
                <Typography variant="h4">Service Disclaimers:</Typography>
                <Typography variant="body1">
                  THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
                  EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                  AND NON-INFRINGEMENT.
                </Typography>
              </div>
            </Card>
            
            <Typography variant="body1">
              <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, UrbanAI shall not be liable for:
            </Typography>
            <ul>
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Actions or inactions of municipal authorities</li>
              <li>Accuracy or completeness of user-generated content</li>
              <li>Service interruptions or technical failures</li>
            </ul>
            
            <Typography variant="body1">
              Our total liability shall not exceed €100 or the amount you paid to use the Service (whichever is greater).
            </Typography>
          </section>

          {/* Section 10 */}
          <section id="indemnification" className="legal-section">
            <Typography variant="h2">10. Indemnification</Typography>
            
            <Typography variant="body1">
              You agree to indemnify, defend, and hold harmless UrbanAI, its officers, directors, employees, 
              and agents from any claims, damages, losses, or expenses arising from:
            </Typography>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you submit to the Service</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section id="termination" className="legal-section">
            <Typography variant="h2">11. Termination</Typography>
            
            <Typography variant="body1">
              Either party may terminate your access to the Service at any time:
            </Typography>
            <ul>
              <li><strong>By You:</strong> Delete your account through profile settings</li>
              <li><strong>By Us:</strong> For violation of these Terms, at our discretion, with or without notice</li>
            </ul>
            
            <Typography variant="body1">
              Upon termination, your right to use the Service ceases immediately. 
              Provisions that should survive termination (including disclaimers, limitations of liability, 
              and indemnification) will remain in effect.
            </Typography>
          </section>

          {/* Section 12 */}
          <section id="governing-law" className="legal-section">
            <Typography variant="h2">12. Governing Law and Disputes</Typography>
            
            <Typography variant="body1">
              These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.
            </Typography>
            
            <Typography variant="body1">
              <strong>Dispute Resolution:</strong> Any disputes arising from these Terms or the Service will be resolved through:
            </Typography>
            <ol>
              <li><strong>Direct Discussion:</strong> Contact us first to resolve issues informally</li>
              <li><strong>Mediation:</strong> If direct discussion fails, we'll attempt mediation</li>
              <li><strong>Arbitration:</strong> Final disputes will be resolved through binding arbitration</li>
            </ol>
          </section>

          {/* Section 13 */}
          <section id="changes" className="legal-section">
            <Typography variant="h2">13. Changes to Terms</Typography>
            
            <Typography variant="body1">
              We may update these Terms occasionally to reflect changes in our Service or legal requirements. When we do:
            </Typography>
            <ul>
              <li>We'll post the updated Terms on this page</li>
              <li>We'll update the "Last Modified" date</li>
              <li>For material changes, we'll notify you via email or in-app notification</li>
              <li>Continued use of the Service after changes constitutes acceptance</li>
            </ul>
          </section>

          {/* Section 14 */}
          <section id="contact" className="legal-section">
            <Typography variant="h2">14. Contact Information</Typography>
            
            <Typography variant="body1">
              Questions about these Terms? Contact us:
            </Typography>
            <div className="contact-info">
              <p><strong>Email:</strong> legal@urbanai.site</p>
              <p><strong>Support:</strong> support@urbanai.site</p>
              <p><strong>Address:</strong> UrbanAI Legal Department<br />
              [Your business address]</p>
            </div>
          </section>

          {/* Effective Date */}
          <section className="legal-section">
            <Card className="effective-date-card" variant="elevated" padding="md">
              <Typography variant="body1">
                <strong>Effective Date:</strong> These Terms of Service are effective as of {lastUpdated} and 
                supersede all previous versions.
              </Typography>
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

export default TermsOfServicePage;