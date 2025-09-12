// UrbanAI Brand Assets Index
// Centralized exports for all brand assets

// Logo Assets
// Note: Actual image files should be placed in /logos/ directory
// These are placeholder paths - replace with actual file paths when images are saved

// Primary Logo Variations
export const LOGO_PRIMARY = '/assets/brand/logos/urbanai-logo-primary.png';
export const LOGO_BLACK = '/assets/brand/logos/urbanai-logo-primary.png'; // Using primary as black variant
export const LOGO_WHITE = '/assets/brand/logos/urbanai-logo-white.png';

// Additional Variations
export const LOGO_VARIATION_1 = '/assets/brand/logos/urbanai-logo-variation-1.png';
export const LOGO_VARIATION_2 = '/assets/brand/logos/urbanai-logo-variation-2.png';
export const LOGO_VARIATION_3 = '/assets/brand/logos/urbanai-logo-variation-3.png';

// Icon-only versions (for favicons, app icons)
export const ICON_PRIMARY = '/assets/brand/logos/urbanai-icon-primary.png';
export const ICON_BLACK = '/assets/brand/logos/urbanai-icon-black.png';
export const ICON_WHITE = '/assets/brand/logos/urbanai-icon-white.png';

// Brand Colors
export const BRAND_COLORS = {
  PRIMARY: '#2563EB',      // Blue - trust, reliability, municipal authority
  SECONDARY: '#059669',    // Green - environmental compliance, safety
  ACCENT: '#EA580C',       // Orange - construction, urgency, action
  SUPPORTING: '#6B7280',   // Gray - professional documentation
  WHITE: '#FFFFFF',
  BLACK: '#000000'
} as const;

// Logo Sizes
export const LOGO_SIZES = {
  FAVICON: 16,
  SMALL: 32,
  MEDIUM: 64,
  LARGE: 128,
  EXTRA_LARGE: 256,
  MAXIMUM: 512
} as const;

// Brand Typography
export const BRAND_FONTS = {
  PRIMARY: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  MONOSPACE: '"SF Mono", Monaco, "Cascadia Code", monospace'
} as const;

// Logo Component Props Types
export interface LogoProps {
  variant?: 'primary' | 'black' | 'white' | 'icon';
  size?: keyof typeof LOGO_SIZES | number;
  className?: string;
  alt?: string;
}

// Usage Examples:
// import { LOGO_PRIMARY, BRAND_COLORS, LOGO_SIZES } from '../assets/brand';
// 
// <img 
//   src={LOGO_PRIMARY} 
//   alt="UrbanAI"
//   width={LOGO_SIZES.LARGE}
//   style={{ color: BRAND_COLORS.PRIMARY }}
// />

export default {
  logos: {
    primary: LOGO_PRIMARY,
    black: LOGO_BLACK,
    white: LOGO_WHITE,
    variations: [LOGO_VARIATION_1, LOGO_VARIATION_2, LOGO_VARIATION_3],
    icons: {
      primary: ICON_PRIMARY,
      black: ICON_BLACK,
      white: ICON_WHITE
    }
  },
  colors: BRAND_COLORS,
  sizes: LOGO_SIZES,
  fonts: BRAND_FONTS
};