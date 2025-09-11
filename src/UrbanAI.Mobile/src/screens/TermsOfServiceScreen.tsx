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

const TermsOfServiceScreen: React.FC = () => {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using UrbanAI, you accept and agree to be bound by 
          the terms and provision of this agreement. If you do not agree to 
          abide by these terms, please do not use this service.
        </Text>

        <Text style={styles.sectionTitle}>Service Description</Text>
        <Text style={styles.paragraph}>
          UrbanAI is a municipal issue reporting platform that connects citizens, 
          authorities, and investors to collaboratively address urban infrastructure 
          and service issues through AI-powered analysis and routing.
        </Text>

        <Text style={styles.sectionTitle}>User Responsibilities</Text>
        <Text style={styles.paragraph}>
          As a user of UrbanAI, you agree to:
        </Text>
        <Text style={styles.paragraph}>
          • Provide accurate and truthful information when reporting issues
        </Text>
        <Text style={styles.paragraph}>
          • Respect the privacy and rights of others
        </Text>
        <Text style={styles.paragraph}>
          • Use the service only for legitimate municipal issue reporting
        </Text>
        <Text style={styles.paragraph}>
          • Not submit false, misleading, or duplicate reports
        </Text>
        <Text style={styles.paragraph}>
          • Comply with all applicable local, state, and federal laws
        </Text>

        <Text style={styles.sectionTitle}>Prohibited Uses</Text>
        <Text style={styles.paragraph}>
          You may not use UrbanAI for:
        </Text>
        <Text style={styles.paragraph}>
          • Submitting false or fraudulent reports
        </Text>
        <Text style={styles.paragraph}>
          • Harassing, threatening, or defaming others
        </Text>
        <Text style={styles.paragraph}>
          • Uploading inappropriate, offensive, or copyrighted content
        </Text>
        <Text style={styles.paragraph}>
          • Attempting to access unauthorized areas of the service
        </Text>
        <Text style={styles.paragraph}>
          • Commercial activities not related to issue reporting
        </Text>

        <Text style={styles.sectionTitle}>Content and Intellectual Property</Text>
        <Text style={styles.paragraph}>
          You retain ownership of the content you submit but grant UrbanAI 
          a license to use, modify, and share your reports with relevant 
          authorities for issue resolution purposes.
        </Text>
        <Text style={styles.paragraph}>
          UrbanAI and its original content, features, and functionality are 
          owned by UrbanAI and are protected by international copyright, 
          trademark, and other intellectual property laws.
        </Text>

        <Text style={styles.sectionTitle}>Privacy and Data Protection</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. Please review our Privacy Policy, 
          which also governs your use of the service, to understand our 
          practices regarding the collection and use of your information.
        </Text>

        <Text style={styles.sectionTitle}>Service Availability</Text>
        <Text style={styles.paragraph}>
          We strive to maintain service availability but cannot guarantee 
          uninterrupted access. We reserve the right to modify, suspend, 
          or discontinue the service with or without notice.
        </Text>

        <Text style={styles.sectionTitle}>Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          UrbanAI is provided "as is" without warranties of any kind, either 
          express or implied. We do not guarantee that the service will be 
          error-free, secure, or available at all times.
        </Text>

        <Text style={styles.sectionTitle}>Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          UrbanAI shall not be liable for any direct, indirect, incidental, 
          special, consequential, or exemplary damages resulting from your 
          use or inability to use the service.
        </Text>

        <Text style={styles.sectionTitle}>Indemnification</Text>
        <Text style={styles.paragraph}>
          You agree to indemnify and hold harmless UrbanAI from any claims, 
          damages, or expenses arising from your use of the service or 
          violation of these terms.
        </Text>

        <Text style={styles.sectionTitle}>Termination</Text>
        <Text style={styles.paragraph}>
          We may terminate or suspend your access to the service immediately, 
          without prior notice, for conduct that we believe violates these 
          Terms of Service or is harmful to other users or UrbanAI.
        </Text>

        <Text style={styles.sectionTitle}>Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. We will 
          notify users of significant changes via email or app notification. 
          Your continued use of the service constitutes acceptance of the 
          updated terms.
        </Text>

        <Text style={styles.sectionTitle}>Governing Law</Text>
        <Text style={styles.paragraph}>
          These terms shall be interpreted and governed in accordance with 
          the laws of the jurisdiction where UrbanAI operates, without 
          regard to conflict of law provisions.
        </Text>

        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.paragraph}>
          For questions about these Terms of Service, please contact us at:
        </Text>
        <Text style={styles.paragraph}>
          Email: legal@urbanai.site
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
  lastUpdated: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
});

export default TermsOfServiceScreen;