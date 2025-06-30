# UrbanAI Android App Login Screen Design Specification

This document specifies the detailed design requirements for the UrbanAI Android Application's OAuth-only Login Screen, integrating maximum privacy protection, Material Design principles, and GDPR compliance.

## 1. Overview

The Android Login Screen provides a secure and privacy-focused entry point using **OAuth-only authentication** (Microsoft, Google, Facebook). The design prioritizes **maximum privacy protection** where only anonymous OAuth GUIDs are stored server-side while user personalization happens client-side through OAuth claims.

## 2. Privacy-First Architecture

*   **Server Storage**: Only OAuth `sub` (GUID) + role/preferences - **zero PII**
*   **Client Personalization**: Names, emails, avatars from OAuth claims (never transmitted to server)
*   **No Form Inputs**: No email/password fields - OAuth providers handle all credential management
*   **Material Design**: Adherent to Android Material Design guidelines with privacy-first approach

## 3. Layout & Structure

*   **Layout:** Single-column, vertically stacked OAuth provider buttons with clear privacy messaging
*   **Responsiveness:** Adapts to various Android device screen sizes and orientations
*   **Material Design:** Uses Material Design components and elevation principles
*   **Visual Hierarchy:** Clear distinction between OAuth providers and privacy guarantees

## 4. Key Elements & Details

### 4.1. Branding

*   **Logo:** Prominently display the UrbanAI logo at the top of the screen
*   **Color Palette:** Adhere to Material Design color system with UrbanAI brand colors
*   **Typography:** Use Roboto font family as per Material Design guidelines
*   **Elevation:** Appropriate shadow and elevation for Material Design authenticity

### 4.2. OAuth Provider Buttons (Material Design)

*   **Microsoft OAuth Button:**
    *   **Text:** "Continue with Microsoft"
    *   **Style:** Material Design elevated button, Microsoft brand color (#0078D4)
    *   **Height:** 56dp (Material Design button standard)
    *   **Icon:** Microsoft logo, 24dp, positioned left of text
    *   **Elevation:** 2dp with 4dp on press
    *   **Target:** Microsoft OAuth endpoint via Android Intent

*   **Google OAuth Button:**
    *   **Text:** "Continue with Google"
    *   **Style:** Material Design elevated button, Google brand color (#4285F4)
    *   **Height:** 56dp (Material Design button standard)
    *   **Icon:** Google logo, 24dp, positioned left of text
    *   **Elevation:** 2dp with 4dp on press
    *   **Target:** Google OAuth endpoint via Android Intent

*   **Facebook OAuth Button:**
    *   **Text:** "Continue with Facebook"
    *   **Style:** Material Design elevated button, Facebook brand color (#1877F2)
    *   **Height:** 56dp (Material Design button standard)
    *   **Icon:** Facebook logo, 24dp, positioned left of text
    *   **Elevation:** 2dp with 4dp on press
    *   **Target:** Facebook OAuth endpoint via Android Intent

### 4.3. Privacy Messaging (Material Design)

*   **Main Privacy Card:**
    *   **Component:** Material Design Card with 8dp corner radius
    *   **Elevation:** 1dp
    *   **Content:** "Maximum Privacy: Only anonymous case links stored. Your identity stays with trusted providers."
    *   **Icon:** Lock icon (24dp) using Material Design icons
    *   **Typography:** Material Design body1 text style

*   **Benefits List:**
    *   **Component:** Material Design list with check mark icons
    *   **Items:** 
        - "✓ Personalized experience"
        - "✓ Zero data storage"
        - "✓ Your identity protected"
    *   **Typography:** Material Design body2 text style

### 4.4. Guest Access Option

*   **Guest Mode Button:**
    *   **Text:** "Continue as Guest"
    *   **Style:** Material Design text button (no elevation)
    *   **Placement:** Below OAuth buttons with reduced emphasis
    *   **Functionality:** Limited reporting features without authentication
    *   **Color:** Secondary color per Material Design guidelines

### 4.5. Navigation & Footer

*   **Minimal Navigation:** Clean Material Design app bar with UrbanAI branding
*   **Footer Links:** Privacy Policy and Terms of Service using Material Design text buttons
*   **Spacing:** 16dp margins and 8dp padding per Material Design spacing guidelines

## 5. Material Design Layout Examples

### 5.1. Portrait Layout (360dp x 640dp)
```
┌─────────────────────────────────────────┐
│ UrbanAI                               ≡ │ ← Material App Bar
├─────────────────────────────────────────┤
│                                         │
│          [UrbanAI Logo]                 │
│                                         │
│        Welcome to UrbanAI               │
│     Municipal Issue Reporting           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │         Choose Login Method         │ │ ← Material Card
│ │                                     │ │
│ │  [📊 Continue with Microsoft]       │ │ ← Material Buttons
│ │  [🔵 Continue with Google]          │ │   56dp height
│ │  [🟦 Continue with Facebook]        │ │   2dp elevation
│ │                                     │ │
│ │  ──────── Why This Way? ────────    │ │
│ │                                     │ │
│ │  ✓ Maximum Privacy                  │ │
│ │  ✓ Secure Authentication            │ │
│ │  ✓ Personalized Experience          │ │
│ │                                     │ │
│ │         [Continue as Guest]         │ │ ← Material Text Button
│ │         (Limited features)          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🔒 Privacy Guarantee                │ │ ← Material Card
│ │ Only anonymous case links stored.   │ │   1dp elevation
│ │ Your identity stays protected.      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│     [Privacy Policy] [Terms]            │ ← Material Text Buttons
└─────────────────────────────────────────┘
```

### 5.2. Landscape Layout (640dp x 360dp)
```
┌───────────────────────────────────────────────────────────────┐
│ UrbanAI                                                     ≡ │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  [Logo]    Welcome to UrbanAI                                │
│                                                               │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐ │
│  │      Choose Login           │  │   Privacy Guarantee     │ │
│  │                             │  │                         │ │
│  │  [📊 Continue with MS]      │  │  🔒 Maximum Privacy     │ │
│  │  [🔵 Continue with Google]  │  │                         │ │
│  │  [🟦 Continue with FB]      │  │  ✓ Anonymous ID only    │ │
│  │                             │  │  ✓ Identity protected   │ │
│  │  [Continue as Guest]        │  │  ✓ Data stays local     │ │
│  └─────────────────────────────┘  └─────────────────────────┘ │
│                                                               │
│               [Privacy Policy] [Terms]                       │
└───────────────────────────────────────────────────────────────┘
```

## 6. Accessibility (Android)

*   **TalkBack Support:** All OAuth buttons and privacy notices properly labeled for screen readers
*   **Content Descriptions:** Descriptive `android:contentDescription` for all icons and images
*   **Keyboard Navigation:** All interactive elements reachable via hardware keyboard or accessibility services
*   **Focus States:** Material Design focus indicators with proper contrast
*   **Color Contrast:** Minimum 4.5:1 contrast ratio following Material Design accessibility guidelines
*   **Touch Targets:** Minimum 48dp touch target size for all interactive elements
*   **Semantic Elements:** Proper Android UI components (`Button`, `TextView`, `CardView`)

## 7. Mobile-Specific Considerations

*   **OAuth Integration:** Use Android's `CustomTabs` for secure OAuth flows
*   **Deep Links:** Handle OAuth redirect URIs via Android App Links
*   **Biometric Authentication:** Optional biometric unlock for returning users (store OAuth tokens securely)
*   **Orientation Changes:** Graceful layout adaptation between portrait and landscape
*   **Material Motion:** Appropriate Material Design animations and transitions
*   **Dark Theme:** Support for Android's system-wide dark theme

## 8. Technical Implementation (Android)

### 8.1. OAuth Integration
```kotlin
// OAuth provider button click handlers
class LoginActivity : AppCompatActivity() {
    
    private fun launchMicrosoftOAuth() {
        val authIntent = CustomTabsIntent.Builder()
            .setShowTitle(true)
            .setColorScheme(CustomTabsIntent.COLOR_SCHEME_SYSTEM)
            .build()
        
        val authUrl = buildMicrosoftOAuthUrl()
        authIntent.launchUrl(this, Uri.parse(authUrl))
    }
    
    private fun buildMicrosoftOAuthUrl(): String {
        return "https://login.microsoftonline.com/common/oauth2/v2.0/authorize" +
            "?client_id=${BuildConfig.MICROSOFT_CLIENT_ID}" +
            "&response_type=code" +
            "&redirect_uri=${BuildConfig.OAUTH_REDIRECT_URI}" +
            "&scope=openid profile email" +
            "&state=${generateSecureState()}" +
            "&code_challenge=${generatePKCEChallenge()}"
    }
}
```

### 8.2. Privacy-First Data Handling
```kotlin
// Only store OAuth GUID, never PII
data class UserSession(
    val anonymousId: String,  // OAuth 'sub' claim only
    val role: UserRole,       // Citizen/Investor/Authority
    val preferences: UserPreferences
)

// Client-side personalization from OAuth claims
data class UserDisplay(
    val name: String,         // From OAuth claims - never sent to server
    val email: String,        // From OAuth claims - never sent to server
    val picture: String?      // From OAuth claims - never sent to server
)
```

### 8.3. Material Design Components
```xml
<!-- OAuth Provider Button -->
<com.google.android.material.button.MaterialButton
    android:id="@+id/btnMicrosoftOAuth"
    android:layout_width="match_parent"
    android:layout_height="56dp"
    android:text="Continue with Microsoft"
    android:textColor="@android:color/white"
    app:backgroundTint="#0078D4"
    app:elevation="2dp"
    app:cornerRadius="4dp"
    app:icon="@drawable/ic_microsoft"
    app:iconGravity="textStart"
    app:iconSize="24dp" />

<!-- Privacy Notice Card -->
<com.google.android.material.card.MaterialCardView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:cardCornerRadius="8dp"
    app:cardElevation="1dp"
    app:cardUseCompatPadding="true">
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">
        
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="🔒 Privacy Guarantee"
            android:textAppearance="?attr/textAppearanceSubtitle1" />
            
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Only anonymous case links stored. Your identity stays protected."
            android:textAppearance="?attr/textAppearanceBody2" />
            
    </LinearLayout>
</com.google.android.material.card.MaterialCardView>
```

## 9. Error Handling & User Feedback

*   **OAuth Errors:** Material Design Snackbar with clear messaging and retry actions
*   **Network Issues:** Material Design progress indicators with offline messaging
*   **Provider Unavailable:** Material Design dialogs suggesting alternative providers
*   **Loading States:** Material Design circular progress indicators during OAuth flows

### 9.1. Error Message Examples
```kotlin
// Material Design error handling
fun showOAuthError(provider: String) {
    Snackbar.make(
        binding.root,
        "$provider authentication failed. Please try again.",
        Snackbar.LENGTH_LONG
    ).setAction("Retry") {
        when(provider) {
            "Microsoft" -> launchMicrosoftOAuth()
            "Google" -> launchGoogleOAuth()
            "Facebook" -> launchFacebookOAuth()
        }
    }.show()
}
```

## 10. Figma Implementation Guidance

*   **Material Design System:** Use Material Design components from Figma Material Design kit
*   **OAuth Buttons:** Create Material Design elevated button components with proper branding
*   **Privacy Cards:** Design Material Design card components with appropriate elevation
*   **Icons:** Use Material Design icon set with proper sizing (24dp for buttons)
*   **Typography:** Implement Material Design type scale (Roboto font family)
*   **Color System:** Follow Material Design color guidance with UrbanAI brand integration
*   **Responsive Layouts:** Create layouts for different Android screen sizes and orientations
*   **Dark Theme:** Design both light and dark theme variants

## 11. Testing & Validation

*   **OAuth Flow Testing:** Verify all three provider authentication flows on real devices
*   **Privacy Validation:** Confirm no PII transmitted to UrbanAI servers
*   **Accessibility Testing:** TalkBack and keyboard navigation validation
*   **Material Design Compliance:** Verify adherence to Material Design guidelines
*   **Device Testing:** Cross-device testing on various Android versions and screen sizes
*   **Deep Link Testing:** Verify OAuth redirect handling via App Links

This Android login screen design provides maximum privacy protection while maintaining excellent user experience, Material Design compliance, and full GDPR adherence for municipal and citizen use.