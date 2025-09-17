# Mobile User Type Selection Implementation

## Overview

This document describes the implementation of user type selection (Citizen, Investor, Authority) for the UrbanAI mobile application. The implementation follows React Native best practices and maintains consistency with the web frontend.

## Features Implemented

### 1. Mobile-Optimized UserTypeSelector Component

**Location**: `src/components/UserTypeSelector.tsx`

**Features**:
- Glass morphism design matching UrbanAI aesthetic
- Touch-optimized interactions for mobile devices
- Expandable cards with detailed descriptions
- Features and permissions display
- Loading and error states
- Responsive design for various screen sizes
- Compact variant for dashboard display

**User Types Supported**:
- **Citizen**: Report and track community issues
- **Investor**: Monitor project compliance and ROI
- **Municipal Authority**: Manage and resolve urban issues

### 2. Enhanced LoginScreen Integration

**Location**: `src/screens/LoginScreen.tsx`

**Features**:
- OAuth provider selection triggers user type selection
- Modal-based user type selection flow
- Proper state management and error handling
- Profile persistence with user type information
- Loading states during authentication

### 3. Dedicated UserTypeSelectionScreen

**Location**: `src/screens/UserTypeSelectionScreen.tsx`

**Features**:
- Standalone user type selection screen
- Navigation integration with proper back handling
- Current user type display
- Completion callbacks for custom workflows
- Integration with existing authentication state

### 4. Navigation Integration

**Location**: `App.tsx`

**Features**:
- UserTypeSelectionScreen added to navigation stack
- Proper header styling and navigation options
- Integration with existing authentication flow

### 5. TypeScript Type System

**Location**: `src/UrbanAI.Shared/types/index.ts`

**New Types Added**:
```typescript
interface UserProfile {
  // ... existing fields
  userType?: 'citizen' | 'investor' | 'authority' | null;
}

interface MobileAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  userProfile: UserProfile | null;
}

interface UserTypeSelectionParams {
  onComplete?: (userType: string) => void;
  currentUserType?: string | null;
  showBackButton?: boolean;
}
```

## User Flow

### 1. Registration Flow
1. User opens app and sees login screen
2. User selects OAuth provider (Google, Microsoft, Facebook)
3. User type selection modal appears
4. User selects their account type (Citizen, Investor, Authority)
5. OAuth authentication proceeds with selected user type
6. Profile is saved with user type information
7. User is navigated to main app

### 2. Account Type Change Flow
1. User navigates to UserTypeSelectionScreen from settings
2. Current user type is displayed
3. User selects new account type
4. Profile is updated
5. Success confirmation is shown
6. User is navigated back

## Technical Implementation Details

### State Management
- Uses React hooks for local component state
- AsyncStorage for profile persistence
- React Navigation for screen management
- Modal-based user type selection during login

### Error Handling
- Comprehensive error states in all components
- User-friendly error messages
- Graceful fallbacks for missing data
- Loading states for async operations

### Accessibility
- Touch targets sized appropriately for mobile (44pt minimum)
- Screen reader support with proper labels
- High contrast colors for readability
- Keyboard navigation support

### Performance
- Lazy loading of components
- Optimized re-renders with React.memo
- Efficient state updates
- Minimal bundle size impact

## Integration Points

### 1. Authentication System
- Integrates with existing OAuth flow
- Extends user profile with user type
- Maintains compatibility with existing auth state

### 2. Shared Constants
- Uses shared USER_TYPES constants
- Leverages shared API endpoints
- Maintains consistency with web frontend

### 3. Navigation System
- Integrates with React Navigation
- Proper back button handling
- Modal presentation for selection flow

## Testing

### Unit Tests
- Component rendering and behavior tests
- State management verification
- User interaction testing
- Error state validation

### Integration Tests
- OAuth flow integration
- Profile persistence verification
- Navigation flow testing

## Future Enhancements

### 1. API Integration
- Connect with real backend API endpoints
- Implement actual OAuth token exchange
- Add user type validation on backend

### 2. Enhanced UI/UX
- Add animations and transitions
- Implement progressive disclosure
- Add user type-specific onboarding

### 3. Advanced Features
- User type switching restrictions
- Role-based permission validation
- User type-specific dashboards

## Files Modified/Created

### New Files
- `src/components/UserTypeSelector.tsx` - Main user type selection component
- `src/screens/UserTypeSelectionScreen.tsx` - Dedicated selection screen
- `src/components/__tests__/UserTypeSelector.test.tsx` - Unit tests
- `docs/USER_TYPE_IMPLEMENTATION.md` - This documentation

### Modified Files
- `src/screens/LoginScreen.tsx` - Added user type selection to OAuth flow
- `App.tsx` - Added UserTypeSelectionScreen to navigation
- `src/UrbanAI.Shared/types/index.ts` - Added mobile-specific types

## Usage Examples

### Basic Usage in Login Screen
```typescript
const handleOAuthLogin = async (provider: string) => {
  setSelectedProvider(provider);
  setShowUserTypeSelector(true);
};

<Modal visible={showUserTypeSelector}>
  <UserTypeSelector
    selectedUserType={selectedUserType}
    onUserTypeSelect={handleUserTypeSelect}
    loading={loading}
  />
</Modal>
```

### Standalone Screen Usage
```typescript
navigation.navigate('UserTypeSelection', {
  onComplete: (userType) => {
    // Handle completion
  },
  currentUserType: currentUserProfile.userType,
  showBackButton: true
});
```

### Compact Display Usage
```typescript
<UserTypeSelector
  selectedUserType={currentUserType}
  onUserTypeSelect={handleUserTypeSelect}
  variant="compact"
/>
```

## Conclusion

The mobile user type selection implementation provides a comprehensive, user-friendly interface for selecting account types in the UrbanAI mobile application. The implementation follows React Native best practices, maintains consistency with the web frontend, and provides a solid foundation for future enhancements.