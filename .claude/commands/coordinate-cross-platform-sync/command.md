# Command: coordinate-cross-platform-sync

## Purpose

Cross-platform UI synchronization coordination for UrbanAI applications. This command provides standardized synchronization patterns for ensuring consistent user experience across web, Android, and iOS platforms.

## Usage

```markdown
# Basic cross-platform synchronization
coordinate-cross-platform-sync({
  platforms: ["web", "android", "ios"],
  sync_type: "ui_components",
  feature_name: "issue-reporting-form"
})

# Comprehensive synchronization with validation
coordinate-cross-platform-sync({
  platforms: ["web", "android", "ios"],
  sync_type: "complete_feature",
  feature_name: "notification-system",
  validate_consistency: true,
  sync_design_tokens: true,
  performance_benchmarks: true
})
```

## Parameters

### Required Parameters
- `platforms` (Array): Array of platforms to synchronize (["web", "android", "ios"])
- `sync_type` (String): Type of synchronization ("ui_components", "design_tokens", "user_flows", "complete_feature")
- `feature_name` (String): Name of the feature or component to synchronize

### Optional Parameters
- `validate_consistency` (Boolean): Whether to validate cross-platform consistency (default: true)
- `sync_design_tokens` (Boolean): Whether to synchronize design tokens (default: true)
- `performance_benchmarks` (Boolean): Whether to include performance benchmarks (default: true)
- `accessibility_validation` (Boolean): Whether to validate accessibility (default: true)
- `timeout_ms` (Number): Timeout for synchronization in milliseconds (default: 300000)

## Synchronization Types

### 1. `ui_components`
Synchronize individual UI components across platforms:
- Component structure and props
- Styling and theming
- Interactive behavior
- Responsive design patterns

### 2. `design_tokens`
Synchronize design system tokens:
- Colors, typography, spacing
- Iconography and imagery
- Motion and animations
- Brand consistency elements

### 3. `user_flows`
Synchronize user journey flows:
- Navigation patterns
- Form workflows
- Authentication flows
- Error handling patterns

### 4. `complete_feature`
Comprehensive feature synchronization:
- All UI components
- Design tokens
- User flows
- Business logic integration
- Performance optimization

## Return Value

```javascript
{
  success: true,
  sync_results: {
    web: { status: "synchronized", components: 12, design_tokens: 24, performance_score: 95 },
    android: { status: "synchronized", components: 12, design_tokens: 24, performance_score: 92 },
    ios: { status: "synchronized", components: 12, design_tokens: 24, performance_score: 94 }
  },
  consistency_score: 0.96,
  validation_issues: [],
  performance_metrics: {
    web: { lcp: 1.2, fid: 45, cls: 0.05 },
    android: { startup_time: 2.1, memory_usage: 85 },
    ios: { startup_time: 1.9, memory_usage: 78 }
  },
  execution_time: 120000
}
```

## Examples

### Component Synchronization
```javascript
const result = await coordinateCrossPlatformSync({
  platforms: ["web", "android", "ios"],
  sync_type: "ui_components",
  feature_name: "issue-reporting-form",
  validate_consistency: true,
  sync_design_tokens: true
});
```

### Complete Feature Synchronization
```javascript
const result = await coordinateCrossPlatformSync({
  platforms: ["web", "android", "ios"],
  sync_type: "complete_feature",
  feature_name: "notification-system",
  validate_consistency: true,
  sync_design_tokens: true,
  performance_benchmarks: true,
  accessibility_validation: true,
  timeout_ms: 600000
});
```

### Design Token Synchronization
```javascript
const result = await coordinateCrossPlatformSync({
  platforms: ["web", "android", "ios"],
  sync_type: "design_tokens",
  feature_name: "brand-refresh",
  validate_consistency: true
});
```

## Agent Integration

### Frontend Team Lead Integration
```markdown
# UI component synchronization
coordinate-cross-platform-sync({
  platforms: ["web", "android", "ios"],
  sync_type: "ui_components",
  feature_name: "issue-card",
  validate_consistency: true
})
```

### UX Designer Integration
```markdown
# Design system synchronization
coordinate-cross-platform-sync({
  platforms: ["web", "android", "ios"],
  sync_type: "design_tokens",
  feature_name: "design-system-update",
  validate_consistency: true
})
```

### Mobile Team Lead Integration
```markdown
# Mobile platform synchronization
coordinate-cross-platform-sync({
  platforms: ["android", "ios"],
  sync_type: "complete_feature",
  feature_name: "mobile-navigation",
  validate_consistency: true
})
```

### QA Team Lead Integration
```markdown
# Cross-platform testing synchronization
coordinate-cross-platform-sync({
  platforms: ["web", "android", "ios"],
  sync_type: "complete_feature",
  feature_name: "authentication-flow",
  validate_consistency: true,
  accessibility_validation: true
})
```

## Synchronization Workflow

### Phase 1: Platform Analysis
```markdown
1. **Inventory Existing Components**: Catalog current components on each platform
2. **Identify Discrepancies**: Find differences in behavior, styling, or functionality
3. **Establish Baseline**: Determine target state for synchronization
4. **Plan Synchronization Strategy**: Define approach for each platform
```

### Phase 2: Design Token Alignment
```markdown
1. **Extract Current Tokens**: Gather design tokens from each platform
2. **Identify Inconsistencies**: Find color, typography, and spacing differences
3. **Standardize Tokens**: Create unified design token specification
4. **Apply Tokens**: Update each platform with standardized tokens
```

### Phase 3: Component Synchronization
```markdown
1. **Analyze Component Structure**: Compare component architectures across platforms
2. **Sync Props and APIs**: Align component interfaces and behavior
3. **Update Styling**: Apply consistent styling patterns
4. **Validate Interactions**: Ensure consistent user interactions
```

### Phase 4: Validation and Testing
```markdown
1. **Visual Consistency Check**: Validate pixel-perfect visual alignment
2. **Functional Testing**: Ensure consistent behavior across platforms
3. **Performance Validation**: Verify performance benchmarks are met
4. **Accessibility Testing**: Validate WCAG compliance across platforms
```

## Platform-Specific Considerations

### Web Platform (React TypeScript)
- Component structure: Functional components with hooks
- Styling: CSS-in-JS with styled-components or Tailwind
- Responsive design: Mobile-first approach
- Performance: Bundle size optimization and lazy loading

### Android Platform (React Native)
- Component structure: React Native components with platform-specific adaptations
- Styling: StyleSheet with platform-specific styling
- Navigation: React Navigation with native navigation patterns
- Performance: Native module optimization and memory management

### iOS Platform (React Native)
- Component structure: React Native components with iOS-specific adaptations
- Styling: StyleSheet with iOS design system compliance
- Navigation: Native iOS navigation patterns
- Performance: iOS-specific optimizations and App Store compliance

## Consistency Validation

### Visual Consistency
- **Layout Validation**: Component spacing and alignment
- **Color Consistency**: Exact color matching across platforms
- **Typography**: Font sizes, weights, and line heights
- **Iconography**: Consistent icon usage and styling

### Functional Consistency
- **Behavior Matching**: Identical user interactions
- **Data Validation**: Consistent form validation patterns
- **Error Handling**: Unified error display and recovery
- **Accessibility**: Screen reader and keyboard navigation

### Performance Consistency
- **Response Times**: Consistent interaction speeds
- **Memory Usage**: Platform-appropriate memory optimization
- **Startup Performance**: Fast application initialization
- **Animation Smoothness**: 60fps animations across platforms

## Design Token Management

### Token Categories
```javascript
{
  colors: {
    primary: "#007AFF",
    secondary: "#5856D6",
    success: "#34C759",
    warning: "#FF9500",
    error: "#FF3B30"
  },
  typography: {
    fontFamily: "SF Pro Display",
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999
  }
}
```

### Token Distribution
- **Web**: CSS variables, theme context, styled-components theme
- **Android**: StyleSheet constants, theme provider
- **iOS**: StyleSheet constants, design system library

## Performance Benchmarks

### Web Platform Benchmarks
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8 seconds

### Mobile Platform Benchmarks
- **App Startup Time**: < 3 seconds
- **Memory Usage**: < 150 MB
- **Frame Rate**: 60 FPS for smooth animations
- **Battery Impact**: Minimal battery consumption

## Accessibility Compliance

### WCAG 2.1 AA Requirements
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Screen Reader Support**: ARIA labels and roles
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators

### Cross-Platform Accessibility
- **Web**: WAI-ARIA compliance, semantic HTML
- **Android**: TalkBack support, accessibility services
- **iOS**: VoiceOver support, Dynamic Type

## Error Handling

### Common Synchronization Issues
1. **Platform-Specific Limitations**: Native platform constraints
2. **Performance Differences**: Varying device capabilities
3. **Design System Conflicts**: Platform design guidelines
4. **Testing Coverage**: Incomplete cross-platform testing

### Resolution Strategies
- **Graceful Degradation**: Fallback for unsupported features
- **Platform Adaptations**: Native implementations where needed
- **Progressive Enhancement**: Advanced features for capable devices
- **Comprehensive Testing**: Multi-device testing matrix

## Best Practices

1. **Mobile-First Design**: Design for mobile first, then scale up
2. **Consistent Interaction Patterns**: Use platform-appropriate but consistent patterns
3. **Performance Optimization**: Optimize for each platform's constraints
4. **Accessibility First**: Ensure accessibility from the start
5. **Continuous Validation**: Regular cross-platform testing
6. **Design System Governance**: Maintain strict design token management

## Dependencies

- Design system management tools
- Cross-platform component libraries
- Visual regression testing tools
- Performance monitoring utilities
- Accessibility validation tools
- Platform-specific build tools

## Integration Patterns

### With Agent Workflows
```javascript
// Frontend Team Lead workflow
const syncResult = await coordinateCrossPlatformSync({
  platforms: ["web", "android", "ios"],
  sync_type: "complete_feature",
  feature_name: currentFeature,
  validate_consistency: true
});

// Use sync results in agent decision making
if (syncResult.consistency_score < 0.9) {
  // Address consistency issues
}
```

### With Quality Gates
```javascript
// Quality gate validation
const qualityResult = await validateQualityGates({
  quality_gates: ["cross_platform_sync"],
  agent_type: "frontend-team-lead",
  evidence_required: true
});
```