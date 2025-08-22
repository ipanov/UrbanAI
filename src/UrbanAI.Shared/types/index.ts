// Shared types between web and mobile applications

export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  provider: 'microsoft' | 'google' | 'facebook' | null;
  initials: string;
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