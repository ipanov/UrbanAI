import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UrbanAILogoPlaceholder } from './UrbanAILogo';
import { Card, Typography } from './atoms';
import {
  User,
  Database,
  FileText,
  Download,
  Trash2,
  Shield,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Info,
  X
} from 'lucide-react';
import './GDPRDataManagement.css';

/**
 * GDPR Data Management Page
 *
 * Comprehensive data management interface matching the mock design.
 * Provides users with full control over their personal data and privacy rights.
 */
const GDPRDataManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnonymizeModal, setShowAnonymizeModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Shield size={16} /> },
    { id: 'my-data', label: 'My Data', icon: <Database size={16} /> },
    { id: 'my-issues', label: 'My Issues', icon: <FileText size={16} /> },
    { id: 'export', label: 'Export Data', icon: <Download size={16} /> },
    { id: 'delete', label: 'Delete Account', icon: <Trash2 size={16} /> }
  ];

  const mockUserData = {
    id: "usr_3a4b5c6d7e8f9g0h",
    username: "google_108234567890123456789",
    role: "User",
    createdAt: "2024-01-15T14:30:22.123Z",
    provider: "Google",
    externalId: "108234567890123456789",
    issuesCount: 3
  };

  const mockIssues = [
    {
      id: "ISS-2024-001",
      title: "Pothole on Main Street",
      status: "Municipal Review",
      statusClass: "status-municipal",
      reported: "2024-01-20",
      canEdit: false
    },
    {
      id: "ISS-2024-002",
      title: "Broken streetlight",
      status: "In Progress",
      statusClass: "status-in-progress",
      reported: "2024-01-18",
      canEdit: true
    },
    {
      id: "ISS-2024-003",
      title: "Graffiti in park",
      status: "Open",
      statusClass: "status-open",
      reported: "2024-01-22",
      canEdit: true
    }
  ];

  const exportData = () => {
    const exportData = {
      user: {
        id: mockUserData.id,
        username: mockUserData.username,
        role: mockUserData.role,
        createdAt: mockUserData.createdAt
      },
      externalLogins: [{
        provider: mockUserData.provider,
        externalId: mockUserData.externalId,
        createdAt: mockUserData.createdAt
      }],
      issues: mockIssues.map(issue => ({
        id: issue.id,
        title: issue.title,
        description: `${issue.title} - reported issue`,
        status: issue.status,
        createdAt: `${issue.reported}T10:15:30.000Z`,
        location: { lat: 40.7128, lng: -74.0060 }
      })),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urbanai-data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportClientData = () => {
    alert('This would export browser-stored data like display name, email, and profile picture.');
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation === 'DELETE') {
      alert('Account deletion request submitted. You will receive a confirmation email.');
      setShowDeleteModal(false);
      setDeleteConfirmation('');
    }
  };

  const handleAnonymizeConfirm = () => {
    alert('Data anonymization request submitted. Your personal connection to issues will be removed.');
    setShowAnonymizeModal(false);
  };

  const editIssue = (issueId: string) => {
    alert(`Editing issue ${issueId} - this would open an edit form.`);
  };

  return (
    <div className="gdpr-page">
      <div className="gdpr-container">
        {/* Header */}
        <header className="gdpr-header">
          <Link to="/" className="logo-link">
            <UrbanAILogoPlaceholder variant="primary" size={32} />
            <span className="logo-text">UrbanAI</span>
          </Link>
          <div className="user-info">
            <div className="user-avatar">JD</div>
            <span className="user-name">Anonymous User</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="gdpr-main">
          <div className="page-header">
            <Typography variant="h1">My Data & Privacy</Typography>
            <Typography variant="body1" color="secondary">
              Manage your personal data and privacy settings
            </Typography>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-panel">
                <Card className="privacy-rights-card" padding="lg">
                  <Typography variant="h2">Your Privacy Rights</Typography>
                  <Typography variant="body1" color="secondary">
                    Under GDPR, you have comprehensive rights over your personal data. Here's what you can do:
                  </Typography>

                  <div className="rights-list">
                    <div className="right-item">
                      <Eye size={20} />
                      <div>
                        <Typography variant="body2"><strong>Access your data</strong></Typography>
                        <Typography variant="body2" color="secondary">View all personal information we store</Typography>
                      </div>
                    </div>
                    <div className="right-item">
                      <Download size={20} />
                      <div>
                        <Typography variant="body2"><strong>Export your data</strong></Typography>
                        <Typography variant="body2" color="secondary">Download a copy in machine-readable format</Typography>
                      </div>
                    </div>
                    <div className="right-item">
                      <Edit size={20} />
                      <div>
                        <Typography variant="body2"><strong>Correct your data</strong></Typography>
                        <Typography variant="body2" color="secondary">Update or fix incorrect information</Typography>
                      </div>
                    </div>
                    <div className="right-item">
                      <Trash2 size={20} />
                      <div>
                        <Typography variant="body2"><strong>Delete your data</strong></Typography>
                        <Typography variant="body2" color="secondary">Request removal of your personal information</Typography>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="data-summary-card" padding="lg">
                  <Typography variant="h2">Data Processing Summary</Typography>
                  <Typography variant="body1" color="secondary">
                    UrbanAI follows privacy-by-design principles:
                  </Typography>

                  <div className="info-box">
                    <Info size={20} />
                    <div>
                      <Typography variant="h4">Zero-PII Architecture</Typography>
                      <Typography variant="body1">
                        We don't store names, emails, or personal identifiers. Your identity remains with your OAuth provider.
                      </Typography>
                    </div>
                  </div>

                  <div className="data-summary-grid">
                    <div className="summary-item">
                      <Typography variant="body2"><strong>Account Created</strong></Typography>
                      <Typography variant="body2" color="secondary">2024-01-15 14:30:22 UTC</Typography>
                    </div>
                    <div className="summary-item">
                      <Typography variant="body2"><strong>Authentication Provider</strong></Typography>
                      <Typography variant="body2" color="secondary">Google OAuth</Typography>
                    </div>
                    <div className="summary-item">
                      <Typography variant="body2"><strong>Issues Reported</strong></Typography>
                      <Typography variant="body2" color="secondary">{mockUserData.issuesCount} issues</Typography>
                    </div>
                    <div className="summary-item">
                      <Typography variant="body2"><strong>Data Retention</strong></Typography>
                      <Typography variant="body2" color="secondary">Until account deletion requested</Typography>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* My Data Tab */}
            {activeTab === 'my-data' && (
              <div className="tab-panel">
                <Card className="account-info-card" padding="lg">
                  <Typography variant="h2">Account Information</Typography>
                  <Typography variant="body1" color="secondary">
                    Basic account data stored in our system:
                  </Typography>

                  <div className="data-grid">
                    <div className="data-item">
                      <Typography variant="body2"><strong>User ID</strong></Typography>
                      <Typography variant="body2" className="data-value">{mockUserData.id}</Typography>
                    </div>
                    <div className="data-item">
                      <Typography variant="body2"><strong>Username</strong></Typography>
                      <Typography variant="body2" className="data-value">{mockUserData.username}</Typography>
                    </div>
                    <div className="data-item">
                      <Typography variant="body2"><strong>Role</strong></Typography>
                      <Typography variant="body2" className="data-value">{mockUserData.role}</Typography>
                    </div>
                    <div className="data-item">
                      <Typography variant="body2"><strong>Created At</strong></Typography>
                      <Typography variant="body2" className="data-value">{mockUserData.createdAt}</Typography>
                    </div>
                  </div>
                </Card>

                <Card className="oauth-links-card" padding="lg">
                  <Typography variant="h2">OAuth Provider Links</Typography>
                  <Typography variant="body1" color="secondary">
                    External authentication providers linked to your account:
                  </Typography>

                  <div className="data-grid">
                    <div className="data-item">
                      <Typography variant="body2"><strong>Provider</strong></Typography>
                      <Typography variant="body2" className="data-value">{mockUserData.provider}</Typography>
                    </div>
                    <div className="data-item">
                      <Typography variant="body2"><strong>External ID</strong></Typography>
                      <Typography variant="body2" className="data-value">{mockUserData.externalId}</Typography>
                    </div>
                    <div className="data-item">
                      <Typography variant="body2"><strong>Linked On</strong></Typography>
                      <Typography variant="body2" className="data-value">{mockUserData.createdAt}</Typography>
                    </div>
                  </div>
                </Card>

                <Card className="client-data-card" padding="lg">
                  <Typography variant="h2">Client-Side Data</Typography>
                  <Typography variant="body1" color="secondary">
                    Personal information stored only in your browser:
                  </Typography>

                  <div className="info-box">
                    <Shield size={20} />
                    <div>
                      <Typography variant="h4">Privacy Protection</Typography>
                      <Typography variant="body1">
                        This data is never sent to our servers and remains under your control.
                      </Typography>
                    </div>
                  </div>

                  <div className="data-grid">
                    <div className="data-item">
                      <Typography variant="body2"><strong>Display Name</strong></Typography>
                      <Typography variant="body2" className="data-value">John Doe (stored locally)</Typography>
                    </div>
                    <div className="data-item">
                      <Typography variant="body2"><strong>Email</strong></Typography>
                      <Typography variant="body2" className="data-value">john.doe@gmail.com (stored locally)</Typography>
                    </div>
                    <div className="data-item">
                      <Typography variant="body2"><strong>Profile Picture</strong></Typography>
                      <Typography variant="body2" className="data-value">OAuth provider URL (stored locally)</Typography>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* My Issues Tab */}
            {activeTab === 'my-issues' && (
              <div className="tab-panel">
                <Card className="issues-card" padding="lg">
                  <Typography variant="h2">Issues You've Reported</Typography>
                  <Typography variant="body1" color="secondary">
                    All urban issues you've reported through UrbanAI:
                  </Typography>

                  <div className="issues-table-container">
                    <table className="issues-table">
                      <thead>
                        <tr>
                          <th>Issue ID</th>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Reported</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockIssues.map(issue => (
                          <tr key={issue.id}>
                            <td>{issue.id}</td>
                            <td>{issue.title}</td>
                            <td>
                              <span className={`status-badge ${issue.statusClass}`}>
                                {issue.status}
                              </span>
                            </td>
                            <td>{issue.reported}</td>
                            <td>
                              {issue.canEdit ? (
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => editIssue(issue.id)}
                                >
                                  Edit
                                </button>
                              ) : (
                                <button
                                  className="btn btn-secondary"
                                  disabled
                                  title="Issue in municipal pipeline - cannot edit"
                                >
                                  View Only
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="warning-box">
                    <AlertTriangle size={20} />
                    <div>
                      <Typography variant="h4">Data Deletion Policy</Typography>
                      <Typography variant="body1">
                        Issues that have entered the municipal review process cannot be fully deleted due to public interest requirements.
                        However, your personal connection to these issues can be anonymized while preserving the municipal data.
                      </Typography>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Export Data Tab */}
            {activeTab === 'export' && (
              <div className="tab-panel">
                <Card className="export-card" padding="lg">
                  <Typography variant="h2">Export Your Data</Typography>
                  <Typography variant="body1" color="secondary">
                    Download a complete copy of your personal data in machine-readable format (JSON).
                  </Typography>

                  <div className="info-box">
                    <Info size={20} />
                    <div>
                      <Typography variant="h4">What's Included</Typography>
                      <Typography variant="body1">
                        Your export will include: account information, OAuth provider links, all issues you've reported,
                        and associated metadata. Client-side data must be exported separately from your browser.
                      </Typography>
                    </div>
                  </div>

                  <div className="export-details">
                    <div className="detail-item">
                      <Typography variant="body2"><strong>Export Format</strong></Typography>
                      <Typography variant="body2" color="secondary">JSON (machine-readable)</Typography>
                    </div>
                    <div className="detail-item">
                      <Typography variant="body2"><strong>Data Scope</strong></Typography>
                      <Typography variant="body2" color="secondary">All personal data we store</Typography>
                    </div>
                    <div className="detail-item">
                      <Typography variant="body2"><strong>Processing Time</strong></Typography>
                      <Typography variant="body2" color="secondary">Immediate download</Typography>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <button className="btn btn-primary" onClick={exportData}>
                      <Download size={16} />
                      Download My Data
                    </button>
                    <button className="btn btn-secondary" onClick={exportClientData}>
                      📱 Export Client-Side Data
                    </button>
                  </div>
                </Card>

                <Card className="export-history-card" padding="lg">
                  <Typography variant="h2">Export History</Typography>
                  <Typography variant="body1" color="secondary">
                    Previous data exports for your records:
                  </Typography>

                  <div className="export-history">
                    <div className="history-item">
                      <Typography variant="body2"><strong>Last Export</strong></Typography>
                      <Typography variant="body2" color="secondary">Never exported</Typography>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Delete Account Tab */}
            {activeTab === 'delete' && (
              <div className="tab-panel">
                <Card className="delete-card" padding="lg">
                  <Typography variant="h2">Delete My Account</Typography>
                  <Typography variant="body1" color="secondary">
                    Permanently remove your account and personal data from UrbanAI.
                  </Typography>

                  <div className="warning-box">
                    <AlertTriangle size={20} />
                    <div>
                      <Typography variant="h4">Important: This Action Cannot Be Undone</Typography>
                      <Typography variant="body1">
                        Account deletion will permanently remove your access to UrbanAI and delete your personal data.
                        This process typically completes within 30 days.
                      </Typography>
                    </div>
                  </div>

                  <Typography variant="h3">What happens when you delete your account:</Typography>

                  <div className="deletion-process">
                    <div className="process-item">
                      <CheckCircle size={16} className="success-icon" />
                      <div>
                        <Typography variant="body2"><strong>Immediately Deleted</strong></Typography>
                        <Typography variant="body2" color="secondary">Account access, OAuth links, personal identifiers</Typography>
                      </div>
                    </div>
                    <div className="process-item">
                      <Shield size={16} className="info-icon" />
                      <div>
                        <Typography variant="body2"><strong>Anonymized (30 days)</strong></Typography>
                        <Typography variant="body2" color="secondary">Issues in municipal pipeline (public interest exception)</Typography>
                      </div>
                    </div>
                    <div className="process-item">
                      <Trash2 size={16} className="danger-icon" />
                      <div>
                        <Typography variant="body2"><strong>Fully Deleted (30 days)</strong></Typography>
                        <Typography variant="body2" color="secondary">Issues not yet in municipal review</Typography>
                      </div>
                    </div>
                    <div className="process-item">
                      <User size={16} className="warning-icon" />
                      <div>
                        <Typography variant="body2"><strong>Your Responsibility</strong></Typography>
                        <Typography variant="body2" color="secondary">Clear browser data and OAuth provider permissions</Typography>
                      </div>
                    </div>
                  </div>

                  <div className="info-box">
                    <Info size={20} />
                    <div>
                      <Typography variant="h4">Legal Exceptions</Typography>
                      <Typography variant="body1">
                        Some data may be retained longer if required by law or for legitimate public interests (e.g., ongoing municipal processes, legal obligations, or statistical purposes).
                      </Typography>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <button
                      className="btn btn-danger"
                      onClick={() => setShowDeleteModal(true)}
                      data-testid="delete-account-button"
                    >
                      <Trash2 size={16} />
                      Delete My Account
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => setShowAnonymizeModal(true)}
                      data-testid="anonymize-data-button"
                    >
                      <Shield size={16} />
                      Anonymize My Data Only
                    </button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <Typography variant="h3">Confirm Account Deletion</Typography>
                <button
                  className="modal-close"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <Typography variant="body1">
                Are you absolutely sure you want to delete your UrbanAI account?
              </Typography>

              <div className="warning-box">
                <AlertTriangle size={20} />
                <div>
                  <Typography variant="h4">This action cannot be undone</Typography>
                  <Typography variant="body1">
                    All your personal data will be permanently deleted. Issues in municipal review will be anonymized to remove your personal connection.
                  </Typography>
                </div>
              </div>

              <Typography variant="body1">
                Type <strong>DELETE</strong> to confirm:
              </Typography>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE here"
                className="delete-input"
              />

              <div className="modal-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                  disabled={deleteConfirmation !== 'DELETE'}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Anonymize Confirmation Modal */}
        {showAnonymizeModal && (
          <div className="modal-overlay" onClick={() => setShowAnonymizeModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <Typography variant="h3">Anonymize My Data</Typography>
                <button
                  className="modal-close"
                  onClick={() => setShowAnonymizeModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <Typography variant="body1">
                This will remove your personal connection to all issues while keeping the issue data for municipal purposes.
              </Typography>

              <div className="info-box">
                <Info size={20} />
                <div>
                  <Typography variant="h4">What happens:</Typography>
                  <Typography variant="body1">
                    Your account will be deleted, but issues you reported will remain in the system without any personal identifiers linking them to you.
                  </Typography>
                </div>
              </div>

              <div className="modal-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAnonymizeModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-warning"
                  onClick={handleAnonymizeConfirm}
                >
                  Anonymize Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GDPRDataManagementPage;
