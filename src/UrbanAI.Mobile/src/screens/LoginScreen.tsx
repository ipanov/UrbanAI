import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, AUTH_PROVIDERS, USER_TYPES } from '../../../UrbanAI.Shared/constants';
import { UserProfile } from '../../../UrbanAI.Shared/types';
import UserTypeSelector from '../components/UserTypeSelector';

const LoginScreen: React.FC = () => {
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOAuthLogin = async (provider: string) => {
    try {
      // First step: show user type selection
      setSelectedProvider(provider);
      setShowUserTypeSelector(true);
    } catch (error) {
      console.error('OAuth login error:', error);
      Alert.alert('Login Error', 'Failed to authenticate. Please try again.');
    }
  };

  const handleUserTypeSelect = async (userType: string) => {
    try {
      setLoading(true);

      // Simulate OAuth flow with user type
      Alert.alert(
        'OAuth Login',
        `Redirecting to ${selectedProvider} for authentication as ${userType}...`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              setShowUserTypeSelector(false);
              setSelectedUserType(null);
              setSelectedProvider(null);
              setLoading(false);
            },
          },
          {
            text: 'Continue',
            onPress: async () => {
              // Simulate successful login with user type
              const mockToken = `mock_token_${selectedProvider}_${Date.now()}`;
              const userProfile: UserProfile = {
                firstName: 'Mock',
                lastName: 'User',
                displayName: 'Mock User',
                email: 'user@example.com',
                provider: selectedProvider as any,
                initials: 'MU',
                userType: userType as any,
              };

              await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
              await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));

              setShowUserTypeSelector(false);
              setSelectedUserType(null);
              setSelectedProvider(null);
              setLoading(false);

              // The app will automatically navigate to main tabs due to auth state change
            },
          },
        ]
      );
    } catch (error) {
      console.error('User type selection error:', error);
      Alert.alert('Selection Error', 'Failed to complete user type selection. Please try again.');
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    Alert.alert(
      'Guest Access',
      'Guest access is not available in the mobile app. Please login with an OAuth provider to continue.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/urbanai-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Municipal Issue Reporting with AI-Powered Analysis</Text>
        </View>

        {/* Authentication Options */}
        <View style={styles.authContainer}>
          <Text style={styles.authTitle}>Welcome Back</Text>
          <Text style={styles.authSubtitle}>
            Choose your preferred authentication method to continue
          </Text>

          {/* OAuth Buttons */}
          <TouchableOpacity
            style={[styles.oauthButton, styles.googleButton]}
            onPress={() => handleOAuthLogin(AUTH_PROVIDERS.GOOGLE)}
            disabled={loading}
          >
            <Icon name="account-circle" size={24} color="#4285F4" />
            <Text style={[styles.buttonText, styles.googleText]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.oauthButton, styles.microsoftButton]}
            onPress={() => handleOAuthLogin(AUTH_PROVIDERS.MICROSOFT)}
            disabled={loading}
          >
            <Icon name="business" size={24} color="#00A4EF" />
            <Text style={[styles.buttonText, styles.microsoftText]}>
              Continue with Microsoft
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.oauthButton, styles.facebookButton]}
            onPress={() => handleOAuthLogin(AUTH_PROVIDERS.FACEBOOK)}
            disabled={loading}
          >
            <Icon name="group" size={24} color="#1877F2" />
            <Text style={[styles.buttonText, styles.facebookText]}>
              Continue with Facebook
            </Text>
          </TouchableOpacity>

          {/* Guest Access */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestAccess}
            disabled={loading}
          >
            <Text style={styles.guestButtonText}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Icon name="shield" size={16} color="#667eea" />
          <Text style={styles.privacyText}>
            We protect your privacy with OAuth-only authentication. Your personal data stays with your chosen provider.
          </Text>
        </View>
      </View>

      {/* User Type Selection Modal */}
      <Modal
        visible={showUserTypeSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <UserTypeSelector
          selectedUserType={selectedUserType}
          onUserTypeSelect={handleUserTypeSelect}
          loading={loading}
        />
      </Modal>
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
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoImage: {
    width: 240,
    height: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  authContainer: {
    marginBottom: 32,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    borderColor: '#4285F4',
  },
  microsoftButton: {
    borderColor: '#00A4EF',
  },
  facebookButton: {
    borderColor: '#1877F2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  googleText: {
    color: '#4285F4',
  },
  microsoftText: {
    color: '#00A4EF',
  },
  facebookText: {
    color: '#1877F2',
  },
  guestButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  privacyText: {
    fontSize: 14,
    color: '#1E40AF',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default LoginScreen;