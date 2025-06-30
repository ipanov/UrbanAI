# UrbanAI Authentication UI Design

## Overview
The authentication system for UrbanAI uses **OAuth-only authentication** (Microsoft, Google, Facebook) with **maximum privacy protection**. User names and personal data are displayed client-side from OAuth claims but **never stored on UrbanAI servers**. Only OAuth provider GUIDs are stored for linking user cases and data.

## Privacy-First Architecture
- **Server Storage**: Only OAuth `sub` (GUID) + role/preferences - **zero PII**
- **Client Personalization**: Names, emails, avatars from OAuth claims (never transmitted to server)
- **Case Attribution**: Anonymous on server, personalized in client UI
- **GDPR Compliant**: Ultimate data minimization - only GUIDs stored

## Design Principles
- **Trust & Authority**: Professional design that conveys reliability for municipal reporting
- **Accessibility**: WCAG 2.1 AA compliant with clear contrast ratios
- **Multi-User Support**: Clear role identification (Citizen, Investor, Authority)
- **Maximum Privacy**: Zero PII storage, client-side personalization only
- **MVP Focus**: OAuth-only authentication - no credential management

## Authentication Flow Screens

### 1. Welcome/Landing Screen
**Purpose**: First impression, explains UrbanAI's mission
**Components**:
- Hero section with construction/environmental imagery
- Clear value proposition: "Report. Analyze. Resolve."
- Three user type cards: Citizens, Investors, Authorities
- Primary CTA: "Get Started" → leads to OAuth provider selection
- Privacy messaging: "Your data stays private - we only store anonymous case links"

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

    🔒 Maximum Privacy: Only anonymous links stored, 
       your identity stays with trusted providers
```

### 2. OAuth Provider Selection Screen
**Purpose**: Secure third-party authentication selection

**Layout**:
```
              Welcome to UrbanAI

  ┌─────────────────────────────────────────────┐
  │              Choose Login Method            │
  │                                             │
  │     [🟦 Continue with Microsoft]            │
  │     [🔵 Continue with Google]               │
  │     [🟦 Continue with Facebook]             │
  │                                             │
  │  ─────────── Why This Way? ──────────       │
  │                                             │
  │  ✓ Maximum Privacy - No data stored         │
  │  ✓ Secure - Your existing trusted account  │
  │  ✓ Personalized - Your name stays local    │
  │                                             │
  │                [Continue as Guest]         │
  │          (Limited reporting features)      │
  └─────────────────────────────────────────────┘

    🔒 Privacy Guarantee: We only store an anonymous ID
       to link your cases. Your name and email stay with
       your chosen provider and are never transmitted to us.
```

### 3. OAuth Consent & Redirect
**Purpose**: Clear explanation of data flow before OAuth redirect

**Layout**:
```
              Redirecting to [Provider]...

  ┌─────────────────────────────────────────────┐
  │                                             │
  │    [Provider Logo] Secure Authentication    │
  │                                             │
  │    You'll sign in with your [Provider]     │
  │    account. UrbanAI will receive:          │
  │                                             │
  │    ✓ Anonymous ID (for linking your cases) │
  │    ✗ Your name (stays in your browser)     │
  │    ✗ Your email (stays in your browser)    │
  │    ✗ Your profile picture (stays local)    │
  │                                             │
  │    This gives you a personalized experience│
  │    while keeping maximum privacy.          │
  │                                             │
  │    [🔐 Continue to [Provider]]              │
  │    [← Back to Provider Selection]          │
  └─────────────────────────────────────────────┘

  📋 Technical Note:
  Your personal info never leaves your device or the
  OAuth provider. Only an anonymous link is created.
```

### 4. Post-Authentication Role Setup
**Purpose**: Role selection only - no personal data collection

**Layout**:
```
              Complete Your UrbanAI Setup

  Welcome! (Name displayed from your [Provider] account)

  ┌─────────────────────────────────────────────┐
  │                                             │
  │  Select Your Primary Role:                  │
  │                                             │
  │  ○ Citizen - Report issues in my area      │
  │  ○ Investor - Monitor project compliance   │
  │  ○ Authority - Review and resolve cases    │
  │                                             │
  │  Organization (Optional):                   │
  │  [________________]                         │
  │  (Only stored for authorities)              │
  │                                             │
  │  Notification Preferences:                  │
  │  ☑ Case status updates                      │
  │  ☐ Weekly community reports                │
  │  ☐ Regulatory news updates                 │
  │                                             │
  │  ☑ I understand the Privacy Policy         │
  │  ☑ I agree to the Terms of Service         │
  │                                             │
  │              [Complete Setup]               │
  └─────────────────────────────────────────────┘

  📋 Privacy Reminder:
  Your name and profile are displayed from [Provider]
  claims. We only store your role and preferences.
```

### 5. Personalized Dashboard (Client-Side)
**Purpose**: Show how personalization works without server PII storage

**Layout**:
```
              UrbanAI Dashboard

  Welcome back, [Name from OAuth claim]!    [Profile from OAuth] 👤

  ┌─────────────────────────────────────────────────────────────┐
  │  📊 Your Activity                                          │
  │  • 3 Cases Reported                                        │
  │  • 1 Under Review                                          │
  │  • 2 Resolved                                              │
  │                                                             │
  │  🏗️ Recent Cases:                                          │
  │  • Case #001 - Reported by You - [Status]                 │
  │  • Case #002 - Reported by You - [Status]                 │
  │                                              [View All →] │
  └─────────────────────────────────────────────────────────────┘

  Note: All personalization (name, avatar) comes from your
        OAuth provider. Your cases are linked anonymously.
```

## Mobile-First Design Adaptations

### Mobile OAuth Selection (360px width)
```
    UrbanAI
    ═══════

 Choose Login:

 [🟦 Microsoft]
 [🔵 Google   ]
 [🟦 Facebook ]

 ──── Why? ────

 ✓ Max Privacy
 ✓ Your Data Safe
 ✓ Personalized

 [Guest Mode]

 🔒 Anonymous ID only
```

## Design Tokens

### OAuth Button Styles
- **Microsoft**: Background #0078D4, Text White, Height 48px
- **Google**: Background #4285F4, Text White, Height 48px  
- **Facebook**: Background #1877F2, Text White, Height 48px
- **Border Radius**: 8px
- **Hover**: Darken background 10%
- **Focus**: 2px outline for accessibility

### Privacy Indicators
- **Lock Icon**: Consistent privacy messaging
- **Shield Icon**: Maximum privacy protection
- **Check/X Icons**: Clear data flow explanations

## Technical Implementation

### Data Architecture
```
Server Database:
┌─────────────┐
│    Users    │
├─────────────┤
│ UserGuid    │ ← OAuth 'sub' claim only
│ Role        │ ← Citizen/Investor/Authority
│ OrgName     │ ← Optional for authorities
│ Preferences │ ← Notification settings
│ CreatedAt   │
│ LastLogin   │
└─────────────┘

Client-Side (from OAuth Claims):
{
  "name": "John Doe",           // Never sent to server
  "given_name": "John",        // Never sent to server
  "email": "john@example.com",  // Never sent to server
  "picture": "https://...",     // Never sent to server
  "sub": "oauth-guid-123"       // Only this sent to server
}
```

### API Design
```javascript
// Request - Only GUID in headers
Authorization: Bearer jwt-with-sub-claim

// Response - No PII ever returned
{
  "userGuid": "oauth-guid-123",
  "role": "citizen",
  "cases": [
    {
      "id": "case-001",
      "title": "Broken sidewalk",
      "reportedBy": "You",  // Client determines this
      "status": "under-review"
    }
  ]
}
```

## GDPR Excellence

### Data Minimization (Ultimate Implementation)
- **Personal Data Stored**: None (only OAuth GUIDs)
- **Right to Erasure**: Delete GUID → cascade delete all cases
- **Data Portability**: Export user's cases by GUID
- **Consent**: Only for role and notification preferences

### Privacy Policy Highlights
- "We never store your name, email, or personal information"
- "Personalization happens in your browser using your trusted provider"
- "Only anonymous case links stored for municipal tracking"
- "Delete your account = immediate data erasure"

## Error States & Fallbacks

### OAuth Failures
- ✗ "Authentication failed. Please try another provider."
- ✗ "Provider temporarily unavailable. Try Guest mode?"
- ✗ "Network error. Check connection and retry."

### Privacy Fallbacks
- If OAuth claims unavailable: "Welcome back!" (generic)
- If provider profile missing: Default avatar placeholder
- Guest mode: Full functionality without personalization

## Implementation Notes for Figma

### Component Library Structure
```
🎨 UrbanAI Privacy-First Design System
├── 🎯 Foundations
│   ├── Colors
│   ├── Typography  
│   ├── Spacing
│   ├── Privacy Icons
│   └── OAuth Branding
├── 🧩 Components
│   ├── OAuth Buttons (Microsoft, Google, Facebook)
│   ├── Privacy Notices
│   ├── Role Selectors
│   ├── Anonymous Case Cards
│   └── Personalized Headers (client-side)
└── 📱 Templates
    ├── OAuth Flow Screens
    ├── Privacy-First Dashboard
    └── Mobile Views
```

### Design Annotations
- Mark personalized elements as "From OAuth Claims (Client-Side)"
- Highlight privacy guarantees in all authentication flows
- Show data flow diagrams (OAuth → Client → Anonymous Server)
- Include fallback states for missing OAuth data

This authentication system provides the ultimate in privacy protection while maintaining excellent user experience. Users get full personalization through their trusted OAuth providers while UrbanAI stores only the minimum data needed for municipal issue tracking and compliance.