import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, USER_TYPES } from '../../../UrbanAI.Shared/constants';
import { UserProfile, UserTypeSelectionParams, MobileNavigationProps } from '../../../UrbanAI.Shared/types';
import UserTypeSelector from '../components/UserTypeSelector';

interface UserTypeSelectionScreenProps extends MobileNavigationProps {
  route: {
    params?: UserTypeSelectionParams;
  };
}

/**
 * UserTypeSelectionScreen Component
 *
 * Dedicated screen for user type selection when needed outside of login flow.
 * Handles standalone user type selection with proper navigation and state management.
 *
 * Features:
 * - Standalone user type selection
 * - Navigation handling with back button support
 * - Proper state persistence
 * - Error handling and loading states
 * - Integration with existing authentication flow
 */
const UserTypeSelectionScreen: React.FC<UserTypeSelectionScreenProps> = ({
  navigation,
  route
}) => {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    onComplete,
    currentUserType,
    showBackButton = true
  } = route.params || {};

  useLayoutEffect(() => {
    // Set up navigation header
    navigation.setOptions({
      title: 'Select Account Type',
      headerStyle: {
        backgroundColor: '#667eea',
      },
      headerTintColor: '#FFFFFF',
      headerBackTitleVisible: false,
      headerLeft: showBackButton ? () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ) : undefined,
    });

    // Handle back button press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove();
  }, [navigation, showBackButton]);

  const handleBackPress = () => {
    if (showBackButton) {
      navigation.goBack();
      return true;
    }
    return false;
  };

  const handleUserTypeSelect = async (userType: string) => {
    try {
      setLoading(true);
      setError(null);

      // Update the user's selected user type
      setSelectedUserType(userType);

      // Get existing user profile
      const userProfileJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      let userProfile: UserProfile = userProfileJson ? JSON.parse(userProfileJson) : {
        firstName: '',
        lastName: '',
        displayName: '',
        email: '',
        provider: null,
        initials: '',
      };

      // Update user type in profile
      userProfile.userType = userType as any;

      // Save updated profile
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));

      // Show success message
      Alert.alert(
        'Success',
        `Your account type has been set to ${userType}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Call completion callback if provided
              if (onComplete) {
                onComplete(userType);
              } else {
                // Navigate back or to dashboard
                navigation.goBack();
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('User type selection error:', error);
      setError('Failed to update account type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserTypeDisplay = () => {
    if (!currentUserType) return null;

    const userTypeConfig = {
      [USER_TYPES.CITIZEN]: { title: 'Citizen', icon: 'people', color: '#2563EB' },
      [USER_TYPES.INVESTOR]: { title: 'Investor', icon: 'trending-up', color: '#059669' },
      [USER_TYPES.AUTHORITY]: { title: 'Municipal Authority', icon: 'account-balance', color: '#F59E0B' },
    };

    const config = userTypeConfig[currentUserType as keyof typeof userTypeConfig];
    if (!config) return null;

    return (
      <View style={styles.currentUserTypeContainer}>
        <Icon name={config.icon} size={20} color={config.color} />
        <Text style={[styles.currentUserTypeText, { color: config.color }]}>
          Current: {config.title}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Current User Type Display */}
        {currentUserType && getCurrentUserTypeDisplay()}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Choose Your Account Type</Text>
          <Text style={styles.instructionsText}>
            Select the account type that best describes your role in the community.
            This will determine your access permissions and available features.
          </Text>
        </View>

        {/* User Type Selector */}
        <UserTypeSelector
          selectedUserType={selectedUserType}
          onUserTypeSelect={handleUserTypeSelect}
          loading={loading}
          error={error}
        />

        {/* Skip Option (if allowed) */}
        {showBackButton && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.skipButtonText}>
              Maybe Later
            </Text>
          </TouchableOpacity>
        )}
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
  },
  headerButton: {
    marginLeft: 16,
    padding: 8,
  },
  currentUserTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    margin: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  currentUserTypeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  instructionsText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 20,
    marginHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
});

export default UserTypeSelectionScreen;