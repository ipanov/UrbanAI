import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  canEdit: boolean;
}

const GDPRDataManagementScreen: React.FC = () => {
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
      canEdit: false
    },
    {
      id: 'ISS-2024-002',
      title: 'Broken streetlight',
      description: 'Streetlight not working for 3 days',
      status: 'In Progress',
      createdAt: '2024-01-18T16:22:45.000Z',
      canEdit: true
    },
    {
      id: 'ISS-2024-003',
      title: 'Graffiti in park',
      description: 'Vandalism on park bench',
      status: 'Open',
      createdAt: '2024-01-22T09:33:12.000Z',
      canEdit: true
    }
  ];

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

      const dataString = JSON.stringify(exportData, null, 2);
      
      await Share.share({
        message: 'UrbanAI Data Export',
        title: 'UrbanAI Data Export',
        url: `data:application/json;base64,${Buffer.from(dataString).toString('base64')}`,
      });
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      Alert.alert(
        'Account Deletion',
        'Account deletion request submitted. You will receive a confirmation email.',
        [{ text: 'OK', onPress: () => {
          setShowDeleteModal(false);
          setDeleteConfirmation('');
        }}]
      );
    } else {
      Alert.alert('Invalid Confirmation', 'Please type DELETE to confirm.');
    }
  };

  const handleAnonymizeData = () => {
    Alert.alert(
      'Data Anonymization',
      'Data anonymization request submitted. Your personal connection to issues will be removed.',
      [{ text: 'OK', onPress: () => setShowAnonymizeModal(false) }]
    );
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'Open': return '#F59E0B';
      case 'In Progress': return '#3B82F6';
      case 'Municipal Review': return '#8B5CF6';
      case 'Resolved': return '#10B981';
      default: return '#6B7280';
    }
  };

  const tabs = [
    { id: 'overview', title: 'Overview', icon: 'shield' },
    { id: 'my-data', title: 'My Data', icon: 'storage' },
    { id: 'my-issues', title: 'My Issues', icon: 'description' },
    { id: 'export', title: 'Export', icon: 'download' },
    { id: 'delete', title: 'Delete', icon: 'delete' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Your Privacy Rights</Text>
              <Text style={styles.cardDescription}>
                Under GDPR, you have comprehensive rights over your personal data. Here's what you can do:
              </Text>
              
              <View style={styles.rightsList}>
                <View style={styles.rightItem}>
                  <Text style={styles.rightLabel}>📋 Access your data</Text>
                  <Text style={styles.rightValue}>View all personal information we store</Text>
                </View>
                <View style={styles.rightItem}>
                  <Text style={styles.rightLabel}>📥 Export your data</Text>
                  <Text style={styles.rightValue}>Download a copy in machine-readable format</Text>
                </View>
                <View style={styles.rightItem}>
                  <Text style={styles.rightLabel}>✏️ Correct your data</Text>
                  <Text style={styles.rightValue}>Update or fix incorrect information</Text>
                </View>
                <View style={styles.rightItem}>
                  <Text style={styles.rightLabel}>🗑️ Delete your data</Text>
                  <Text style={styles.rightValue}>Request removal of your personal information</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Data Processing Summary</Text>
              <Text style={styles.cardDescription}>UrbanAI follows privacy-by-design principles:</Text>
              
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Zero-PII Architecture</Text>
                <Text style={styles.infoText}>
                  We don't store names, emails, or personal identifiers. Your identity remains with your OAuth provider.
                </Text>
              </View>

              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Account Created</Text>
                <Text style={styles.dataValue}>2024-01-15 14:30:22 UTC</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Authentication Provider</Text>
                <Text style={styles.dataValue}>Google OAuth</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Issues Reported</Text>
                <Text style={styles.dataValue}>{issues.length} issues</Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'my-data':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Account Information</Text>
              <Text style={styles.cardDescription}>Basic account data stored in our system:</Text>
              
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>User ID</Text>
                <Text style={styles.dataValue}>{userData.id}</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Username</Text>
                <Text style={styles.dataValue}>{userData.username}</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Role</Text>
                <Text style={styles.dataValue}>{userData.role}</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Created At</Text>
                <Text style={styles.dataValue}>{userData.createdAt}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>OAuth Provider Links</Text>
              <Text style={styles.cardDescription}>External authentication providers linked to your account:</Text>
              
              {externalLogins.map((login, index) => (
                <View key={index}>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Provider</Text>
                    <Text style={styles.dataValue}>{login.provider}</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>External ID</Text>
                    <Text style={styles.dataValue}>{login.externalId}</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Linked On</Text>
                    <Text style={styles.dataValue}>{login.createdAt}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        );

      case 'my-issues':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Issues You've Reported</Text>
              <Text style={styles.cardDescription}>All urban issues you've reported through UrbanAI:</Text>
              
              {issues.map(issue => (
                <View key={issue.id} style={styles.issueItem}>
                  <View style={styles.issueHeader}>
                    <Text style={styles.issueId}>{issue.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(issue.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(issue.status) }]}>
                        {issue.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.issueTitle}>{issue.title}</Text>
                  <Text style={styles.issueDate}>
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </Text>
                  <TouchableOpacity 
                    style={[styles.actionButton, !issue.canEdit && styles.disabledButton]}
                    disabled={!issue.canEdit}
                  >
                    <Text style={[styles.actionButtonText, !issue.canEdit && styles.disabledButtonText]}>
                      {issue.canEdit ? 'Edit' : 'View Only'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>Data Deletion Policy</Text>
                <Text style={styles.warningText}>
                  Issues that have entered the municipal review process cannot be fully deleted due to public interest requirements.
                  However, your personal connection to these issues can be anonymized while preserving the municipal data.
                </Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'export':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Export Your Data</Text>
              <Text style={styles.cardDescription}>
                Download a complete copy of your personal data in machine-readable format (JSON).
              </Text>
              
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>What's Included</Text>
                <Text style={styles.infoText}>
                  Your export will include: account information, OAuth provider links, all issues you've reported,
                  and associated metadata.
                </Text>
              </View>

              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Export Format</Text>
                <Text style={styles.dataValue}>JSON (machine-readable)</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Data Scope</Text>
                <Text style={styles.dataValue}>All personal data we store</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Processing Time</Text>
                <Text style={styles.dataValue}>Immediate download</Text>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, isExporting && styles.disabledButton]}
                onPress={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.buttonText}>Preparing...</Text>
                  </>
                ) : (
                  <>
                    <Icon name="download" size={20} color="#ffffff" />
                    <Text style={styles.buttonText}>Download My Data</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 'delete':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Delete My Account</Text>
              <Text style={styles.cardDescription}>
                Permanently remove your account and personal data from UrbanAI.
              </Text>
              
              <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>Important: This Action Cannot Be Undone</Text>
                <Text style={styles.warningText}>
                  Account deletion will permanently remove your access to UrbanAI and delete your personal data.
                  This process typically completes within 30 days.
                </Text>
              </View>

              <Text style={styles.sectionTitle}>What happens when you delete your account:</Text>
              
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>✅ Immediately Deleted</Text>
                <Text style={styles.dataValue}>Account access, OAuth links, personal identifiers</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>🔒 Anonymized (30 days)</Text>
                <Text style={styles.dataValue}>Issues in municipal pipeline (public interest exception)</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>🗑️ Fully Deleted (30 days)</Text>
                <Text style={styles.dataValue}>Issues not yet in municipal review</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Legal Exceptions</Text>
                <Text style={styles.infoText}>
                  Some data may be retained longer if required by law or for legitimate public interests.
                </Text>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.dangerButton}
                  onPress={() => setShowDeleteModal(true)}
                >
                  <Icon name="delete" size={20} color="#ffffff" />
                  <Text style={styles.buttonText}>Delete My Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.warningButton}
                  onPress={() => setShowAnonymizeModal(true)}
                >
                  <Icon name="shield" size={20} color="#ffffff" />
                  <Text style={styles.buttonText}>Anonymize My Data Only</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Data & Privacy</Text>
        <Text style={styles.headerSubtitle}>Manage your personal data and privacy settings</Text>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.id ? '#2563EB' : '#6B7280'} 
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {renderTabContent()}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Account Deletion</Text>
            <Text style={styles.modalText}>
              Are you absolutely sure you want to delete your UrbanAI account?
            </Text>
            
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>This action cannot be undone</Text>
              <Text style={styles.warningText}>
                All your personal data will be permanently deleted. Issues in municipal review will be anonymized.
              </Text>
            </View>

            <Text style={styles.confirmationLabel}>Type DELETE to confirm:</Text>
            <TextInput
              style={styles.confirmationInput}
              value={deleteConfirmation}
              onChangeText={setDeleteConfirmation}
              placeholder="Type DELETE here"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dangerButton, 
                  deleteConfirmation !== 'DELETE' && styles.disabledButton
                ]}
                onPress={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
              >
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Anonymize Confirmation Modal */}
      <Modal
        visible={showAnonymizeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAnonymizeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Anonymize My Data</Text>
            <Text style={styles.modalText}>
              This will remove your personal connection to all issues while keeping the issue data for municipal purposes.
            </Text>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>What happens:</Text>
              <Text style={styles.infoText}>
                Your account will be deleted, but issues you reported will remain in the system without any personal identifiers linking them to you.
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAnonymizeModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.warningButton}
                onPress={handleAnonymizeData}
              >
                <Text style={styles.buttonText}>Anonymize Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabsContent: {
    paddingHorizontal: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2563EB',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 24,
  },
  rightsList: {
    marginTop: 8,
  },
  rightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rightLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  rightValue: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginVertical: 16,
  },
  issueItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueId: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  issueDate: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  disabledButtonText: {
    color: '#ffffff',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  dangerButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  warningButton: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 16,
  },
  confirmationLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  confirmationInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default GDPRDataManagementScreen;