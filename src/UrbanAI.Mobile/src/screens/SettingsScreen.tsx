import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../UrbanAI.Shared/constants';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
              await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
              // Navigation will be handled by the auth state change
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const navigateToGDPR = () => {
    // @ts-ignore - Navigation typing can be improved later
    navigation.navigate('GDPRDataManagement');
  };

  const settingsOptions = [
    {
      id: 'privacy',
      title: 'Privacy & Data Management',
      subtitle: 'Manage your personal data and privacy settings',
      icon: 'shield',
      onPress: navigateToGDPR,
      showArrow: true,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Configure notification preferences',
      icon: 'notifications',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon.'),
      showArrow: true,
    },
    {
      id: 'about',
      title: 'About UrbanAI',
      subtitle: 'App version and information',
      icon: 'info',
      onPress: () => Alert.alert('UrbanAI Mobile', 'Version 1.0.0\n\nMunicipal Issue Reporting with AI-Powered Analysis'),
      showArrow: true,
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help',
      onPress: () => Alert.alert('Support', 'For support, please email: support@urbanai.app'),
      showArrow: true,
    },
    {
      id: 'logout',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      icon: 'logout',
      onPress: handleLogout,
      showArrow: false,
      isDanger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your account and app preferences</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Anonymous User</Text>
          <Text style={styles.userEmail}>Connected via OAuth</Text>
        </View>
      </View>

      {/* Settings Options */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsSection}>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.settingItem,
                option.isDanger && styles.dangerItem,
              ]}
              onPress={option.onPress}
            >
              <View style={styles.settingContent}>
                <View style={[
                  styles.iconContainer,
                  option.isDanger && styles.dangerIconContainer,
                ]}>
                  <Icon
                    name={option.icon}
                    size={24}
                    color={option.isDanger ? '#DC2626' : '#667eea'}
                  />
                </View>
                <View style={styles.settingText}>
                  <Text style={[
                    styles.settingTitle,
                    option.isDanger && styles.dangerText,
                  ]}>
                    {option.title}
                  </Text>
                  <Text style={styles.settingSubtitle}>
                    {option.subtitle}
                  </Text>
                </View>
              </View>
              {option.showArrow && (
                <Icon
                  name="chevron-right"
                  size={24}
                  color="#9CA3AF"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>UrbanAI Mobile v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 UrbanAI. All rights reserved.</Text>
        </View>
      </ScrollView>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  userCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#64748B',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  settingsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dangerItem: {
    borderBottomColor: '#FEE2E2',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dangerIconContainer: {
    backgroundColor: '#FEE2E2',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  dangerText: {
    color: '#DC2626',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});

export default SettingsScreen;