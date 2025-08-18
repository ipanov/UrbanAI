import React from 'react';
import { Home, FileText, Settings, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('urbanai_token');
    window.location.href = '/';
  };

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