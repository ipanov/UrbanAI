import React, { useState } from 'react';
import { Download, Trash2, Shield, Database, FileText } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

interface ExternalLogin {
  provider: string;
  externalId: string;
  createdAt: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Municipal Review' | 'Resolved';
  createdAt: string;
  location: {
    lat: number;
    lng: number;
  };
  canEdit: boolean;
}

interface ClientSideData {
  displayName: string;
  email: string;
  profilePicture: string;
}

const GDPRDataManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnonymizeModal, setShowAnonymizeModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data - in real app, this would come from API
  const userData: UserData = {
    id: 'usr_3a4b5c6d7e8f9g0h',
    username: 'google_108234567890123456789',
    role: 'User',
    createdAt: '2024-01-15T14:30:22.123Z'
  };

  const externalLogins: ExternalLogin[] = [
    {
      provider: 'Google',
      externalId: '108234567890123456789',
      createdAt: '2024-01-15T14:30:22.123Z'
    }
  ];

  const issues: Issue[] = [
    {
      id: 'ISS-2024-001',
      title: 'Pothole on Main Street',
      description: 'Large pothole causing vehicle damage',
      status: 'Municipal Review',
      createdAt: '2024-01-20T10:15:30.000Z',
      location: { lat: 40.7128, lng: -74.0060 },
      canEdit: false
    },
    {
      id: 'ISS-2024-002',
      title: 'Broken streetlight',
      description: 'Streetlight not working for 3 days',
      status: 'In Progress',
      createdAt: '2024-01-18T16:22:45.000Z',
      location: { lat: 40.7589, lng: -73.9851 },
      canEdit: true
    },
    {
      id: 'ISS-2024-003',
      title: 'Graffiti in park',
      description: 'Vandalism on park bench',
      status: 'Open',
      createdAt: '2024-01-22T09:33:12.000Z',
      location: { lat: 40.7831, lng: -73.9712 },
      canEdit: true
    }
  ];

  const clientSideData: ClientSideData = {
    displayName: 'John Doe',
    email: 'john.doe@gmail.com',
    profilePicture: 'OAuth provider URL'
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        user: userData,
        externalLogins,
        issues,
        exportedAt: new Date().toISOString()
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

  const handleExportClientData = () => {
    alert('This would export browser-stored data like display name, email, and profile picture.');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      alert('Account deletion request submitted. You will receive a confirmation email.');
      setShowDeleteModal(false);
      setDeleteConfirmation('');
    }
  };

  const handleAnonymizeData = () => {
    alert('Data anonymization request submitted. Your personal connection to issues will be removed.');
    setShowAnonymizeModal(false);
  };

  const getStatusBadge = (status: Issue['status']) => {
    const statusClasses = {
      'Open': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Municipal Review': 'bg-purple-100 text-purple-800',
      'Resolved': 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', title: 'Overview', icon: Shield },
    { id: 'my-data', title: 'My Data', icon: Database },
    { id: 'my-issues', title: 'My Issues', icon: FileText },
    { id: 'export', title: 'Export Data', icon: Download },
    { id: 'delete', title: 'Delete Account', icon: Trash2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-blue-600 text-2xl font-bold">🏙️ UrbanAI</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                JD
              </div>
              <span className="text-gray-600">Anonymous User</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Data & Privacy</h1>
          <p className="text-gray-600">Manage your personal data and privacy settings</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.title}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Your Privacy Rights</h2>
              <p className="text-gray-600 mb-4">Under GDPR, you have comprehensive rights over your personal data. Here's what you can do:</p>
              
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-medium">📋 Access your data</span>
                  <span className="text-gray-600">View all personal information we store</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-medium">📥 Export your data</span>
                  <span className="text-gray-600">Download a copy in machine-readable format</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-medium">✏️ Correct your data</span>
                  <span className="text-gray-600">Update or fix incorrect information</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-medium">🗑️ Delete your data</span>
                  <span className="text-gray-600">Request removal of your personal information</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Data Processing Summary</h2>
              <p className="text-gray-600 mb-4">UrbanAI follows privacy-by-design principles:</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">Zero-PII Architecture</h3>
                <p className="text-blue-700 text-sm">We don't store names, emails, or personal identifiers. Your identity remains with your OAuth provider.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Account Created</span>
                  <span className="text-gray-600 font-mono text-sm">2024-01-15 14:30:22 UTC</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Authentication Provider</span>
                  <span className="text-gray-600">Google OAuth</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Issues Reported</span>
                  <span className="text-gray-600">{issues.length} issues</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Data Retention</span>
                  <span className="text-gray-600">Until account deletion requested</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-data' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              <p className="text-gray-600 mb-4">Basic account data stored in our system:</p>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="font-medium">User ID</span>
                  <span className="text-gray-600 font-mono text-sm">{userData.id}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Username</span>
                  <span className="text-gray-600 font-mono text-sm">{userData.username}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Role</span>
                  <span className="text-gray-600">{userData.role}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Created At</span>
                  <span className="text-gray-600 font-mono text-sm">{userData.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">OAuth Provider Links</h2>
              <p className="text-gray-600 mb-4">External authentication providers linked to your account:</p>
              
              {externalLogins.map((login, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Provider</span>
                    <span className="text-gray-600">{login.provider}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">External ID</span>
                    <span className="text-gray-600 font-mono text-sm">{login.externalId}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Linked On</span>
                    <span className="text-gray-600 font-mono text-sm">{login.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Client-Side Data</h2>
              <p className="text-gray-600 mb-4">Personal information stored only in your browser:</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">Privacy Protection</h3>
                <p className="text-blue-700 text-sm">This data is never sent to our servers and remains under your control.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Display Name</span>
                  <span className="text-gray-600">{clientSideData.displayName} (stored locally)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Email</span>
                  <span className="text-gray-600">{clientSideData.email} (stored locally)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Profile Picture</span>
                  <span className="text-gray-600">{clientSideData.profilePicture} (stored locally)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-issues' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Issues You've Reported</h2>
              <p className="text-gray-600 mb-4">All urban issues you've reported through UrbanAI:</p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {issues.map(issue => (
                      <tr key={issue.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(issue.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {issue.canEdit ? (
                            <button className="text-blue-600 hover:text-blue-900">Edit</button>
                          ) : (
                            <button disabled className="text-gray-400 cursor-not-allowed" title="Issue in municipal pipeline - cannot edit">
                              View Only
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Data Deletion Policy</h3>
                <p className="text-yellow-700 text-sm">
                  Issues that have entered the municipal review process cannot be fully deleted due to public interest requirements.
                  However, your personal connection to these issues can be anonymized while preserving the municipal data.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Export Your Data</h2>
              <p className="text-gray-600 mb-4">Download a complete copy of your personal data in machine-readable format (JSON).</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">What's Included</h3>
                <p className="text-blue-700 text-sm">
                  Your export will include: account information, OAuth provider links, all issues you've reported,
                  and associated metadata. Client-side data must be exported separately from your browser.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Export Format</span>
                  <span className="text-gray-600">JSON (machine-readable)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Data Scope</span>
                  <span className="text-gray-600">All personal data we store</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Processing Time</span>
                  <span className="text-gray-600">Immediate download</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Preparing...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Download My Data
                    </>
                  )}
                </button>
                <button
                  onClick={handleExportClientData}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300"
                >
                  <Download size={16} />
                  Export Client-Side Data
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Export History</h2>
              <p className="text-gray-600 mb-4">Previous data exports for your records:</p>
              
              <div className="flex justify-between py-2">
                <span className="font-medium">Last Export</span>
                <span className="text-gray-600">Never exported</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'delete' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Delete My Account</h2>
              <p className="text-gray-600 mb-4">Permanently remove your account and personal data from UrbanAI.</p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">Important: This Action Cannot Be Undone</h3>
                <p className="text-red-700 text-sm">
                  Account deletion will permanently remove your access to UrbanAI and delete your personal data.
                  This process typically completes within 30 days.
                </p>
              </div>

              <h3 className="text-lg font-semibold mb-3">What happens when you delete your account:</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2">
                  <span className="font-medium">✅ Immediately Deleted</span>
                  <span className="text-gray-600">Account access, OAuth links, personal identifiers</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">🔒 Anonymized (30 days)</span>
                  <span className="text-gray-600">Issues in municipal pipeline (public interest exception)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">🗑️ Fully Deleted (30 days)</span>
                  <span className="text-gray-600">Issues not yet in municipal review</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">📱 Your Responsibility</span>
                  <span className="text-gray-600">Clear browser data and OAuth provider permissions</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Legal Exceptions</h3>
                <p className="text-blue-700 text-sm">
                  Some data may be retained longer if required by law or for legitimate public interests (e.g., ongoing municipal processes, legal obligations, or statistical purposes).
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  <Trash2 size={16} />
                  Delete My Account
                </button>
                <button
                  onClick={() => setShowAnonymizeModal(true)}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                >
                  <Shield size={16} />
                  Anonymize My Data Only
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Account Deletion</h2>
            <p className="text-gray-600 mb-4">Are you absolutely sure you want to delete your UrbanAI account?</p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-red-800 mb-2">This action cannot be undone</h3>
              <p className="text-red-700 text-sm">
                All your personal data will be permanently deleted. Issues in municipal review will be anonymized to remove your personal connection.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <strong>DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anonymize Confirmation Modal */}
      {showAnonymizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Anonymize My Data</h2>
            <p className="text-gray-600 mb-4">This will remove your personal connection to all issues while keeping the issue data for municipal purposes.</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">What happens:</h3>
              <p className="text-blue-700 text-sm">
                Your account will be deleted, but issues you reported will remain in the system without any personal identifiers linking them to you.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAnonymizeModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAnonymizeData}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Anonymize Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GDPRDataManagement;