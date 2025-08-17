import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OAuthLoginPage from './components/OAuthLoginPage';
import Dashboard from './components/Dashboard';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
