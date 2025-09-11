import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Data Protection & Privacy</Text>
        <Text style={styles.paragraph}>
          Your privacy is our priority. UrbanAI follows a privacy-first approach 
          to protect your personal information while enabling effective municipal 
          issue reporting and resolution.
        </Text>

        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          • <Text style={styles.bold}>OAuth Authentication Data:</Text> We receive 
          only your basic profile information (name, email) from trusted OAuth 
          providers (Microsoft, Google).
        </Text>
        <Text style={styles.paragraph}>
          • <Text style={styles.bold}>Issue Reports:</Text> Location data, photos, 
          descriptions, and category information you provide when reporting issues.
        </Text>
        <Text style={styles.paragraph}>
          • <Text style={styles.bold}>Usage Analytics:</Text> Anonymous usage 
          patterns to improve our service quality.
        </Text>

        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          • Process and route your issue reports to appropriate authorities
        </Text>
        <Text style={styles.paragraph}>
          • Provide status updates on your reported issues
        </Text>
        <Text style={styles.paragraph}>
          • Improve our AI categorization and routing systems
        </Text>
        <Text style={styles.paragraph}>
          • Send service notifications and important updates
        </Text>

        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard security measures including:
        </Text>
        <Text style={styles.paragraph}>
          • Encrypted data transmission (HTTPS/TLS)
        </Text>
        <Text style={styles.paragraph}>
          • Secure cloud storage with access controls
        </Text>
        <Text style={styles.paragraph}>
          • Regular security audits and monitoring
        </Text>
        <Text style={styles.paragraph}>
          • Minimal data retention policies
        </Text>

        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.paragraph}>
          Under GDPR and applicable privacy laws, you have the right to:
        </Text>
        <Text style={styles.paragraph}>
          • Access your personal data
        </Text>
        <Text style={styles.paragraph}>
          • Correct inaccurate information
        </Text>
        <Text style={styles.paragraph}>
          • Request data deletion
        </Text>
        <Text style={styles.paragraph}>
          • Data portability
        </Text>
        <Text style={styles.paragraph}>
          • Withdraw consent at any time
        </Text>

        <Text style={styles.sectionTitle}>Data Sharing</Text>
        <Text style={styles.paragraph}>
          We only share your information with:
        </Text>
        <Text style={styles.paragraph}>
          • Relevant municipal authorities for issue resolution
        </Text>
        <Text style={styles.paragraph}>
          • Service providers under strict data processing agreements
        </Text>
        <Text style={styles.paragraph}>
          • Law enforcement when legally required
        </Text>

        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.paragraph}>
          For privacy-related questions or to exercise your rights:
        </Text>
        <Text style={styles.paragraph}>
          Email: privacy@urbanai.site
        </Text>
        <Text style={styles.paragraph}>
          Data Protection Officer: dpo@urbanai.site
        </Text>

        <Text style={styles.sectionTitle}>Updates to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy to reflect changes in our practices 
          or legal requirements. We will notify you of significant changes via 
          email or app notification.
        </Text>

        <Text style={styles.lastUpdated}>
          Last updated: January 2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
});

export default PrivacyPolicyScreen;