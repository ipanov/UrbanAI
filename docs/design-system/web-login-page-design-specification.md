# UrbanAI Web App Login Page Design Specification

This document specifies the detailed design requirements for the UrbanAI Web Application's OAuth-only Login Page, integrating maximum privacy protection and GDPR compliance principles.

## 1. Overview

The Web Login Page serves as the secure entry point using **OAuth-only authentication** (Microsoft, Google, Facebook). The design prioritizes **maximum privacy protection** where only anonymous OAuth GUIDs are stored server-side while user personalization happens client-side through OAuth claims.

## 2. Privacy-First Architecture

*   **Server Storage**: Only OAuth `sub` (GUID) + role/preferences - **zero PII**
*   **Client Personalization**: Names, emails, avatars from OAuth claims (never transmitted to server)
*   **No Form Inputs**: No email/password fields - OAuth providers handle all credential management
*   **GDPR Excellence**: Ultimate data minimization implementation

## 3. Layout & Structure

*   **Layout:** Centered OAuth provider selection with clear privacy messaging
*   **Responsiveness:** Fully responsive, adapting gracefully to various desktop, tablet, and mobile screen sizes
*   **Visual Hierarchy:** Clear distinction between OAuth providers and privacy guarantees

## 4. Key Elements & Details

### 4.1. Branding

*   **Logo:** Prominently display the UrbanAI logo at the top of the page
*   **Color Palette:** Adhere to the primary and secondary colors defined in the `UrbanAI-Design-System` Figma file
*   **Typography:** Use font families and text styles as defined in the `UrbanAI-Design-System` for headings, body text, and labels

### 4.2. OAuth Provider Buttons

*   **Microsoft OAuth Button:**
    *   **Text:** "🏢 Continue with Microsoft"
    *   **Style:** Microsoft brand color (#0078D4), white text, 48px height
    *   **Icon:** Microsoft logo or office building emoji
    *   **Target:** Microsoft OAuth endpoint with appropriate scopes
*   **Google OAuth Button:**
    *   **Text:** "🔵 Continue with Google"
    *   **Style:** Google brand color (#4285F4), white text, 48px height
    *   **Icon:** Google logo or colored circle emoji
    *   **Target:** Google OAuth endpoint with appropriate scopes
*   **Facebook OAuth Button:**
    *   **Text:** "🟦 Continue with Facebook"
    *   **Style:** Facebook brand color (#1877F2), white text, 48px height
    *   **Icon:** Facebook logo or blue square emoji
    *   **Target:** Facebook OAuth endpoint with appropriate scopes

### 4.3. Privacy Messaging

*   **Main Privacy Notice:**
    *   **Text:** "Maximum Privacy: We only store an anonymous ID to link your cases. Your name and email stay with your chosen provider."
    *   **Placement:** Prominently displayed below OAuth buttons
    *   **Style:** Clear, reassuring typography with lock icon
*   **Data Flow Explanation:**
    *   **Text:** "✓ Personalized experience ✓ Zero data storage ✓ Your identity stays with trusted providers"
    *   **Placement:** Supporting text with check mark icons

### 4.4. Guest Access Option

*   **Guest Mode Link:**
    *   **Text:** "Continue as Guest"
    *   **Placement:** Below OAuth buttons, less prominent
    *   **Functionality:** Limited reporting features without authentication
    *   **Style:** Secondary button or text link style

### 4.5. Legal & Compliance Links

*   **Privacy Policy Link:**
    *   **Text:** "Privacy Policy"
    *   **Placement:** Footer area
    *   **Action:** Opens privacy policy in new tab
*   **Terms of Service Link:**
    *   **Text:** "Terms of Service"
    *   **Placement:** Footer area
    *   **Action:** Opens terms in new tab

## 5. Layout Examples

### 5.1. Desktop Layout (1200px+)
```
                    [UrbanAI Logo]
                    
               Welcome to UrbanAI
          Municipal Issue Reporting Platform

    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │           Choose Your Login Method              │
    │                                                 │
    │     [🏢 Continue with Microsoft]                │
    │     [🔵 Continue with Google]                   │
    │     [🟦 Continue with Facebook]                 │
    │                                                 │
    │  ────────────── Why This Way? ──────────────    │
    │                                                 │
    │  ✓ Maximum Privacy - No personal data stored    │
    │  ✓ Secure Authentication - Your trusted account │
    │  ✓ Personalized Experience - Data stays local   │
    │                                                 │
    │                [Continue as Guest]             │
    │              (Limited features)                 │
    └─────────────────────────────────────────────────┘

     🔒 Privacy Guarantee: Only anonymous case links stored
        Your identity never leaves your chosen provider

              [Privacy Policy] | [Terms of Service]
```

### 5.2. Mobile Layout (375px)
```
    [UrbanAI Logo]
    
  Welcome to UrbanAI
  
 ┌─────────────────┐
 │  Choose Login:  │
 │                 │
 │ [🏢 Microsoft]  │
 │ [🔵 Google   ]  │
 │ [🟦 Facebook ]  │
 │                 │
 │ ──── Why? ────  │
 │                 │
 │ ✓ Max Privacy   │
 │ ✓ Secure        │
 │ ✓ Personal      │
 │                 │
 │ [Guest Mode]    │
 └─────────────────┘
 
 🔒 Anonymous ID only
 
 [Privacy] [Terms]
```

## 6. Accessibility

*   **Keyboard Navigation:** All OAuth buttons and links must be navigable using the Tab key
*   **Focus States:** Clear visual focus indicators for all interactive elements
*   **ARIA Attributes:** Implement `aria-label` and `aria-describedby` for OAuth buttons and privacy notices
*   **Color Contrast:** Ensure a minimum contrast ratio of 4.5:1 for all text and interactive elements
*   **Screen Reader Support:** Proper semantic HTML with clear button descriptions

## 7. OAuth Integration Technical Requirements

### 7.1. OAuth Scopes
*   **Microsoft:** `openid profile email` (minimal required scopes)
*   **Google:** `openid profile email` (minimal required scopes)
*   **Facebook:** `email public_profile` (minimal required scopes)

### 7.2. Security Measures
*   **State Parameter:** CSRF protection for OAuth flows
*   **PKCE:** Code verification for enhanced security
*   **Redirect URI Validation:** Strict whitelist of allowed redirect URIs
*   **JWT Validation:** Proper signature and claim verification

### 7.3. Error Handling
*   **OAuth Errors:** Clear user-friendly messages for authentication failures
*   **Network Issues:** Retry mechanisms and offline messaging
*   **Provider Unavailable:** Alternative provider suggestions

## 8. Privacy Implementation Details

### 8.1. Data Flow
```
1. User clicks OAuth provider button
2. Redirect to provider with minimal scopes
3. Provider authenticates user
4. Provider returns JWT with claims
5. Client extracts name/email for UI (never sent to server)
6. Client sends only OAuth 'sub' (GUID) to UrbanAI server
7. Server stores GUID + role, returns session token
8. Client displays personalized UI using OAuth claims
```

### 8.2. Client-Side Personalization
```javascript
// OAuth claims used client-side only
const userDisplay = {
  name: jwtClaims.name,           // "John Doe" - shown in UI
  email: jwtClaims.email,         // For notifications
  picture: jwtClaims.picture,     // Profile avatar
  // Only this sent to server:
  anonymousId: jwtClaims.sub      // "oauth-guid-123"
};
```

## 9. Figma Implementation Guidance

*   **Component Creation:** Build reusable OAuth button components with proper branding
*   **Privacy Messaging:** Design clear, trustworthy privacy notices with appropriate iconography
*   **Responsive Design:** Create layouts for desktop, tablet, and mobile breakpoints
*   **Error States:** Design clear error messaging for OAuth failures
*   **Loading States:** OAuth redirect loading indicators
*   **Accessibility:** Ensure all designs meet WCAG 2.1 AA standards

## 10. Testing & Validation

*   **OAuth Flow Testing:** Verify all three provider authentication flows
*   **Privacy Validation:** Confirm no PII transmitted to UrbanAI servers
*   **Accessibility Testing:** Screen reader and keyboard navigation validation
*   **Responsive Testing:** Cross-device and cross-browser compatibility
*   **Error Scenario Testing:** OAuth failures, network issues, provider downtime

This OAuth-only login design provides maximum privacy protection while maintaining excellent user experience and full compliance with GDPR and municipal security requirements.