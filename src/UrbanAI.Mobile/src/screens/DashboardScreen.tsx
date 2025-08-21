import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardScreen: React.FC = () => {
  const stats = [
    {
      title: 'Issues Reported',
      value: '3',
      icon: 'report',
      color: '#3B82F6',
      backgroundColor: '#EFF6FF',
    },
    {
      title: 'In Progress',
      value: '1',
      icon: 'schedule',
      color: '#F59E0B',
      backgroundColor: '#FEF3C7',
    },
    {
      title: 'Resolved',
      value: '2',
      icon: 'check-circle',
      color: '#10B981',
      backgroundColor: '#D1FAE5',
    },
  ];

  const recentIssues = [
    {
      id: 'ISS-2024-003',
      title: 'Graffiti in park',
      status: 'Open',
      date: '2 days ago',
      priority: 'medium',
    },
    {
      id: 'ISS-2024-002',
      title: 'Broken streetlight',
      status: 'In Progress',
      date: '4 days ago',
      priority: 'high',
    },
    {
      id: 'ISS-2024-001',
      title: 'Pothole on Main Street',
      status: 'Municipal Review',
      date: '1 week ago',
      priority: 'high',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return '#F59E0B';
      case 'In Progress': return '#3B82F6';
      case 'Municipal Review': return '#8B5CF6';
      case 'Resolved': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#6B7280';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'critical': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.userName}>Anonymous User</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Icon name="add-a-photo" size={32} color="#3B82F6" />
              </View>
              <Text style={styles.actionTitle}>Report Issue</Text>
              <Text style={styles.actionSubtitle}>Take a photo and report a municipal issue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
                <Icon name="map" size={32} color="#10B981" />
              </View>
              <Text style={styles.actionTitle}>View Map</Text>
              <Text style={styles.actionSubtitle}>See issues in your area on the map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: stat.backgroundColor }]}>
                <Icon name={stat.icon} size={24} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Issues</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.issuesContainer}>
            {recentIssues.map((issue) => (
              <TouchableOpacity key={issue.id} style={styles.issueCard}>
                <View style={styles.issueHeader}>
                  <Text style={styles.issueId}>{issue.id}</Text>
                  <View style={styles.issueTags}>
                    <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(issue.priority) + '20' }]}>
                      <Text style={[styles.priorityText, { color: getPriorityColor(issue.priority) }]}>
                        {issue.priority}
                      </Text>
                    </View>
                    <View style={[styles.statusTag, { backgroundColor: getStatusColor(issue.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(issue.status) }]}>
                        {issue.status}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.issueTitle}>{issue.title}</Text>
                <Text style={styles.issueDate}>{issue.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips and Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips & Insights</Text>
          <View style={styles.tipCard}>
            <Icon name="lightbulb" size={24} color="#F59E0B" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Take clear photos</Text>
              <Text style={styles.tipText}>
                Clear, well-lit photos help municipal authorities understand and resolve issues faster.
              </Text>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
  issuesContainer: {
    gap: 12,
  },
  issueCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueId: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#64748B',
    fontWeight: '500',
  },
  issueTags: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statusTag: {
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
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  issueDate: {
    fontSize: 14,
    color: '#64748B',
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});

export default DashboardScreen;