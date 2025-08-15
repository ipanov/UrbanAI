# Microsoft OAuth Setup for UrbanAI

## Step 1: Access Azure Portal

1. Go to [Azure Portal](https://portal.azure.com/)
2. Sign in with your Microsoft account
3. Navigate to "Azure Active Directory" (or "Microsoft Entra ID")

## Step 2: Register Application

1. In Azure AD, go to "App registrations"
2. Click "New registration"
3. Fill out the form:
   - **Name**: `UrbanAI`
   - **Supported account types**: "Accounts in any organizational directory and personal Microsoft accounts"
   - **Redirect URI**: 
     - Platform: "Web"
     - URI: `http://localhost:5173/auth/callback` (add others later)
4. Click "Register"

## Step 3: Configure Additional Redirect URIs

1. In your app registration, go to "Authentication"
2. Under "Web" → "Redirect URIs", add:
   - `http://localhost:3000/auth/callback`
   - `https://urbanai.app/auth/callback`
   - `https://staging.urbanai.app/auth/callback`

3. Under "Advanced settings":
   - ✅ Enable "Access tokens (used for implicit flows)"
   - ✅ Enable "ID tokens (used for implicit and hybrid flows)"

4. Click "Save"

## Step 4: Configure API Permissions

1. Go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Choose "Delegated permissions"
5. Add these permissions:
   - `openid`
   - `profile`
   - `email`
   - `User.Read`

6. Click "Add permissions"
7. Click "Grant admin consent" (if you have admin rights)

## Step 5: Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Description: `UrbanAI Production Secret`
4. Expires: "24 months" (recommended)
5. Click "Add"
6. **IMPORTANT**: Copy the secret value immediately (it won't be shown again)

## Step 6: Get Application Details

From the "Overview" page, note:
- **Application (client) ID**: `12345678-1234-1234-1234-123456789012`
- **Directory (tenant) ID**: `87654321-4321-4321-4321-210987654321`
- **Client Secret**: (from step 5)

## Step 7: Configure UrbanAI

### Development (appsettings.Development.json)
```json
{
  "OAuth": {
    "Microsoft": {
      "ClientId": "12345678-1234-1234-1234-123456789012",
      "ClientSecret": "your-client-secret-value",
      "TenantId": "common"
    }
  }
}
```

### Production (Environment Variables)
```bash
OAUTH__MICROSOFT__CLIENTID=12345678-1234-1234-1234-123456789012
OAUTH__MICROSOFT__CLIENTSECRET=your-client-secret-value
OAUTH__MICROSOFT__TENANTID=common
```

## Step 8: OAuth Endpoints

Microsoft OAuth 2.0 endpoints:
- **Authorization**: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`
- **Token**: `https://login.microsoftonline.com/common/oauth2/v2.0/token`
- **UserInfo**: `https://graph.microsoft.com/v1.0/me`

## Step 9: Test Configuration

### Manual Test:
1. Build authorization URL:
```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=YOUR_CLIENT_ID&
response_type=code&
redirect_uri=http://localhost:5173/auth/callback&
scope=openid profile email&
state=random-state-value&
code_challenge=CODE_CHALLENGE&
code_challenge_method=S256
```

2. Visit URL in browser
3. Complete Microsoft login
4. Verify redirect to your callback URL with authorization code

## Security Best Practices

### PKCE Implementation Required
Microsoft requires PKCE for public clients:
```javascript
// Generate code verifier and challenge
const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(
  await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
)));
```

### Additional Security:
- Use `state` parameter for CSRF protection
- Validate `state` in callback
- Store `code_verifier` securely during OAuth flow
- Implement proper error handling for all OAuth responses

## Troubleshooting

### Common Issues:
1. **"AADSTS50011: redirect_uri_mismatch"**: Redirect URI not configured correctly
2. **"AADSTS70001: Application not found"**: Client ID incorrect
3. **"AADSTS7000215: Invalid client secret"**: Client secret expired or incorrect
4. **"AADSTS65001: User or administrator has not consented"**: Missing admin consent for permissions

### Debugging Steps:
1. Check Application ID in Azure portal matches configuration
2. Verify redirect URIs are exactly configured (including http/https)
3. Ensure client secret hasn't expired
4. Check API permissions are granted
5. Verify tenant ID is correct ("common" for multi-tenant)

### Testing Checklist:
- [ ] Authorization URL redirects to Microsoft login
- [ ] User can complete login flow
- [ ] Callback receives authorization code
- [ ] Token exchange returns valid access token
- [ ] Graph API call returns user profile
- [ ] Error scenarios handled gracefully
