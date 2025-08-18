# Microsoft OAuth Authentication Fix

## Problem
Microsoft Azure AD is rejecting the OAuth authentication with error:
```
AADSTS7000215: Invalid client secret provided. Ensure the secret being sent in the request is the client secret value, not the client secret ID
```

## Root Cause
The current client secret `KAO8Q~jJWGo0lXu4MwkRP1PJ6j8XBDLaO1hR8c7i` appears to be a **client secret ID** rather than the actual **client secret value**.

In Microsoft Azure AD:
- **Secret ID** (always visible): `KAO8Q~jJWGo0lXu4MwkRP1PJ6j8XBDLaO1hR8c7i` ← Current value
- **Secret Value** (shown only once): Usually much longer, like `8Q~3VG1lk7P~c4K8yF2wX9mN6bH5sA1dE7tR0uI3oL8vC2nM9qW6pS4jK7fG0yT5`

## Solution Steps

### Option 1: Generate New Client Secret (Recommended)
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Find your app with ID `d95df6d5-b009-4867-9f08-4042cd7f0870`
4. Go to **Certificates & secrets** → **Client secrets**
5. Click **New client secret**
6. Add description: "UrbanAI OAuth Secret"
7. Set expiration (recommend 24 months)
8. **IMPORTANT**: Copy the **Value** field immediately (it won't be shown again)
9. Update both configuration files with the new secret **value**

### Option 2: Check Existing Secrets
If you have the original secret value saved:
1. Use that value instead of the Secret ID
2. Update the configuration files

## Files to Update
After getting the correct secret value, update these files:

1. **src/UrbanAI.API/appsettings.json**:
```json
"Microsoft": {
  "ClientId": "d95df6d5-b009-4867-9f08-4042cd7f0870",
  "ClientSecret": "[NEW_SECRET_VALUE_HERE]"
}
```

2. **src/UrbanAI.API/.env.local**:
```
MICROSOFT_CLIENT_SECRET=[NEW_SECRET_VALUE_HERE]
```

## Testing
After updating the configuration:
1. Restart the API application
2. Test the Microsoft OAuth flow from the frontend
3. Verify the authentication completes successfully

## Current Configuration
- **Client ID**: `d95df6d5-b009-4867-9f08-4042cd7f0870` (correct)
- **Client Secret**: `KAO8Q~jJWGo0lXu4MwkRP1PJ6j8XBDLaO1hR8c7i` (needs to be replaced with actual secret value)
- **Redirect URI**: `http://localhost:3000/auth/callback` (correct)

## Security Note
- Never commit actual client secrets to source control
- Use environment variables or secure configuration management
- Rotate secrets regularly (every 6-24 months)
