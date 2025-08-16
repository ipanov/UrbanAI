# Facebook OAuth Setup for UrbanAI

## Step 1: Access Facebook Developers

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Sign in with your Facebook account
3. Click "My Apps" in the top navigation

## Step 2: Create New App

1. Click "Create App"
2. Select "Consumer" (for public-facing app)
3. Fill out the form:
   - **App name**: `UrbanAI`
   - **App contact email**: Your email
   - **Business account**: (optional, select if you have one)
4. Click "Create App"

## Step 3: Add Facebook Login Product

1. In your app dashboard, find "Facebook Login"
2. Click "Set up" under Facebook Login
3. Select "Web" as the platform
4. Enter your site URL: `http://localhost:5173` (for development)
5. Click "Save" and "Continue"

## Step 4: Configure Facebook Login Settings

1. In the left sidebar, go to "Facebook Login" → "Settings"
2. Configure the following:

### Valid OAuth Redirect URIs:
```
http://localhost:5173/auth/callback
http://localhost:3000/auth/callback
https://urbanai.app/auth/callback
https://staging.urbanai.app/auth/callback
```

### Client OAuth Settings:
- ✅ **Use Strict Mode for Redirect URIs**: Enabled
- ✅ **Enforce HTTPS**: Enabled (for production URIs)
- ⚠️ **Embedded Browser OAuth Login**: Disabled (security best practice)

3. Click "Save Changes"

## Step 5: Configure App Settings

1. Go to "Settings" → "Basic"
2. Fill out required information:
   - **App Display Name**: `UrbanAI`
   - **App Contact Email**: Your email
   - **Privacy Policy URL**: `https://urbanai.app/privacy`
   - **Terms of Service URL**: `https://urbanai.app/terms`
   - **App Icon**: Upload UrbanAI logo (1024x1024px)

3. **App Domains**: Add your domains:
   - `urbanai.app`
   - `localhost` (for development)

4. Click "Save Changes"

## Step 6: Get App Credentials

From "Settings" → "Basic":
- **App ID**: `1234567890123456`
- **App Secret**: Click "Show" to reveal (treat as sensitive)

## Step 7: Configure UrbanAI

### Development (appsettings.Development.json)
```json
{
  "OAuth": {
    "Facebook": {
      "AppId": "1234567890123456",
      "AppSecret": "your-facebook-app-secret",
      "ApiVersion": "v18.0"
    }
  }
}
```

### Production (Environment Variables)
```bash
OAUTH__FACEBOOK__APPID=1234567890123456
OAUTH__FACEBOOK__APPSECRET=your-facebook-app-secret
OAUTH__FACEBOOK__APIVERSION=v18.0
```

## Step 8: OAuth Endpoints

Facebook OAuth 2.0 endpoints:
- **Authorization**: `https://www.facebook.com/v18.0/dialog/oauth`
- **Token**: `https://graph.facebook.com/v18.0/oauth/access_token`
- **UserInfo**: `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture`

## Step 9: App Review Process

### For Development:
- App works immediately with test users
- Add test users in "Roles" → "Test Users"

### For Production:
1. **App Review Required** for public access
2. Submit for review with:
   - Detailed use case description
   - Privacy policy and terms of service
   - App icon and screenshots
   - Test user credentials for Facebook review team

3. **Required Permissions** (submit for review):
   - `email` (requires justification)
   - `public_profile` (usually auto-approved)

## Step 10: Test Configuration

### Manual Test Flow:
1. Build authorization URL:
```
https://www.facebook.com/v18.0/dialog/oauth?
client_id=YOUR_APP_ID&
redirect_uri=http://localhost:5173/auth/callback&
scope=email,public_profile&
state=random-state-value&
response_type=code
```

2. Test with Facebook test user or your own account
3. Verify callback receives authorization code
4. Exchange code for access token
5. Fetch user profile from Graph API

## Security Notes

### Critical Security Practices:
- **Never commit App Secret to source control**
- Use environment variables or Azure Key Vault for production
- Regularly rotate App Secret (recommended: every 90 days)
- Monitor app usage in Facebook Analytics
- Set up webhook endpoints for security notifications

### PKCE for Facebook:
While Facebook doesn't require PKCE, implement it for consistency:
```javascript
// Optional but recommended for security
const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
// Facebook doesn't use code_challenge, but store verifier for consistency
```

## Troubleshooting

### Common Issues:
1. **"redirect_uri_mismatch"**: Redirect URI not in configured list
2. **"invalid_client_id"**: App ID incorrect or app not found
3. **"access_denied"**: User declined permissions or app not approved
4. **"invalid_scope"**: Requesting permissions not granted to app

### App Review Issues:
1. **"Insufficient use case"**: Provide detailed explanation of why you need email permission
2. **"Missing privacy policy"**: Ensure privacy policy URL is accessible and comprehensive
3. **"Invalid test user"**: Provide working test credentials for Facebook review team

### Testing Checklist:
- [ ] Authorization URL redirects to Facebook login
- [ ] Test users can complete login flow
- [ ] Callback receives authorization code
- [ ] Token exchange returns valid access token
- [ ] Graph API returns user profile with required fields
- [ ] Error handling works for declined permissions
- [ ] App review submitted (for production email access)

## Production Deployment Notes

### Before Going Live:
1. Complete Facebook App Review process
2. Update app status from "Development" to "Live"
3. Configure production redirect URIs
4. Set up monitoring and alerting
5. Test with real user accounts (not test users)

### Monitoring:
- Track OAuth conversion rates in Facebook Analytics
- Monitor API rate limits and usage
- Set up alerts for authentication failures
- Regular security audits of app permissions
