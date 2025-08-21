import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OAuthLoginPage from './components/OAuthLoginPage';
import Dashboard from './components/Dashboard';
import Issues from './components/Issues';
import OAuthCallback from './components/OAuthCallback';
import GDPRDataManagement from './components/GDPRDataManagement';
import { UserProvider } from './contexts/UserContext';
import './App.css';

function App() {
  const handleOAuthLogin = (provider: 'microsoft' | 'google' | 'facebook') => {
    console.log('OAuth login with:', provider);
    // Implement OAuth login logic here
  };

  const handleGuestAccess = () => {
    console.log('Guest access requested');
    // Implement guest access logic here
  };

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={
              <OAuthLoginPage
                onOAuthLogin={handleOAuthLogin}
                onGuestAccess={handleGuestAccess}
              />
            } />
            <Route path="/login" element={
              <OAuthLoginPage
                onOAuthLogin={handleOAuthLogin}
                onGuestAccess={handleGuestAccess}
              />
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/gdpr-data-management" element={<GDPRDataManagement />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
