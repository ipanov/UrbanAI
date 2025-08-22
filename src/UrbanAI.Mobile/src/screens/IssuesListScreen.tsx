import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Issue } from '../../../UrbanAI.Shared/types';

const IssuesListScreen: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for now - in real app this would come from API
  const mockIssues: Issue[] = [
    {
      id: '1',
      title: 'Broken Streetlight on Main St',
      description: 'Streetlight is flickering and needs repair',
      status: 'open',
      priority: 'medium',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      userId: 'user1',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'Main St, NYC'
      }
    },
    {
      id: '2',
      title: 'Pothole on Oak Avenue',
      description: 'Large pothole causing traffic issues',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T09:15:00Z',
      userId: 'user1',
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        address: 'Oak Ave, NYC'
      }
    },
    {
      id: '3',
      title: 'Graffiti in Central Park',
      description: 'Vandalism on park benches',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-14T11:30:00Z',
      userId: 'user1',
      location: {
        latitude: 40.7812,
        longitude: -73.9665,
        address: 'Central Park, NYC'
      }
    }
  ];

  useEffect(() => {
    setIssues(mockIssues);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIssues(mockIssues);
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#EF4444';
      case 'in-progress':
        return '#F59E0B';
      case 'resolved':
        return '#10B981';
      case 'closed':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'low-priority';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Issues</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-list" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {issues.map((issue) => (
          <TouchableOpacity key={issue.id} style={styles.issueCard}>
            <View style={styles.issueHeader}>
              <View style={styles.titleRow}>
                <Icon
                  name={getPriorityIcon(issue.priority)}
                  size={20}
                  color={getStatusColor(issue.status)}
                />
                <Text style={styles.issueTitle} numberOfLines={2}>
                  {issue.title}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(issue.status) }]}>
                <Text style={styles.statusText}>{issue.status}</Text>
              </View>
            </View>
            
            <Text style={styles.issueDescription} numberOfLines={2}>
              {issue.description}
            </Text>
            
            {issue.location?.address && (
              <View style={styles.locationRow}>
                <Icon name="location-on" size={16} color="#6B7280" />
                <Text style={styles.locationText}>{issue.location.address}</Text>
              </View>
            )}
            
            <View style={styles.issueFooter}>
              <Text style={styles.dateText}>{formatDate(issue.createdAt)}</Text>
              <Text style={styles.priorityText}>Priority: {issue.priority}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  filterButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  issueDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priorityText: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
});

export default IssuesListScreen;