# Google OAuth Setup for UrbanAI

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Project name: `UrbanAI`
4. Organization: (your organization or leave blank)
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" 
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (for public app) or "Internal" (for organization only)
3. Fill out the required fields:
   - **App name**: `UrbanAI`
   - **User support email**: Your email
   - **App logo**: Upload UrbanAI logo (optional)
   - **App domain**: `https://urbanai.app` (or your domain)
   - **Authorized domains**: 
     - `urbanai.app`
     - `localhost` (for development)
   - **Developer contact information**: Your email

4. **Scopes**: Add the following scopes:
   - `openid`
   - `profile` 
   - `email`

5. **Test users** (if External): Add your email and any test accounts

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: `UrbanAI Web Client`
5. **Authorized JavaScript origins**:
   - `http://localhost:5173` (Vite dev server)
   - `http://localhost:3000` (alternative dev port)
   - `https://urbanai.app` (production)
   - `https://staging.urbanai.app` (staging)

6. **Authorized redirect URIs**:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:3000/auth/callback`
   - `https://urbanai.app/auth/callback`
   - `https://staging.urbanai.app/auth/callback`

7. Click "Create"

## Step 5: Save Credentials

You'll receive:
- **Client ID**: `your-google-client-id.apps.googleusercontent.com`
- **Client Secret**: `your-google-client-secret`

Add these to your configuration:

### Development (appsettings.Development.json)
```json
{
  "OAuth": {
    "Google": {
      "ClientId": "your-google-client-id.apps.googleusercontent.com",
      "ClientSecret": "your-google-client-secret"
    }
  }
}
```

### Production (Environment Variables)
```bash
OAUTH__GOOGLE__CLIENTID=your-google-client-id.apps.googleusercontent.com
OAUTH__GOOGLE__CLIENTSECRET=your-google-client-secret
```

## Step 6: Test Configuration

Use Google's OAuth 2.0 Playground to test:
1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click gear icon → "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. Test the flow with scopes: `openid profile email`

## Security Notes

- **Never commit Client Secret to source control**
- Use environment variables or Azure Key Vault for production
- Regularly rotate Client Secret (recommended: every 90 days)
- Monitor OAuth usage in Google Cloud Console
- Set up alerts for unusual authentication patterns

## Troubleshooting

### Common Issues:
1. **"redirect_uri_mismatch"**: Ensure redirect URI exactly matches configured URIs
2. **"invalid_client"**: Check Client ID and Secret are correct
3. **"access_denied"**: User declined consent or app not approved
4. **"invalid_scope"**: Verify scopes are properly configured in consent screen

### Testing Checklist:
- [ ] OAuth consent screen displays correctly
- [ ] All redirect URIs work in different environments
- [ ] Scopes return expected user information
- [ ] Error handling works for declined consent
- [ ] Token refresh works properly (if implemented)
