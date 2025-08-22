// Design System Constants
export const COLORS = {
  // Primary Brand Colors
  PRIMARY: {
    50: '#EFF6FF',
    100: '#DBEAFE', 
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#2563EB', // Main brand blue
    600: '#1D4ED8',
    700: '#1E40AF',
    800: '#1E3A8A',
    900: '#1E3A8A'
  },
  
  // Semantic Colors
  SUCCESS: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#059669',
    600: '#047857',
    700: '#065F46'
  },
  
  WARNING: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309'
  },
  
  ERROR: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#DC2626',
    600: '#B91C1C',
    700: '#991B1B'
  },
  
  // Neutral Colors
  NEUTRAL: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A'
  },
  
  // Background Colors
  WHITE: '#FFFFFF',
  BLACK: '#000000'
} as const;

export const TYPOGRAPHY = {
  FONT_FAMILY: {
    PRIMARY: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    MONO: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace'
  },
  
  FONT_SIZES: {
    XS: '0.75rem',    // 12px
    SM: '0.875rem',   // 14px
    BASE: '1rem',     // 16px
    LG: '1.125rem',   // 18px
    XL: '1.25rem',    // 20px
    '2XL': '1.5rem',  // 24px
    '3XL': '1.875rem', // 30px
    '4XL': '2.25rem', // 36px
    '5XL': '3rem',    // 48px
    '6XL': '3.75rem', // 60px
  },
  
  FONT_WEIGHTS: {
    NORMAL: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700'
  },
  
  LINE_HEIGHTS: {
    TIGHT: '1.25',
    NORMAL: '1.5',
    RELAXED: '1.625',
    LOOSE: '2'
  }
} as const;

export const SPACING = {
  XS: '0.25rem',    // 4px
  SM: '0.5rem',     // 8px
  MD: '0.75rem',    // 12px
  LG: '1rem',       // 16px
  XL: '1.25rem',    // 20px
  '2XL': '1.5rem',  // 24px
  '3XL': '2rem',    // 32px
  '4XL': '2.5rem',  // 40px
  '5XL': '3rem',    // 48px
  '6XL': '4rem',    // 64px
  '8XL': '6rem',    // 96px
} as const;

export const BORDERS = {
  RADIUS: {
    NONE: '0',
    SM: '0.125rem',   // 2px
    MD: '0.25rem',    // 4px
    LG: '0.5rem',     // 8px
    XL: '0.75rem',    // 12px
    '2XL': '1rem',    // 16px
    FULL: '9999px'
  },
  
  WIDTH: {
    NONE: '0',
    THIN: '1px',
    THICK: '2px'
  }
} as const;

export const SHADOWS = {
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
} as const;

export const BREAKPOINTS = {
  SM: '480px',
  MD: '768px', 
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080
} as const;

// Application-specific constants
export const AUTH_PROVIDERS = {
  MICROSOFT: 'microsoft',
  GOOGLE: 'google', 
  FACEBOOK: 'facebook'
} as const;

export const ISSUE_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress', 
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected'
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
  AUTH_CALLBACK: '/auth/callback',
  PRIVACY: '/privacy',
  TERMS: '/terms'
} as const;