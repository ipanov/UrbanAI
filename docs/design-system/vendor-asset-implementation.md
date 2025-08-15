# Vendor Asset Implementation Guide

## Overview
This document provides comprehensive guidelines for implementing official vendor assets across UrbanAI's frontend interfaces, ensuring brand compliance and consistent user experience.

## Asset Sources and Implementation

### OAuth Provider Logos

#### Microsoft Logo
- **Source**: Official Microsoft brand guidelines
- **Implementation**: 4-square logo with official brand colors
- **Colors Used**:
  - Top-left square: `#f25022` (Orange-red)
  - Top-right square: `#00a4ef` (Blue)
  - Bottom-left square: `#ffb900` (Yellow)
  - Bottom-right square: `#7fba00` (Green)
- **SVG Implementation**:
  ```svg
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#00a4ef"/>
    <rect x="1" y="11" width="9" height="9" fill="#ffb900"/>
    <rect x="11" y="11" width="9" height="9" fill="#7fba00"/>
  </svg>
  ```
- **Button Styling**: Blue gradient background (`#0078D4` to `#106ebe`) with white text
- **Compliance**: Follows Microsoft Brand Guidelines for OAuth implementations

#### Google Logo
- **Source**: Official Google brand guidelines
- **Implementation**: Multi-color "G" logo
- **Colors Used**:
  - Blue: `#4285F4`
  - Green: `#34A853`
  - Yellow: `#FBBC05`
  - Red: `#EA4335`
- **SVG Implementation**: Full Google "G" logo with proper color segments
- **Button Styling**: White background with subtle border and shadow
- **Compliance**: Follows Google Sign-In Brand Guidelines

#### Facebook Logo
- **Source**: Official Facebook brand guidelines
- **Implementation**: Facebook "f" logo
- **Colors Used**: Current color (inherits from button)
- **Button Styling**: Facebook blue gradient (`#1877F2` to `#166fe5`) with white text
- **Compliance**: Follows Facebook Brand Guidelines for Login buttons

### App Store Badges

#### Apple App Store Badge
- **Source**: Official Apple App Store Marketing Guidelines
- **Implementation**: "Download on the App Store" badge
- **Dimensions**: 120x40px (standard size)
- **Format**: SVG with embedded Apple logo and typography
- **Usage**: Unaltered as per Apple guidelines
- **Compliance**: Follows Apple App Store Marketing Guidelines

#### Google Play Badge
- **Source**: Official Google Play Badge Generator
- **Implementation**: "GET IT ON Google Play" badge
- **Dimensions**: 135x40px (standard size)
- **Format**: SVG with Google Play logo and gradients
- **Usage**: Unaltered as per Google guidelines
- **Compliance**: Follows Google Play Badge Guidelines

## Implementation Standards

### Button Styling Guidelines

#### OAuth Buttons
1. **Consistent Height**: 56px for desktop, 48px for mobile
2. **Border Radius**: 8px for web, 12px for mobile
3. **Typography**: 16px font weight 600 (14px on mobile)
4. **Icon Size**: 24px x 24px for all provider logos
5. **Spacing**: 12px gap between icon and text
6. **Hover Effects**: 
   - Subtle lift animation (`translateY(-2px)`)
   - Enhanced shadow
   - Shimmer effect overlay

#### Brand-Specific Styling
- **Microsoft**: Blue gradient background with white text
- **Google**: White background with dark text and subtle border
- **Facebook**: Facebook blue gradient with white text

### Accessibility Requirements
1. **ARIA Labels**: All buttons include descriptive `aria-label` attributes
2. **Focus States**: 2px solid outline with 2px offset
3. **Color Contrast**: All text meets WCAG AA standards
4. **Keyboard Navigation**: Full keyboard accessibility support

### Responsive Design
1. **Mobile Optimization**: Reduced padding and font sizes
2. **Touch Targets**: Minimum 44px touch target size
3. **Viewport Adaptation**: Proper scaling across device sizes

## File Locations

### Mock Files
- Web Login: `mocks/web-login-page.html`
- Android Login: `mocks/android-login-screen.html`
- Web Landing: `mocks/web-landing-page.html`
- Android Landing: `mocks/android-landing-screen.html`

### Asset Documentation
- This file: `docs/design-system/vendor-asset-implementation.md`
- Attribution: `docs/design-system/assets/attribution.md`

## Validation Process

### Browser Testing Requirements
1. **Cross-Platform Testing**: Test on multiple browsers and devices
2. **Visual Verification**: Ensure logos display correctly
3. **Interaction Testing**: Verify hover and focus states
4. **Accessibility Testing**: Screen reader and keyboard navigation

### Quality Checklist
- [ ] Official vendor logos implemented correctly
- [ ] Brand colors match official specifications
- [ ] Button styling follows vendor guidelines
- [ ] Accessibility requirements met
- [ ] Responsive design working properly
- [ ] Browser compatibility verified

## Brand Compliance Notes

### Microsoft
- Logo must not be modified or recolored
- Minimum clear space requirements observed
- Proper contrast maintained

### Google
- "G" logo used in official colors only
- No modifications to logo proportions
- Proper spacing and sizing maintained

### Facebook
- Official Facebook blue used
- Logo not modified or distorted
- Proper contrast ratios maintained

### Apple
- App Store badge used unaltered
- Official dimensions maintained
- No modifications to typography or layout

### Google Play
- Official badge from Google Play Console
- No modifications to colors or layout
- Proper attribution maintained

## Future Maintenance

### Regular Updates
1. **Quarterly Review**: Check for updated brand guidelines
2. **Asset Refresh**: Update assets if vendors release new versions
3. **Compliance Audit**: Ensure continued adherence to brand guidelines

### Version Control
- Track asset versions and update dates
- Maintain changelog for asset modifications
- Document any vendor guideline changes

## Contact and Resources

### Official Brand Guidelines
- [Microsoft Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks)
- [Google Brand Guidelines](https://developers.google.com/identity/branding-guidelines)
- [Facebook Brand Guidelines](https://developers.facebook.com/docs/facebook-login/userexperience)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/marketing/guidelines/)
- [Google Play Badge Guidelines](https://play.google.com/intl/en_us/badges/)

---

*Last Updated: 2025-08-15*
*Next Review: 2025-11-15*
