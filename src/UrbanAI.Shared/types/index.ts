// Shared types between web and mobile applications

export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  provider: 'microsoft' | 'google' | 'facebook' | null;
  initials: string;
  userType?: 'citizen' | 'investor' | 'authority' | null;
}

export interface ApiConfig {
  baseUrl: string;
  oauth: {
    redirectUri: string;
  };
}

export interface AppConfig {
  api: ApiConfig;
  environment: 'development' | 'production' | 'staging';
  debug: boolean;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  photoBase64?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  type: 'text' | 'image' | 'location';
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

// Mobile-specific types
export interface MobileAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  userProfile: UserProfile | null;
}

export interface UserTypeSelectionParams {
  onComplete?: (userType: string) => void;
  currentUserType?: string | null;
  showBackButton?: boolean;
}

export interface MobileNavigationProps {
  navigation: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
    setOptions: (options: any) => void;
  };
  route: {
    params?: any;
  };
}