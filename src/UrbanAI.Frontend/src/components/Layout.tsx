import React from 'react';
import { Home, FileText, Settings, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { userProfile, logout } = useUser();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>UrbanAI</h1>
          <p className="header-subtitle">Municipal issue management platform</p>
        </div>
        <div className="header-user-section">
          {userProfile && (
            <div className="user-info">
              <div className="user-avatar">
                {userProfile.initials}
              </div>
              <div className="user-details">
                <span className="user-name">{userProfile.displayName}</span>
                <span className="user-provider">{userProfile.provider}</span>
              </div>
            </div>
          )}
          <button 
            onClick={logout}
            className="logout-btn"
            aria-label="Logout"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>
      
      <nav className="dashboard-nav">
        <a 
          href="/dashboard" 
          className={`nav-item ${isActiveRoute('/dashboard') ? 'active' : ''}`}
        >
          <Home size={20} />
          Dashboard
        </a>
        <a 
          href="/issues" 
          className={`nav-item ${isActiveRoute('/issues') ? 'active' : ''}`}
        >
          <FileText size={20} />
          Issues
        </a>
        <a 
          href="/settings" 
          className={`nav-item ${isActiveRoute('/settings') ? 'active' : ''}`}
        >
          <Settings size={20} />
          Settings
        </a>
      </nav>

      <main className="page-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;