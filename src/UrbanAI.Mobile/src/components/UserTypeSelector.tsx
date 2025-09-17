import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';
import { USER_TYPES } from '../../../UrbanAI.Shared/constants';

const { width } = Dimensions.get('window');

interface UserType {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  iconName: string;
  color: string;
  features: string[];
  permissions: string[];
}

interface UserTypeSelectorProps {
  selectedUserType: string | null;
  onUserTypeSelect: (userType: string) => void;
  variant?: 'registration' | 'compact';
  loading?: boolean;
  error?: string | null;
}

const userTypes: UserType[] = [
  {
    id: USER_TYPES.CITIZEN,
    title: 'Citizen',
    description: 'Report and track community issues',
    detailedDescription: 'Citizens can report issues in their community, track progress, and receive updates on resolution status.',
    iconName: 'people',
    color: '#2563EB',
    features: [
      'Report community issues',
      'Track issue status',
      'Receive notifications',
      'Access public data'
    ],
    permissions: [
      'Create issue reports',
      'View own submissions',
      'Receive status updates',
      'Access community statistics'
    ]
  },
  {
    id: USER_TYPES.INVESTOR,
    title: 'Investor',
    description: 'Monitor project compliance and ROI',
    detailedDescription: 'Investors can monitor project compliance, access detailed analytics, and track return on investment.',
    iconName: 'trending-up',
    color: '#059669',
    features: [
      'Monitor compliance metrics',
      'Access analytics dashboard',
      'Track project ROI',
      'Generate compliance reports'
    ],
    permissions: [
      'View project analytics',
      'Access compliance data',
      'Generate reports',
      'Monitor financial metrics'
    ]
  },
  {
    id: USER_TYPES.AUTHORITY,
    title: 'Municipal Authority',
    description: 'Manage and resolve urban issues',
    detailedDescription: 'Municipal authorities can review, assign, and resolve issues while managing compliance and generating reports.',
    iconName: 'account-balance',
    color: '#F59E0B',
    features: [
      'Review and assign issues',
      'Manage resolution workflows',
      'Access administrative tools',
      'Generate compliance reports'
    ],
    permissions: [
      'View all issues',
      'Assign and manage cases',
      'Access admin dashboard',
      'Generate official reports'
    ]
  }
];

/**
 * Mobile-optimized UserTypeSelector Component
 *
 * Professional user type selection interface for UrbanAI mobile registration flow.
 * Adapted from web component for React Native with mobile-first design patterns.
 *
 * Features:
 * - Glass morphism design matching UrbanAI aesthetic
 * - Detailed user type descriptions with features and permissions
 * - Responsive design for mobile devices
 * - Touch-optimized interactions
 * - Error handling and loading states
 * - Municipal software professional standards
 */
const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  selectedUserType,
  onUserTypeSelect,
  variant = 'registration',
  loading = false,
  error = null
}) => {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const handleCardPress = (userTypeId: string) => {
    if (variant === 'registration' && !loading) {
      setExpandedType(expandedType === userTypeId ? null : userTypeId);
    }
  };

  const handleSelectPress = (userTypeId: string) => {
    if (!loading) {
      onUserTypeSelect(userTypeId);
    }
  };

  if (variant === 'compact') {
    const currentUserType = userTypes.find(type => type.id === selectedUserType);
    if (!currentUserType) return null;

    return (
      <View style={styles.compactContainer}>
        <View style={[styles.compactBadge, { backgroundColor: `${currentUserType.color}20` }]}>
          <Icon
            name={currentUserType.iconName}
            size={16}
            color={currentUserType.color}
          />
          <Text style={[styles.compactText, { color: currentUserType.color }]}>
            {currentUserType.title}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Account Type</Text>
          <Text style={styles.description}>
            Select the account type that best describes your role in the community.
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={20} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Processing your selection...</Text>
          </View>
        )}

        {/* User Type Cards */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {userTypes.map((userType) => {
            const isSelected = selectedUserType === userType.id;
            const isExpanded = expandedType === userType.id;

            return (
              <TouchableOpacity
                key={userType.id}
                style={[
                  styles.card,
                  isSelected && styles.selectedCard,
                  isExpanded && styles.expandedCard,
                  { borderColor: userType.color }
                ]}
                onPress={() => handleCardPress(userType.id)}
                disabled={loading}
                activeOpacity={0.7}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${userType.color}20` }]}>
                    <Icon
                      name={userType.iconName}
                      size={32}
                      color={userType.color}
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: userType.color }]}>
                      {userType.title}
                    </Text>
                    <Text style={styles.cardDescription}>
                      {userType.description}
                    </Text>
                  </View>

                  <View style={styles.selectionIndicator}>
                    {isSelected && (
                      <Icon name="check-circle" size={24} color="#059669" />
                    )}
                  </View>
                </View>

                {/* Expanded Content */}
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.detailedDescription}>
                      {userType.detailedDescription}
                    </Text>

                    {/* Features Section */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Key Features</Text>
                      <View style={styles.listContainer}>
                        {userType.features.map((feature, index) => (
                          <View key={index} style={styles.listItem}>
                            <Icon name="check" size={16} color="#059669" />
                            <Text style={styles.listItemText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Permissions Section */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Permissions</Text>
                      <View style={styles.listContainer}>
                        {userType.permissions.map((permission, index) => (
                          <View key={index} style={styles.listItem}>
                            <Icon name="info" size={16} color={userType.color} />
                            <Text style={styles.listItemText}>{permission}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Select Button */}
                    <TouchableOpacity
                      style={[styles.selectButton, { backgroundColor: userType.color }]}
                      onPress={() => handleSelectPress(userType.id)}
                      disabled={loading}
                    >
                      <Text style={styles.selectButtonText}>
                        Select {userType.title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: 'rgba(37, 99, 235, 0.02)',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  expandedCard: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  selectionIndicator: {
    marginLeft: 12,
  },
  expandedContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  detailedDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  listItemText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
    flex: 1,
  },
  selectButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  compactText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },

  // Responsive adjustments
  ...(width < 768 && {
    title: {
      fontSize: 24,
    },
    description: {
      fontSize: 14,
    },
    card: {
      padding: 16,
    },
    iconContainer: {
      width: 48,
      height: 48,
    },
    cardTitle: {
      fontSize: 18,
    },
    cardDescription: {
      fontSize: 13,
    },
  }),
});

export default UserTypeSelector;