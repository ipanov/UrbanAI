# UrbanAI Authentication UI Design

## Overview
The authentication system for UrbanAI supports multi-provider login with a focus on accessibility, GDPR compliance, and clear user guidance for citizens, investors, and municipal authorities.

## Design Principles
- **Trust & Authority**: Professional design that conveys reliability for municipal reporting
- **Accessibility**: WCAG 2.1 AA compliant with clear contrast ratios
- **Multi-User Support**: Clear role identification (Citizen, Investor, Authority)
- **GDPR Compliant**: Transparent data handling with explicit consent

## Authentication Flow Screens

### 1. Welcome/Landing Screen
**Purpose**: First impression, explains UrbanAI's mission
**Components**:
- Hero section with construction/environmental imagery
- Clear value proposition: "Report. Analyze. Resolve."
- Three user type cards: Citizens, Investors, Authorities
- Primary CTA: "Get Started" → leads to Sign In/Sign Up choice

**Layout**:
```
[UrbanAI Logo]                                    [Language: EN ▼]

        Report Construction & Environmental Issues
              with AI-Powered Analysis

    [Hero Image: Construction site with safety overlay]

  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │   Citizens  │  │  Investors  │  │ Authorities │
  │   Report    │  │   Monitor   │  │   Review    │
  │   Issues    │  │  Projects   │  │  & Resolve  │
  └─────────────┘  └─────────────┘  └─────────────┘

                  [Get Started →]
```

### 2. Sign In / Sign Up Choice Screen
**Purpose**: Clear GDPR-compliant choice between existing users and new registrations

**Layout**:
```
              Welcome to UrbanAI

  ┌─────────────────────────────────────────────┐
  │              Returning User?                │
  │                                             │
  │           [Sign In to Account]              │
  │                                             │
  │    Access your reports and case history     │
  └─────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────┐
  │               New to UrbanAI?               │
  │                                             │
  │            [Create Account]                 │
  │                                             │
  │  Join thousands helping improve urban safety│
  └─────────────────────────────────────────────┘

                [Continue as Guest]
          (Limited reporting features)
```

### 3. Multi-Provider Sign In Screen
**Purpose**: Streamlined authentication with popular providers

**Layout**:
```
                Sign In to UrbanAI

  ┌─────────────────────────────────────────────┐
  │                                             │
  │     [🌐 Sign in with Microsoft]             │
  │     [🔵 Sign in with Google]                │
  │     [📧 Sign in with Email]                 │
  │                                             │
  │  ─────────── or ──────────                  │
  │                                             │
  │  Email: [________________]                  │
  │  Password: [________________]               │
  │                                             │
  │  ☐ Remember me    [Forgot password?]       │
  │                                             │
  │              [Sign In]                      │
  │                                             │
  │  Don't have an account? [Sign up here]     │
  └─────────────────────────────────────────────┘

    🔒 Your data is encrypted and GDPR compliant
```

### 4. Registration Screen with GDPR Compliance
**Purpose**: Account creation with clear consent and data handling

**Layout**:
```
              Create Your UrbanAI Account

  User Type: [Citizen ▼] [Investor] [Authority]

  ┌─────────────────────────────────────────────┐
  │                                             │
  │     [🌐 Sign up with Microsoft]             │
  │     [🔵 Sign up with Google]                │
  │     [📧 Sign up with Email]                 │
  │                                             │
  │  ─────────── or ──────────                  │
  │                                             │
  │  Full Name: [________________]              │
  │  Email: [________________]                  │
  │  Password: [________________]               │
  │  Confirm: [________________]                │
  │                                             │
  │  Organization: [________________]           │
  │  (Optional for Citizens)                    │
  │                                             │
  │  ☑ I agree to the Terms of Service          │
  │  ☑ I accept the Privacy Policy              │
  │  ☐ Send me updates on case resolutions      │
  │                                             │
  │              [Create Account]               │
  │                                             │
  │  Already registered? [Sign in here]        │
  └─────────────────────────────────────────────┘

  📋 Data Collection Notice:
  We collect your information to enable issue reporting,
  communicate with authorities, and track case resolution.
  [Learn more about data handling]
```

## Mobile-First Design Adaptations

### Mobile Sign In (360px width)
```
    UrbanAI
    ═══════

 [🌐 Microsoft]
 [🔵 Google]
 [📧 Email]

 ──── or ────

 Email:
 [____________]

 Password:
 [____________]

 ☐ Remember me

    [Sign In]

 [Forgot password?]
 [Sign up here]
```

## Design Tokens

### Spacing
- **xs**: 4px
- **sm**: 8px  
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### Typography
- **Heading 1**: Inter 32px Bold (Desktop) / 24px (Mobile)
- **Heading 2**: Inter 24px SemiBold
- **Body**: Inter 16px Regular
- **Caption**: Inter 14px Regular
- **Button Text**: Inter 16px Medium

### Button Styles
- **Primary**: Background #2563EB, Text White, Height 48px
- **Secondary**: Border #2563EB, Text #2563EB, Height 48px  
- **Social**: Custom per provider, Height 48px
- **Border Radius**: 8px
- **Hover**: Darken background 10%

### Form Elements
- **Input Height**: 48px
- **Border**: 1px solid #E5E7EB
- **Focus Border**: 2px solid #2563EB
- **Border Radius**: 6px
- **Placeholder**: #9CA3AF

## Accessibility Features

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: 2px blue outline on all interactive elements
- **Keyboard Navigation**: Tab order follows logical flow
- **Screen Reader**: Proper ARIA labels and descriptions

### Inclusive Design
- **Error Messages**: Clear, actionable guidance
- **Password Requirements**: Visible checklist during input
- **Loading States**: Progress indicators with text descriptions
- **Multiple Authentication Options**: Reduces barrier for users with disabilities

## Privacy & GDPR Elements

### Required Legal Components
- **Terms of Service Link**: Prominently placed, opens in new tab
- **Privacy Policy Link**: Accessible before account creation
- **Cookie Consent**: Separate banner with granular controls
- **Data Deletion**: Clear process explained in account settings
- **Export Data**: One-click download of user data

### Consent Language
- Clear, jargon-free explanations
- Separate checkboxes for required vs. optional data processing
- Easy opt-out mechanisms
- Regular consent renewal prompts

## Error States & Validation

### Form Validation
- **Real-time**: Email format, password strength
- **Server Errors**: Clear messaging with resolution steps
- **Network Issues**: Offline capability messaging
- **Rate Limiting**: Clear explanation with retry timing

### Example Error Messages
- ✗ "Please enter a valid email address"
- ✗ "Password must be at least 8 characters with one number"
- ✗ "This email is already registered. [Sign in instead?]"
- ✗ "Connection error. Check your internet and try again."

## Implementation Notes for Figma

### Component Library Structure
```
🎨 UrbanAI Design System
├── 🎯 Foundations
│   ├── Colors
│   ├── Typography  
│   ├── Spacing
│   └── Icons
├── 🧩 Components
│   ├── Buttons
│   ├── Form Inputs
│   ├── Cards
│   └── Navigation
└── 📱 Templates
    ├── Auth Screens
    ├── Dashboard
    └── Mobile Views
```

### Figma Plugin Integrations
- **Design Tokens**: Export to CSS custom properties
- **Accessibility Checker**: Ensure contrast compliance
- **Component Documentation**: Auto-generate style guide
- **Prototype Testing**: User flow validation

This authentication system balances professional municipal trust with modern UX patterns, ensuring all user types (citizens, investors, authorities) can easily access UrbanAI's construction and environmental reporting capabilities.
