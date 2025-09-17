import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import { useUser } from '../contexts/UserContext';
import { UrbanAILogoPlaceholder } from './UrbanAILogo';
import { Card, Typography, Button } from './atoms';
import { User, CheckCircle, Shield, ArrowRight } from 'lucide-react';
import './LegalPages.css';

interface RegistrationData {
  provider: string;
  externalId: string;
  displayName?: string;
  email?: string;
  picture?: string;
  userType: string;
  termsOfServiceVersion: string;
  termsOfServiceUrl: string;
}

const RegisterComplete: React.FC = () => {
  const navigate = useNavigate();
  const { setUserProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    // Retrieve registration data from sessionStorage
    const storedData = sessionStorage.getItem('oauth_registration_data');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setRegistrationData(data);
      } catch (err) {
        console.error('Failed to parse registration data:', err);
        navigate('/login');
      }
    } else {
      // No registration data found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleCompleteRegistration = async () => {
    if (!registrationData || !acceptedTerms) {
      setError('Please accept the Terms of Service to continue');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(buildApiUrl('auth/register-complete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: registrationData.provider,
          externalId: registrationData.externalId,
          userType: registrationData.userType,
          displayName: registrationData.displayName,
          email: registrationData.email,
          picture: registrationData.picture,
          termsOfServiceVersion: registrationData.termsOfServiceVersion,
          clientIpAddress: '', // Backend will fill this
          clientUserAgent: navigator.userAgent
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Registration failed (${response.status})`);
      }

      const json = await response.json();
      const token = json?.token ?? json?.Token;

      if (!token) {
        throw new Error('No authentication token returned from server');
      }

      // Store token locally
      localStorage.setItem('urbanai_token', token);

      // Set user profile for UI
      if (registrationData.displayName && registrationData.email) {
        const names = registrationData.displayName.split(' ');
        const userProfile = {
          firstName: names[0] || '',
          lastName: names[1] || '',
          displayName: registrationData.displayName,
          email: registrationData.email,
          provider: registrationData.provider as 'microsoft' | 'google' | 'facebook',
          userType: registrationData.userType as 'citizen' | 'investor' | 'authority',
          initials: `${names[0]?.charAt(0) || ''}${names[1]?.charAt(0) || ''}`.toUpperCase() || 'U'
        };
        setUserProfile(userProfile);
      }

      // Clean up sessionStorage
      sessionStorage.removeItem('oauth_registration_data');
      sessionStorage.removeItem('oauth_user_type');

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err: any) {
      console.error('Registration completion error:', err);
      setError(err?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Clean up sessionStorage
    sessionStorage.removeItem('oauth_registration_data');
    sessionStorage.removeItem('oauth_user_type');
    navigate('/login');
  };

  if (!registrationData) {
    return (
      <div className="legal-page">
        <div className="legal-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading registration...</p>
          </div>
        </div>
      </div>
    );
  }

  const getUserTypeDisplay = (userType: string) => {
    switch (userType) {
      case 'citizen': return 'Citizen';
      case 'investor': return 'Investor';
      case 'authority': return 'Municipal Authority';
      default: return 'User';
    }
  };

  const getUserTypeDescription = (userType: string) => {
    switch (userType) {
      case 'citizen':
        return 'Report urban issues and track their resolution in your community';
      case 'investor':
        return 'Monitor compliance and project progress for your investments';
      case 'authority':
        return 'Manage and resolve urban issues reported by citizens';
      default:
        return 'Use UrbanAI to participate in urban governance';
    }
  };

  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <header className="legal-header">
          <UrbanAILogoPlaceholder variant="primary" size={40} />
          <div className="header-content">
            <Typography variant="h1">Complete Your Registration</Typography>
            <Typography variant="body2" color="secondary">
              Almost there! Review your information and accept our terms
            </Typography>
          </div>
        </header>

        {/* User Type Summary */}
        <Card className="user-type-summary" variant="elevated" padding="lg">
          <div className="summary-header">
            <User size={24} className="summary-icon" />
            <Typography variant="h2">Your Account Type</Typography>
          </div>
          <div className="user-type-details">
            <div className="user-type-badge">
              <Typography variant="h3">{getUserTypeDisplay(registrationData.userType)}</Typography>
            </div>
            <Typography variant="body1">
              {getUserTypeDescription(registrationData.userType)}
            </Typography>
          </div>
        </Card>

        {/* Account Information */}
        <Card className="account-info" variant="bordered" padding="lg">
          <Typography variant="h2">Account Information</Typography>
          <div className="info-grid">
            <div className="info-item">
              <Typography variant="body2" color="secondary">Display Name</Typography>
              <Typography variant="body1">{registrationData.displayName || 'Not provided'}</Typography>
            </div>
            <div className="info-item">
              <Typography variant="body2" color="secondary">Email</Typography>
              <Typography variant="body1">{registrationData.email || 'Not provided'}</Typography>
            </div>
            <div className="info-item">
              <Typography variant="body2" color="secondary">Provider</Typography>
              <Typography variant="body1" className="capitalize">{registrationData.provider}</Typography>
            </div>
            <div className="info-item">
              <Typography variant="body2" color="secondary">User Type</Typography>
              <Typography variant="body1">{getUserTypeDisplay(registrationData.userType)}</Typography>
            </div>
          </div>
        </Card>

        {/* Terms of Service Acceptance */}
        <Card className="terms-acceptance" variant="elevated" padding="lg">
          <div className="summary-header">
            <Shield size={24} className="summary-icon" />
            <Typography variant="h2">Terms of Service</Typography>
          </div>

          <div className="terms-summary">
            <Typography variant="body1">
              To complete your registration, you must accept our Terms of Service. This includes:
            </Typography>
            <ul className="terms-list">
              <li>Using UrbanAI responsibly and reporting genuine urban issues</li>
              <li>Respecting other users and following community guidelines</li>
              <li>Understanding that UrbanAI facilitates reporting but doesn't guarantee resolution</li>
              <li>Maintaining the security of your OAuth provider account</li>
            </ul>
          </div>

          <div className="terms-preview">
            <Typography variant="body2" color="secondary">
              By creating an account, you agree to our{' '}
              <a
                href={registrationData.termsOfServiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="legal-link"
              >
                Terms of Service
              </a>
              .
            </Typography>
          </div>

          <div className="privacy-notice">
            <Card className="privacy-card" variant="bordered" padding="md">
              <CheckCircle size={16} className="privacy-icon" />
              <div>
                <Typography variant="body2">
                  <strong>Privacy Protected:</strong> We store only an anonymous identifier linked to your OAuth provider.
                  Your personal information remains with your OAuth provider and is never stored on our servers.
                </Typography>
              </div>
            </Card>
          </div>

          <div className="terms-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="checkbox-input"
              />
              <Typography variant="body1">
                I have read and agree to the Terms of Service and understand the privacy policy
              </Typography>
            </label>
          </div>

          {error && (
            <div className="error-message">
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            </div>
          )}

          <div className="action-buttons">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
              className="cancel-button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCompleteRegistration}
              disabled={!acceptedTerms || loading}
              className="complete-button"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create My Account
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterComplete;