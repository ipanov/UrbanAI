import React from 'react';
import { LOGO_PRIMARY, LOGO_BLACK, LOGO_WHITE, LOGO_SIZES, LogoProps } from '../assets/brand';
import './UrbanAILogo.css';

/**
 * UrbanAI Logo Component
 * 
 * Displays the official UrbanAI logo with proper brand compliance.
 * Features the City Skyline Integration design with circuit board patterns.
 */
const UrbanAILogo: React.FC<LogoProps> = ({
  variant = 'primary',
  size = 'LARGE',
  className = '',
  alt = 'UrbanAI - Municipal Issue Reporting Platform'
}) => {
  // Determine logo source based on variant
  const getLogoSrc = (): string => {
    switch (variant) {
      case 'black':
        return LOGO_BLACK;
      case 'white':
        return LOGO_WHITE;
      case 'icon':
        // Fallback to primary for icon variant until icon-only assets are created
        return LOGO_PRIMARY;
      case 'primary':
      default:
        return LOGO_PRIMARY;
    }
  };

  // Handle size - can be a preset or custom number
  const getLogoSize = (): number => {
    if (typeof size === 'number') {
      return size;
    }
    return LOGO_SIZES[size] || LOGO_SIZES.LARGE;
  };

  const logoSize = getLogoSize();
  const logoSrc = getLogoSrc();

  return (
    <div className={`urbanai-logo ${className}`}>
      <img
        src={logoSrc}
        alt={alt}
        width={logoSize * 4} // Assuming 4:1 aspect ratio for horizontal logo
        height={logoSize}
        className={`urbanai-logo__image urbanai-logo__image--${variant}`}
        loading="lazy"
      />
    </div>
  );
};

/**
 * Logo Text Component
 * For cases where only the "UrbanAI" text is needed without the skyline graphic
 */
export const UrbanAILogoText: React.FC<{
  variant?: 'primary' | 'black' | 'white';
  size?: 'small' | 'medium' | 'large' | number;
  className?: string;
}> = ({
  variant = 'primary',
  size = 'medium',
  className = ''
}) => {
  const getTextSize = (): string => {
    if (typeof size === 'number') {
      return `${size}px`;
    }
    switch (size) {
      case 'small': return '16px';
      case 'large': return '32px';
      case 'medium':
      default: return '24px';
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'black': return '#000000';
      case 'white': return '#FFFFFF';
      case 'primary':
      default: return '#2563EB';
    }
  };

  return (
    <div 
      className={`urbanai-logo-text ${className}`}
      style={{
        fontSize: getTextSize(),
        color: getTextColor(),
        fontWeight: 700,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <span className="urbanai-logo-text__urban">Urban</span>
      <span className="urbanai-logo-text__ai">AI</span>
    </div>
  );
};

/**
 * Placeholder Logo Component
 * Used during development when actual logo images aren't available
 */
export const UrbanAILogoPlaceholder: React.FC<{
  variant?: 'primary' | 'black' | 'white';
  size?: number;
  className?: string;
}> = ({
  variant = 'primary',
  size = 128,
  className = ''
}) => {
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'black': return '#000000';
      case 'white': return '#FFFFFF';
      case 'primary':
      default: return '#2563EB';
    }
  };

  const getTextColor = (): string => {
    return variant === 'white' ? '#000000' : '#FFFFFF';
  };

  return (
    <div 
      className={`urbanai-logo-placeholder ${className}`}
      style={{
        width: size * 4,
        height: size,
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 700,
        fontSize: `${size * 0.2}px`,
        border: variant === 'white' ? '1px solid #e5e7eb' : 'none'
      }}
    >
      <span>Urban</span>
      <span style={{ fontWeight: 900 }}>AI</span>
      {/* Simple skyline representation */}
      <div style={{
        marginLeft: '8px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '2px'
      }}>
        <div style={{ width: '3px', height: '8px', backgroundColor: 'currentColor', opacity: 0.7 }} />
        <div style={{ width: '3px', height: '12px', backgroundColor: 'currentColor', opacity: 0.7 }} />
        <div style={{ width: '3px', height: '6px', backgroundColor: 'currentColor', opacity: 0.7 }} />
        <div style={{ width: '3px', height: '10px', backgroundColor: 'currentColor', opacity: 0.7 }} />
      </div>
    </div>
  );
};

export default UrbanAILogo;