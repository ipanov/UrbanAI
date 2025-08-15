# Frontend Asset Standards for UrbanAI

## Overview
This document establishes mandatory standards and workflows for all future frontend asset work in UrbanAI, ensuring consistency, brand compliance, and quality across all user interfaces.

## Mandatory Workflow for Frontend Changes

### 1. Asset Integration Process
All frontend asset changes MUST follow this process:

1. **Research Phase**
   - Identify official vendor sources for assets
   - Review brand guidelines and usage requirements
   - Document asset specifications and constraints

2. **Implementation Phase**
   - Implement assets according to vendor guidelines
   - Maintain proper file organization and naming
   - Follow established coding standards

3. **Validation Phase** ⚠️ **MANDATORY**
   - **Browser Testing Required**: Every frontend change MUST be validated using embedded browser testing
   - Test across multiple screen sizes and devices
   - Verify visual correctness and functionality
   - Document any issues or deviations

4. **Documentation Phase**
   - Update asset documentation
   - Record implementation details
   - Maintain attribution records

### 2. Browser Testing Requirements

#### Mandatory Testing Protocol
**Every frontend change must include browser validation before completion.**

```
✅ REQUIRED STEPS:
1. Open embedded browser
2. Navigate to modified HTML files
3. Take screenshots for verification
4. Test interactive elements (hover, focus, click)
5. Verify responsive behavior
6. Document results
```

#### Testing Checklist
- [ ] Visual elements display correctly
- [ ] Brand assets appear as intended
- [ ] Interactive states work properly
- [ ] Responsive design functions across screen sizes
- [ ] Accessibility features are functional
- [ ] No console errors or warnings

## Asset Categories and Standards

### 1. Vendor Assets (OAuth Providers, App Stores)

#### Requirements
- **Source**: Official vendor resources only
- **Modifications**: Prohibited unless explicitly allowed by vendor
- **Colors**: Must match official brand specifications exactly
- **Sizing**: Follow vendor-recommended dimensions
- **Attribution**: Required where specified by vendor

#### Implementation Standards
```css
/* OAuth Button Standards */
.oauth-button {
  height: 56px; /* Desktop */
  height: 48px; /* Mobile */
  border-radius: 8px; /* Web */
  border-radius: 12px; /* Mobile */
  font-size: 16px; /* Desktop */
  font-size: 14px; /* Mobile */
  font-weight: 600;
}

/* Icon Standards */
.oauth-icon {
  width: 24px;
  height: 24px;
}
```

### 2. Custom Assets

#### Logo and Branding
- **Format**: SVG preferred for scalability
- **Fallbacks**: Provide PNG/WebP for complex graphics
- **Optimization**: Use SVGO for SVG optimization
- **Naming**: Descriptive, kebab-case naming convention

#### Icons
- **Library**: Heroicons (MIT license) for consistency
- **Style**: Outline style, 1.5-2px stroke width
- **Theming**: Use `currentColor` for theme compatibility
- **Size**: 16px, 20px, 24px standard sizes

#### Images and Graphics
- **Performance**: Desktop ≤180KB, Mobile ≤120KB
- **Formats**: WebP with fallbacks
- **Attribution**: Required for stock photos
- **Alt Text**: Descriptive alt attributes for accessibility

## File Organization Standards

### Directory Structure
```
docs/design-system/
├── assets/
│   ├── icons/           # Custom icon library
│   ├── backgrounds/     # Background images and patterns
│   ├── badges/          # App store and certification badges
│   ├── stores/          # Vendor store assets
│   ├── photos/          # Stock photography
│   └── attribution.md   # Asset attribution records
├── vendor-asset-implementation.md
├── frontend-asset-standards.md
└── [other design docs]
```

### Naming Conventions
- **Files**: `kebab-case-naming.svg`
- **Classes**: `.component-name__element`
- **IDs**: `#unique-identifier`
- **Variables**: `--css-custom-property`

## Quality Assurance Standards

### Code Quality
1. **Validation**: HTML5 and CSS3 compliant
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Performance**: Optimized asset loading
4. **Cross-browser**: Support for modern browsers

### Visual Quality
1. **Consistency**: Uniform styling across components
2. **Alignment**: Proper spacing and grid alignment
3. **Typography**: Consistent font usage and hierarchy
4. **Colors**: Adherence to design system palette

### Brand Compliance
1. **Vendor Assets**: Unmodified official assets only
2. **Color Accuracy**: Exact brand color matching
3. **Logo Usage**: Proper sizing and clear space
4. **Attribution**: Complete and accurate credits

## Documentation Requirements

### Asset Documentation
Every asset integration must include:

1. **Source Information**
   - Origin and licensing details
   - Version and update information
   - Usage restrictions or requirements

2. **Implementation Details**
   - Technical specifications
   - Integration instructions
   - Customization guidelines

3. **Maintenance Notes**
   - Update schedule and procedures
   - Contact information for issues
   - Version control information

### Change Log
Maintain detailed records of:
- Asset additions and modifications
- Version updates and changes
- Compliance reviews and audits
- Performance optimizations

## Compliance and Legal

### Licensing Requirements
1. **Vendor Assets**: Comply with all vendor terms
2. **Stock Assets**: Maintain proper licensing
3. **Custom Assets**: Document ownership and usage rights
4. **Attribution**: Provide required credits

### Brand Guidelines
1. **Vendor Compliance**: Follow official brand guidelines
2. **Usage Restrictions**: Respect prohibited modifications
3. **Quality Standards**: Maintain professional appearance
4. **Legal Review**: Consult legal for complex usage scenarios

## Performance Standards

### Loading Optimization
1. **Image Compression**: Optimize without quality loss
2. **Format Selection**: Use modern formats with fallbacks
3. **Lazy Loading**: Implement for non-critical images
4. **CDN Usage**: Consider CDN for large assets

### Bundle Size Limits
- **Critical Assets**: <50KB total
- **Page Assets**: <200KB per page
- **Background Images**: <100KB each
- **Icons**: <5KB each (SVG)

## Accessibility Requirements

### Visual Accessibility
1. **Color Contrast**: Minimum 4.5:1 ratio for text
2. **Focus Indicators**: Visible focus states
3. **Alternative Text**: Descriptive alt attributes
4. **Scalability**: Support for 200% zoom

### Interactive Accessibility
1. **Keyboard Navigation**: Full keyboard support
2. **Screen Readers**: Proper ARIA labels
3. **Touch Targets**: Minimum 44px touch areas
4. **Motion**: Respect reduced motion preferences

## Maintenance and Updates

### Regular Reviews
1. **Monthly**: Asset performance review
2. **Quarterly**: Vendor guideline updates
3. **Annually**: Complete compliance audit
4. **As Needed**: Emergency updates for security or legal issues

### Update Procedures
1. **Testing**: Full browser validation required
2. **Documentation**: Update all relevant docs
3. **Rollback Plan**: Maintain previous versions
4. **Communication**: Notify team of changes

## Tools and Resources

### Required Tools
- **Browser Testing**: Embedded browser validation
- **Image Optimization**: SVGO, ImageOptim, or similar
- **Accessibility Testing**: axe-core, WAVE, or similar
- **Performance Testing**: Lighthouse, WebPageTest

### Recommended Resources
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/) for browser compatibility

## Enforcement

### Review Process
All frontend asset changes require:
1. **Peer Review**: Code review by team member
2. **Browser Testing**: Documented validation results
3. **Documentation**: Updated asset documentation
4. **Approval**: Sign-off from designated reviewer

### Quality Gates
- **No Merge**: Without browser testing validation
- **No Deploy**: Without accessibility compliance
- **No Release**: Without performance benchmarks met

---

## Quick Reference Checklist

### Before Starting Asset Work
- [ ] Review vendor brand guidelines
- [ ] Check existing asset documentation
- [ ] Plan file organization and naming
- [ ] Identify testing requirements

### During Implementation
- [ ] Follow established coding standards
- [ ] Maintain proper file structure
- [ ] Implement accessibility features
- [ ] Optimize for performance

### Before Completion
- [ ] **Conduct browser testing validation** ⚠️ **MANDATORY**
- [ ] Update documentation
- [ ] Record attribution information
- [ ] Verify compliance requirements

### After Deployment
- [ ] Monitor performance metrics
- [ ] Schedule maintenance reviews
- [ ] Update team on changes
- [ ] Plan future improvements

---

*This document establishes the mandatory standards for all frontend asset work in UrbanAI. Compliance with these standards is required for all team members and contributors.*

**Last Updated**: 2025-08-15  
**Next Review**: 2025-11-15  
**Document Owner**: Frontend Development Team
