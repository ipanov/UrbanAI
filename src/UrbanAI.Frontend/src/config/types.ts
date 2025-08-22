// Configuration Type Definitions
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
