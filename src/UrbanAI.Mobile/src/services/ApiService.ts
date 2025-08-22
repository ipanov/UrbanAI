// API Service for mobile app - reusing backend endpoints
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../../UrbanAI.Shared/constants';
import { CreateIssueRequest, Issue, UserProfile } from '../../../UrbanAI.Shared/types';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5001/api'  // Development - connect to local backend
  : 'https://api.urbanai.site/api'; // Production

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // OAuth Authentication
  async getAuthorizationUrl(provider: string): Promise<{
    authorizationUrl: string;
    state: string;
    codeVerifier: string;
  }> {
    return this.makeRequest(`${API_ENDPOINTS.AUTH.AUTHORIZE}/${provider}`, {
      method: 'POST',
    });
  }

  async handleOAuthCallback(code: string, state: string): Promise<{
    token?: string;
    userInfo?: any;
    requiresRegistration?: boolean;
    provider?: string;
    externalId?: string;
  }> {
    return this.makeRequest(
      `${API_ENDPOINTS.AUTH.CALLBACK}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
    );
  }

  async registerExternal(provider: string, externalId: string): Promise<{ token: string }> {
    return this.makeRequest(API_ENDPOINTS.AUTH.REGISTER_EXTERNAL, {
      method: 'POST',
      body: JSON.stringify({ provider, externalId }),
    });
  }

  // Issues
  async createIssue(issueData: CreateIssueRequest): Promise<Issue> {
    return this.makeRequest(API_ENDPOINTS.ISSUES.CREATE, {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  }

  async getIssues(): Promise<Issue[]> {
    return this.makeRequest(API_ENDPOINTS.ISSUES.LIST);
  }

  async getIssue(id: string): Promise<Issue> {
    return this.makeRequest(API_ENDPOINTS.ISSUES.GET(id));
  }

  // AI Chat for issue analysis
  async analyzeIssueWithAI(description: string, photoBase64?: string): Promise<{
    suggestedTitle: string;
    suggestedPriority: string;
    analysisResult: string;
    suggestedActions: string[];
  }> {
    // This will connect to your AI analysis endpoint when implemented
    return this.makeRequest('ai/analyze-issue', {
      method: 'POST',
      body: JSON.stringify({ description, photoBase64 }),
    });
  }
}

export default new ApiService();