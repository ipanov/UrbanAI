// Shared constants between web and mobile applications

export const AUTH_PROVIDERS = {
  MICROSOFT: 'microsoft',
  GOOGLE: 'google', 
  FACEBOOK: 'facebook'
} as const;

export const USER_TYPES = {
  CITIZEN: 'citizen',
  INVESTOR: 'investor', 
  AUTHORITY: 'authority'
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ISSUES: '/issues',
  SETTINGS: '/settings',
  AUTH_CALLBACK: '/auth/callback'
} as const;

export const ISSUE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export const ISSUE_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress', 
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'urbanai_token',
  USER_PROFILE: 'urbanai_user_profile',
  TUTORIAL_COMPLETED: 'urbanai_tutorial_completed',
  WELCOME_ISSUE_SEEN: 'urbanai_welcome_issue_seen',
  WELCOME_ISSUE_DISMISSED: 'urbanai_welcome_issue_dismissed'
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    AUTHORIZE: 'auth/authorize',
    CALLBACK: 'auth/callback',
    REGISTER_EXTERNAL: 'auth/register-external',
    EXCHANGE_TOKEN: 'auth/exchange-token'
  },
  ISSUES: {
    LIST: 'issues',
    CREATE: 'issues',
    GET: (id: string) => `issues/${id}`,
    UPDATE: (id: string) => `issues/${id}`,
    DELETE: (id: string) => `issues/${id}`
  }
} as const;