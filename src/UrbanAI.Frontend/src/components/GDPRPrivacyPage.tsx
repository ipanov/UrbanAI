import React, { useState } from 'react';
import { Shield, Download, Trash2, Settings, ExternalLink, ChevronRight, User, Mail, Lock, Eye, Database, FileText } from 'lucide-react';
import './GDPRPrivacyPage.css';

interface UserData {
  userGuid: string;
  role: 'citizen' | 'investor' | 'authority';
  organizationName?: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: {
    notifications: boolean;
    weeklyReports: boolean;
    analytics: boolean;
  };
  casesReported: number;
  casesResolved: number;
}

const GDPRPrivacyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Mock user data - in real app, this would come from API
  const userData: UserData = {
    userGuid: 'oauth-guid-12345',
    role: 'citizen',
    createdAt: '2024-01-15T10:30:00Z',
    lastLoginAt: '2024-06-30T19:45:00Z',
    preferences: {
      notifications: true,
      weeklyReports: false,
      analytics: true
    },
    casesReported: 5,
    casesResolved: 3
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        exportDate: new Date().toISOString(),
        userData,
        cases: [
          { id: 'case-001', title: 'Broken sidewalk', status: 'resolved', reportedAt: '2024-06-01' },
          { id: 'case-002', title: 'Street lighting issue', status: 'under-review', reportedAt: '2024-06-15' }
        ],
        interactions: [
          { date: '2024-06-30', action: 'login', details: 'OAuth authentication' },
          { date: '2024-06-29', action: 'case_update', details: 'Case status changed to resolved' }
        ]
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `urbanai-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    // In real app, this would call the API
    console.log('Account deletion requested');
    setShowDeleteConfirm(false);
    // Redirect to confirmation page
  };

  const sections = [
    { id: 'overview', title: 'Privacy Overview', icon: Shield },
    { id: 'data', title: 'Your Data', icon: Database },
    { id: 'rights', title: 'Your Rights', icon: User },
    { id: 'export', title: 'Export Data', icon: Download },
    { id: 'delete', title: 'Delete Account', icon: Trash2 },
    { id: 'contact', title: 'Contact DPO', icon: Mail }
  ];

  return (
    <div className="gdpr-privacy-page">
      <div className="privacy-header">
        <div className="privacy-header-content">
          <div className="header-text">
            <h1><Shield className="header-icon" />Your Privacy Rights</h1>
            <p>UrbanAI is committed to protecting your privacy and ensuring GDPR compliance. 
               Your personal data stays with your OAuth provider and is never stored on our servers.</p>
          </div>
          <div className="privacy-badge">
            <Lock className="badge-icon" />
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>

      <div className="privacy-content">
        <nav className="privacy-sidebar">
          <h2>Privacy Center</h2>
          <ul className="privacy-nav">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <li key={section.id}>
                  <button 
                    className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon size={18} />
                    <span>{section.title}</span>
                    <ChevronRight size={16} className="nav-arrow" />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="privacy-main">
          {activeSection === 'overview' && (
            <div className="privacy-section">
              <h2>Privacy Overview</h2>
              <div className="overview-grid">
                <div className="overview-card">
                  <div className="card-header">
                    <Database className="card-icon" />
                    <h3>Data We Store</h3>
                  </div>
                  <ul>
                    <li>Anonymous OAuth identifier (GUID)</li>
                    <li>Role selection (Citizen/Investor/Authority)</li>
                    <li>Notification preferences</li>
                    <li>Issue reports (linked anonymously)</li>
                  </ul>
                </div>
                
                <div className="overview-card">
                  <div className="card-header">
                    <Eye className="card-icon" />
                    <h3>Data We Never Store</h3>
                  </div>
                  <ul>
                    <li>Your name (displayed from OAuth provider)</li>
                    <li>Your email address</li>
                    <li>Profile pictures or avatars</li>
                    <li>Any other personal information</li>
                  </ul>
                </div>
                
                <div className="overview-card">
                  <div className="card-header">
                    <Lock className="card-icon" />
                    <h3>How We Protect You</h3>
                  </div>
                  <ul>
                    <li>OAuth-only authentication</li>
                    <li>Client-side personalization</li>
                    <li>Anonymous case attribution</li>
                    <li>GDPR-compliant by design</li>
                  </ul>
                </div>
              </div>
              
              <div className="privacy-guarantee">
                <Shield className="guarantee-icon" />
                <div>
                  <h3>Our Privacy Guarantee</h3>
                  <p>Your personal information never leaves your OAuth provider. 
                     We only store the minimum data necessary to provide municipal issue tracking services.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="privacy-section">
              <h2>Your Data Summary</h2>
              
              <div className="data-summary">
                <div className="data-item">
                  <span className="data-label">User ID:</span>
                  <span className="data-value">{userData.userGuid}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Role:</span>
                  <span className="data-value">{userData.role}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Account Created:</span>
                  <span className="data-value">{new Date(userData.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Last Login:</span>
                  <span className="data-value">{new Date(userData.lastLoginAt).toLocaleDateString()}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Cases Reported:</span>
                  <span className="data-value">{userData.casesReported}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Cases Resolved:</span>
                  <span className="data-value">{userData.casesResolved}</span>
                </div>
              </div>

              <div className="preferences-section">
                <h3>Your Preferences</h3>
                <div className="preferences-grid">
                  <div className="preference-item">
                    <span>Email Notifications</span>
                    <span className={`status ${userData.preferences.notifications ? 'enabled' : 'disabled'}`}>
                      {userData.preferences.notifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="preference-item">
                    <span>Weekly Reports</span>
                    <span className={`status ${userData.preferences.weeklyReports ? 'enabled' : 'disabled'}`}>
                      {userData.preferences.weeklyReports ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="preference-item">
                    <span>Analytics Cookies</span>
                    <span className={`status ${userData.preferences.analytics ? 'enabled' : 'disabled'}`}>
                      {userData.preferences.analytics ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                <button className="btn btn-outline">
                  <Settings size={16} />
                  Update Preferences
                </button>
              </div>
            </div>
          )}

          {activeSection === 'rights' && (
            <div className="privacy-section">
              <h2>Your GDPR Rights</h2>
              
              <div className="rights-grid">
                <div className="right-card">
                  <h3>Right of Access (Article 15)</h3>
                  <p>You have the right to know what personal data we process about you.</p>
                  <div className="right-implementation">
                    <strong>UrbanAI Implementation:</strong>
                    <ul>
                      <li>View all data we store (anonymous ID + preferences only)</li>
                      <li>Export your data in machine-readable format</li>
                      <li>Self-service access available 24/7</li>
                    </ul>
                  </div>
                </div>

                <div className="right-card">
                  <h3>Right to Rectification (Article 16)</h3>
                  <p>You have the right to correct inaccurate personal data.</p>
                  <div className="right-implementation">
                    <strong>UrbanAI Implementation:</strong>
                    <ul>
                      <li>Update role and preferences in account settings</li>
                      <li>Personal info updated through your OAuth provider</li>
                      <li>Case information corrections via support</li>
                    </ul>
                  </div>
                </div>

                <div className="right-card">
                  <h3>Right to Erasure (Article 17)</h3>
                  <p>You have the right to have your personal data deleted.</p>
                  <div className="right-implementation">
                    <strong>UrbanAI Implementation:</strong>
                    <ul>
                      <li>Complete account deletion available</li>
                      <li>All data permanently removed within 30 days</li>
                      <li>Cascade deletion of cases and interactions</li>
                    </ul>
                  </div>
                </div>

                <div className="right-card">
                  <h3>Right to Data Portability (Article 20)</h3>
                  <p>You can get your data in a machine-readable format.</p>
                  <div className="right-implementation">
                    <strong>UrbanAI Implementation:</strong>
                    <ul>
                      <li>JSON export of all your data</li>
                      <li>Includes cases, preferences, and history</li>
                      <li>Transfer to other services</li>
                    </ul>
                  </div>
                </div>

                <div className="right-card">
                  <h3>Right to Object (Article 21)</h3>
                  <p>You can object to certain types of data processing.</p>
                  <div className="right-implementation">
                    <strong>UrbanAI Implementation:</strong>
                    <ul>
                      <li>Opt-out of analytics and tracking</li>
                      <li>Disable non-essential communications</li>
                      <li>Object to automated processing</li>
                    </ul>
                  </div>
                </div>

                <div className="right-card">
                  <h3>Right to Restriction (Article 18)</h3>
                  <p>You can limit how we use your data in certain circumstances.</p>
                  <div className="right-implementation">
                    <strong>UrbanAI Implementation:</strong>
                    <ul>
                      <li>Pause notifications while keeping account</li>
                      <li>Suspend case processing during disputes</li>
                      <li>Temporary processing restrictions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="official-resources">
                <h3>Official EU GDPR Resources</h3>
                <div className="resource-links">
                  <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="noopener noreferrer" className="resource-link">
                    <FileText size={16} />
                    <span>Official GDPR Text (EU Regulation 2016/679)</span>
                    <ExternalLink size={14} />
                  </a>
                  <a href="https://edpb.europa.eu/our-work-tools/our-documents/guidelines_en" target="_blank" rel="noopener noreferrer" className="resource-link">
                    <FileText size={16} />
                    <span>EDPB Guidelines and Recommendations</span>
                    <ExternalLink size={14} />
                  </a>
                  <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer" className="resource-link">
                    <FileText size={16} />
                    <span>National Data Protection Authorities</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'export' && (
            <div className="privacy-section">
              <h2>Export Your Data</h2>
              
              <div className="export-info">
                <Download className="export-icon" />
                <div>
                  <h3>Data Export</h3>
                  <p>Download all the data we have about you in a machine-readable JSON format. 
                     This includes your account information, preferences, case reports, and interaction history.</p>
                </div>
              </div>

              <div className="export-details">
                <h4>What's included in your export:</h4>
                <ul>
                  <li>Account information (anonymous ID, role, creation date)</li>
                  <li>Your notification and privacy preferences</li>
                  <li>All cases you've reported and their current status</li>
                  <li>Your interaction history with the platform</li>
                  <li>Communication records (anonymized)</li>
                </ul>
                
                <div className="export-note">
                  <strong>Note:</strong> Your name, email, and profile information are not included 
                  because they're never stored on UrbanAI servers. This data stays with your OAuth provider.
                </div>
              </div>

              <button 
                className="btn btn-primary export-btn"
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <div className="spinner" />
                    Preparing Export...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Export My Data
                  </>
                )}
              </button>
            </div>
          )}

          {activeSection === 'delete' && (
            <div className="privacy-section">
              <h2>Delete Your Account</h2>
              
              <div className="delete-warning">
                <Trash2 className="warning-icon" />
                <div>
                  <h3>Permanent Account Deletion</h3>
                  <p>This action cannot be undone. All your data will be permanently deleted 
                     within 30 days, including your cases, preferences, and interaction history.</p>
                </div>
              </div>

              <div className="delete-info">
                <h4>What happens when you delete your account:</h4>
                <ul>
                  <li>Your anonymous user ID is immediately removed</li>
                  <li>All your case reports are deleted or anonymized</li>
                  <li>Your preferences and settings are erased</li>
                  <li>Your interaction history is permanently deleted</li>
                  <li>You'll be logged out and cannot recover your data</li>
                </ul>
                
                <div className="delete-alternative">
                  <strong>Alternative:</strong> If you just want to stop receiving notifications, 
                  you can update your preferences instead of deleting your account.
                </div>
              </div>

              {!showDeleteConfirm ? (
                <button 
                  className="btn btn-danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={16} />
                  Delete My Account
                </button>
              ) : (
                <div className="delete-confirm">
                  <p><strong>Are you absolutely sure?</strong> This action cannot be undone.</p>
                  <div className="confirm-actions">
                    <button 
                      className="btn btn-outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete My Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="privacy-section">
              <h2>Contact Our Data Protection Officer</h2>
              
              <div className="contact-info">
                <div className="contact-card">
                  <Mail className="contact-icon" />
                  <div>
                    <h3>Data Protection Officer</h3>
                    <p><strong>Email:</strong> dpo@urbanai.app</p>
                    <p><strong>Response Time:</strong> Within 72 hours (maximum 30 days per GDPR)</p>
                    <p><strong>Certification:</strong> Certified Information Privacy Professional (CIPP/E)</p>
                  </div>
                </div>

                <div className="contact-card">
                  <User className="contact-icon" />
                  <div>
                    <h3>Privacy Rights Requests</h3>
                    <p><strong>Email:</strong> privacy@urbanai.app</p>
                    <p><strong>Subject Line:</strong> "GDPR Rights Request - [Type of Request]"</p>
                    <p>Include your OAuth provider and approximate account creation date</p>
                  </div>
                </div>
              </div>

              <div className="supervisory-authority">
                <h3>Supervisory Authority</h3>
                <p>You have the right to lodge a complaint with your national data protection authority:</p>
                <a 
                  href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="authority-link"
                >
                  <ExternalLink size={16} />
                  Find Your National Data Protection Authority
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GDPRPrivacyPage;