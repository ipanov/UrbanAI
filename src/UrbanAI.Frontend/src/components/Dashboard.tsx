import React from 'react';
import { Home, FileText, Settings, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('urbanai_token');
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>UrbanAI Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="logout-btn"
          aria-label="Logout"
        >
          <LogOut size={20} />
          Logout
        </button>
      </header>
      
      <nav className="dashboard-nav">
        <a href="/dashboard" className="nav-item active">
          <Home size={20} />
          Dashboard
        </a>
        <a href="/issues" className="nav-item">
          <FileText size={20} />
          Issues
        </a>
        <a href="/settings" className="nav-item">
          <Settings size={20} />
          Settings
        </a>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to UrbanAI</h2>
          <p>Report municipal issues and track their resolution with AI-powered analysis.</p>
          
          <div className="quick-actions">
            <button className="action-btn primary" data-testid="get-started-btn">
              🚀 Get Started - Report an Issue
            </button>
            <button className="action-btn secondary">
              📊 View My Reports
            </button>
            <button className="action-btn secondary">
              🗺️ Browse Map
            </button>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <h3>0</h3>
            <p>Your Reports</p>
          </div>
          <div className="stat-card">
            <h3>0</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>0</h3>
            <p>Resolved</p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;
