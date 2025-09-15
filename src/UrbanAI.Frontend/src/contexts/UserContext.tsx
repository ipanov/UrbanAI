import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  provider: 'microsoft' | 'google' | 'facebook' | null;
  initials: string;
  userType: 'citizen' | 'investor' | 'authority';
}

interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: (_profile: UserProfile | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);

  // Load user profile from localStorage on mount (browser-only storage)
  useEffect(() => {
    const storedProfile = localStorage.getItem('urbanai_user_profile');
    const token = localStorage.getItem('urbanai_token');
    
    if (storedProfile && token) {
      try {
        const profile = JSON.parse(storedProfile);
        setUserProfileState(profile);
      } catch (error) {
        console.warn('Failed to parse stored user profile:', error);
        localStorage.removeItem('urbanai_user_profile');
      }
    }
  }, []);

  // Helper to generate initials from display name
  const generateInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const setUserProfile = (profile: UserProfile | null) => {
    if (profile) {
      // Ensure initials are generated
      const profileWithInitials = {
        ...profile,
        initials: profile.initials || generateInitials(profile.displayName)
      };
      
      // Store in localStorage (browser-only, never sent to server)
      localStorage.setItem('urbanai_user_profile', JSON.stringify(profileWithInitials));
      setUserProfileState(profileWithInitials);
    } else {
      localStorage.removeItem('urbanai_user_profile');
      setUserProfileState(null);
    }
  };

  const logout = () => {
    // Clear all user data from browser storage
    localStorage.removeItem('urbanai_token');
    localStorage.removeItem('urbanai_user_profile');
    localStorage.removeItem('urbanai_tutorial_completed');
    localStorage.removeItem('urbanai_welcome_issue_seen');
    localStorage.removeItem('urbanai_welcome_issue_dismissed');
    
    setUserProfileState(null);
    window.location.href = '/';
  };

  const isAuthenticated = !!localStorage.getItem('urbanai_token');

  const value: UserContextType = {
    userProfile,
    setUserProfile,
    isAuthenticated,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Helper to extract user info from OAuth provider responses (client-side only)
// eslint-disable-next-line react-refresh/only-export-components
export const extractUserInfoFromProvider = (
  provider: 'microsoft' | 'google' | 'facebook',
  providerUserData?: any,
  userType?: 'citizen' | 'investor' | 'authority'
): Partial<UserProfile> => {
  
  if (!providerUserData) {
    throw new Error(`No user data provided for ${provider} OAuth response`);
  }

  // Real OAuth provider data extraction
  let firstName = '';
  let lastName = '';
  let displayName = '';
  let email = '';

  switch (provider) {
    case 'microsoft':
      // Microsoft Graph API user object structure
      firstName = providerUserData.FirstName || providerUserData.givenName || '';
      lastName = providerUserData.LastName || providerUserData.surname || '';
      displayName = providerUserData.Name || providerUserData.displayName || `${firstName} ${lastName}`.trim();
      email = providerUserData.Email || providerUserData.mail || providerUserData.userPrincipalName || '';
      break;
    
    case 'google':
      // Google OAuth user info structure
      firstName = providerUserData.FirstName || providerUserData.given_name || '';
      lastName = providerUserData.LastName || providerUserData.family_name || '';
      displayName = providerUserData.Name || providerUserData.name || `${firstName} ${lastName}`.trim();
      email = providerUserData.Email || providerUserData.email || '';
      break;
    
    case 'facebook':
      // Facebook Graph API user structure
      firstName = providerUserData.FirstName || providerUserData.first_name || '';
      lastName = providerUserData.LastName || providerUserData.last_name || '';
      displayName = providerUserData.Name || providerUserData.name || `${firstName} ${lastName}`.trim();
      email = providerUserData.Email || providerUserData.email || '';
      break;
      
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  if (!displayName || displayName.trim() === '') {
    throw new Error(`Invalid user data received from ${provider} - missing display name`);
  }

  return {
    firstName,
    lastName,
    displayName,
    email,
    provider,
    initials: '',
    userType: userType || 'citizen' // Default to citizen if not specified
  };
};