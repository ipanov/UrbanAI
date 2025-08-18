import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Clock, CheckCircle, AlertTriangle, Plus, Filter, Search, Sparkles } from 'lucide-react';
import { buildApiUrl } from '../config/api';
import Layout from './Layout';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  photoUrl?: string;
}

const Issues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const createWelcomeIssue = (): Issue => {
    return {
      id: 'welcome-template-issue',
      title: 'Welcome to UrbanAI! 🎉 (Template Issue)',
      description: 'This is a sample issue to help you get familiar with the interface. You can see how issues are displayed, their status, location, and date. Feel free to explore the dashboard and delete this template when you\'re ready to report real municipal issues!',
      status: 'In Progress',
      latitude: 40.7589,
      longitude: -73.9851,
      createdAt: new Date().toISOString(),
    };
  };

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('urbanai_token');
      let fetchedIssues: Issue[] = [];

      if (token) {
        try {
          const response = await fetch(buildApiUrl('issues'), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            fetchedIssues = await response.json();
          } else {
            console.log('Issues API call failed:', response.status, response.statusText);
          }
        } catch (apiError) {
          console.log('Issues API call error:', apiError);
        }
      }

      // Add welcome issue for new users
      const hasSeenWelcomeIssue = localStorage.getItem('urbanai_welcome_issue_seen');
      const welcomeIssueDismissed = localStorage.getItem('urbanai_welcome_issue_dismissed');
      
      if (!hasSeenWelcomeIssue && !welcomeIssueDismissed) {
        const welcomeIssue = createWelcomeIssue();
        fetchedIssues = [welcomeIssue, ...fetchedIssues];
        localStorage.setItem('urbanai_welcome_issue_seen', 'true');
      }

      setIssues(fetchedIssues);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      
      // Fallback: still show welcome issue
      const hasSeenWelcomeIssue = localStorage.getItem('urbanai_welcome_issue_seen');
      const welcomeIssueDismissed = localStorage.getItem('urbanai_welcome_issue_dismissed');
      
      if (!hasSeenWelcomeIssue && !welcomeIssueDismissed) {
        const welcomeIssue = createWelcomeIssue();
        setIssues([welcomeIssue]);
        localStorage.setItem('urbanai_welcome_issue_seen', 'true');
      }
    } finally {
      setLoading(false);
    }
  };

  const isWelcomeIssue = (issueId: string) => {
    return issueId === 'welcome-template-issue';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'In Progress':
        return <Clock size={16} className="text-blue-500" />;
      case 'Resolved':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = filterStatus === 'all' || issue.status.toLowerCase().replace(' ', '-') === filterStatus;
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Layout>
      <div className="issues-page">
        <header className="page-header">
          <div className="header-content">
            <h1>Issues</h1>
            <p className="header-subtitle">View and manage all reported municipal issues</p>
          </div>
          <button className="action-btn primary">
            <Plus size={20} />
            Report New Issue
          </button>
        </header>

      <div className="issues-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <Filter size={16} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="issues-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading issues...</p>
          </div>
        ) : filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <div 
              key={issue.id} 
              className={`issue-card ${isWelcomeIssue(issue.id) ? 'welcome-issue' : ''}`}
            >
              <div className="issue-header">
                <h3>
                  {issue.title}
                  {isWelcomeIssue(issue.id) && (
                    <span className="template-issue-badge">
                      <Sparkles size={12} />
                      Template
                    </span>
                  )}
                </h3>
                <div className="issue-status">
                  {getStatusIcon(issue.status)}
                  <span>{issue.status}</span>
                </div>
              </div>
              
              <p className="issue-description">{issue.description}</p>
              
              <div className="issue-meta">
                <div className="issue-location">
                  <MapPin size={14} />
                  <span>{issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}</span>
                </div>
                <span className="issue-date">{formatDate(issue.createdAt)}</span>
              </div>
              
              <div className="issue-actions">
                <button className="btn-secondary">View Details</button>
                {isWelcomeIssue(issue.id) && (
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      // Remove from local state immediately
                      setIssues(issues.filter(i => i.id !== issue.id));
                      // Mark as dismissed so it won't appear again
                      localStorage.setItem('urbanai_welcome_issue_dismissed', 'true');
                    }}
                  >
                    Dismiss Template
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <FileText size={64} />
            <h3>No issues found</h3>
            <p>
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by reporting your first municipal issue.'
              }
            </p>
            <button className="action-btn primary">
              <Plus size={20} />
              Report Your First Issue
            </button>
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default Issues;