import React, { useState, useEffect } from 'react';
import { Home, FileText, Settings, LogOut, MapPin, Clock, CheckCircle, AlertTriangle, Plus, TrendingUp, Sparkles } from 'lucide-react';
import { buildApiUrl } from '../config/api';
import WelcomeTutorial from './WelcomeTutorial';
import Layout from './Layout';
import { useUser } from '../contexts/UserContext';

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

interface DashboardStats {
  totalReports: number;
  inProgress: number;
  resolved: number;
  recentIssues: Issue[];
}

const Dashboard: React.FC = () => {
  const { userProfile } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    inProgress: 0,
    resolved: 0,
    recentIssues: []
  });
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    checkIfNewUser();
    fetchDashboardData();
  }, []);

  const checkIfNewUser = () => {
    const hasSeenTutorial = localStorage.getItem('urbanai_tutorial_completed');
    const hasSeenWelcomeIssue = localStorage.getItem('urbanai_welcome_issue_seen');
    
    if (!hasSeenTutorial) {
      setIsNewUser(true);
      setShowTutorial(true);
    }
    
    if (!hasSeenWelcomeIssue) {
      setIsNewUser(true);
    }
  };

  const createWelcomeIssue = (): Issue => {
    return {
      id: 'welcome-template-issue',
      title: 'Welcome to UrbanAI! 🎉 (Template Issue)',
      description: 'This is a sample issue to help you get familiar with the interface. You can see how issues are displayed, their status, location, and date. Feel free to explore the dashboard and delete this template when you\'re ready to report real municipal issues!',
      status: 'In Progress',
      latitude: 40.7589, // NYC coordinates as example
      longitude: -73.9851,
      createdAt: new Date().toISOString(),
    };
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('urbanai_token');
      let issues: Issue[] = [];

      if (token) {
        try {
          const response = await fetch(buildApiUrl('issues'), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            issues = await response.json();
          } else {
            console.log('Issues API call failed:', response.status, response.statusText);
          }
        } catch (apiError) {
          console.log('Issues API call error:', apiError);
          // Continue with empty issues array
        }
      }

      // Add welcome issue for new users (whether API call succeeded or failed)
      const hasSeenWelcomeIssue = localStorage.getItem('urbanai_welcome_issue_seen');
      const welcomeIssueDismissed = localStorage.getItem('urbanai_welcome_issue_dismissed');
      
      if (!hasSeenWelcomeIssue && !welcomeIssueDismissed) {
        const welcomeIssue = createWelcomeIssue();
        issues = [welcomeIssue, ...issues];
        localStorage.setItem('urbanai_welcome_issue_seen', 'true');
      }
      
      const totalReports = issues.length;
      const inProgress = issues.filter(issue => issue.status === 'In Progress').length;
      const resolved = issues.filter(issue => issue.status === 'Resolved').length;
      const recentIssues = issues
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalReports,
        inProgress,
        resolved,
        recentIssues
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      
      // Fallback: still show welcome issue even if everything fails
      const hasSeenWelcomeIssue = localStorage.getItem('urbanai_welcome_issue_seen');
      const welcomeIssueDismissed = localStorage.getItem('urbanai_welcome_issue_dismissed');
      
      if (!hasSeenWelcomeIssue && !welcomeIssueDismissed) {
        const welcomeIssue = createWelcomeIssue();
        setStats({
          totalReports: 1,
          inProgress: 1,
          resolved: 0,
          recentIssues: [welcomeIssue]
        });
        localStorage.setItem('urbanai_welcome_issue_seen', 'true');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTutorialComplete = () => {
    localStorage.setItem('urbanai_tutorial_completed', 'true');
    setIsNewUser(false);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  const isWelcomeIssue = (issueId: string) => {
    return issueId === 'welcome-template-issue';
  };

  const dismissWelcomeIssue = () => {
    localStorage.setItem('urbanai_welcome_issue_dismissed', 'true');
    // Re-fetch dashboard data to update the display
    fetchDashboardData();
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
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="dashboard">
        <main className="dashboard-content">
        <div className="welcome-section">
          <h2>
            {userProfile ? 
              `Welcome back, ${userProfile.displayName.split(' ')[0]}! 👋` : 
              'Welcome to UrbanAI'
            }
          </h2>
          <p>
            {userProfile ? 
              `Ready to report municipal issues? Let's make your community better together.` :
              'Report municipal issues and track their resolution with AI-powered analysis.'
            }
          </p>
          
          <div className="quick-actions">
            <button className="action-btn primary" data-testid="get-started-btn">
              <Plus size={20} />
              Report New Issue
            </button>
            <button className="action-btn secondary">
              <FileText size={20} />
              View My Reports
            </button>
            <button className="action-btn secondary">
              <MapPin size={20} />
              Browse Map
            </button>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : stats.totalReports}</h3>
              <p>Total Reports</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : stats.resolved}</h3>
              <p>Resolved</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : Math.round((stats.resolved / (stats.totalReports || 1)) * 100)}%</h3>
              <p>Resolution Rate</p>
            </div>
          </div>
        </div>

        <div className="recent-issues-section">
          <h3>Recent Issues</h3>
          {loading ? (
            <div className="loading-state">Loading recent issues...</div>
          ) : stats.recentIssues.length > 0 ? (
            <div className="issues-list">
              {stats.recentIssues.map((issue) => (
                <div 
                  key={issue.id} 
                  className={`issue-card ${isWelcomeIssue(issue.id) ? 'welcome-issue' : ''}`}
                >
                  <div className="issue-header">
                    <h4>
                      {issue.title || 'Untitled Issue'}
                      {isWelcomeIssue(issue.id) && (
                        <span className="template-issue-badge">
                          <Sparkles size={12} />
                          Template
                        </span>
                      )}
                    </h4>
                    <div className="issue-status">
                      {getStatusIcon(issue.status)}
                      <span>{issue.status}</span>
                    </div>
                  </div>
                  <p className="issue-description">{issue.description}</p>
                  <div className="issue-footer">
                    <div className="issue-location">
                      <MapPin size={14} />
                      <span>{issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}</span>
                    </div>
                    <span className="issue-date">{formatDate(issue.createdAt)}</span>
                  </div>
                  {isWelcomeIssue(issue.id) && (
                    <div className="issue-actions">
                      <button 
                        className="btn-secondary"
                        onClick={dismissWelcomeIssue}
                      >
                        Dismiss Template
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={48} />
              <h4>No issues reported yet</h4>
              <p>Get started by reporting your first municipal issue.</p>
              <button className="action-btn primary" data-testid="first-report-btn">
                <Plus size={20} />
                Report Your First Issue
              </button>
            </div>
          )}
        </div>
        </main>

        <WelcomeTutorial 
          isOpen={showTutorial}
          onClose={handleCloseTutorial}
          onComplete={handleTutorialComplete}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
