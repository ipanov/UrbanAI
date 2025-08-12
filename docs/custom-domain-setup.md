# Custom Domain Setup Guide for UrbanAI

## Overview
This guide explains how to configure your custom domain `urbanai.site` purchased from GoDaddy to work with your Azure App Service for UrbanAI production environment.

## Domain Configuration
- **Root Domain**: `urbanai.site` (will redirect to API)
- **API Endpoint**: `api.urbanai.site` (main API endpoint)
- **Staging**: Uses default Azure URL (`urbanai-api-staging-{token}.azurewebsites.net`)

## Prerequisites
1. Domain `urbanai.site` purchased from GoDaddy
2. Access to GoDaddy DNS management
3. Azure App Service deployed and running
4. Azure CLI or Azure Portal access

## Step-by-Step Setup

### 1. Deploy Infrastructure with Custom Domain Support
The Bicep template is already configured to support custom domains. Deploy with:

```powershell
azd up
```

### 2. Verify Domain Ownership in Azure
Before adding custom domains, Azure needs to verify you own the domain:

1. Go to Azure Portal → App Services → Your Production App Service
2. Navigate to "Custom domains" in the left menu
3. Click "Add custom domain"
4. Enter `urbanai.site` and follow the verification steps

### 3. Configure DNS Records in GoDaddy
Login to your GoDaddy account and configure the following DNS records:

#### For Root Domain (urbanai.site):
```
Type: CNAME
Name: @
Value: urbanai-api-production-{resourceToken}.azurewebsites.net
TTL: 1 Hour
```

#### For API Subdomain (api.urbanai.site):
```
Type: CNAME
Name: api
Value: urbanai-api-production-{resourceToken}.azurewebsites.net
TTL: 1 Hour
```

#### Domain Verification Record (Temporary):
```
Type: TXT
Name: asuid.urbanai.site
Value: [Verification code from Azure]
TTL: 1 Hour
```

**Note**: Replace `{resourceToken}` with the actual token from your deployment output.

### 4. Add Custom Domains in Azure

#### Option A: Using Azure Portal
1. Go to App Services → Production App Service → Custom domains
2. Click "Add custom domain"
3. Enter `urbanai.site` → Validate → Add custom domain
4. Repeat for `api.urbanai.site`

#### Option B: Using Azure CLI
```bash
# Get the production app service name from deployment outputs
PROD_APP_NAME=$(azd env get-values --output json | jq -r .PRODUCTION_APP_SERVICE_NAME)
RESOURCE_GROUP=$(azd env get-values --output json | jq -r .AZURE_RESOURCE_GROUP_NAME)

# Add custom domains
az webapp config hostname add --webapp-name $PROD_APP_NAME --resource-group $RESOURCE_GROUP --hostname urbanai.site
az webapp config hostname add --webapp-name $PROD_APP_NAME --resource-group $RESOURCE_GROUP --hostname api.urbanai.site
```

### 5. Configure SSL Certificates

#### Option A: Azure Managed Certificates (Recommended - Free)
1. In Azure Portal → App Service → TLS/SSL settings
2. Click "Private Key Certificates (.pfx)" → "Create App Service Managed Certificate"
3. Select your custom domains
4. Click "Create"
5. Go to "Bindings" tab
6. Add TLS binding for each domain with the managed certificate

#### Option B: Using Azure CLI
```bash
# Create managed certificates
az webapp config ssl create --name $PROD_APP_NAME --resource-group $RESOURCE_GROUP --hostname urbanai.site
az webapp config ssl create --name $PROD_APP_NAME --resource-group $RESOURCE_GROUP --hostname api.urbanai.site

# Bind certificates
az webapp config ssl bind --name $PROD_APP_NAME --resource-group $RESOURCE_GROUP --certificate-thumbprint [THUMBPRINT] --ssl-type SNI --hostname urbanai.site
az webapp config ssl bind --name $PROD_APP_NAME --resource-group $RESOURCE_GROUP --certificate-thumbprint [THUMBPRINT] --ssl-type SNI --hostname api.urbanai.site
```

### 6. Test Domain Configuration

After DNS propagation (can take 24-48 hours), test your domains:

```bash
# Test root domain
curl -I https://urbanai.site

# Test API endpoint
curl -I https://api.urbanai.site

# Test API functionality
curl https://api.urbanai.site/health
```

### 7. Update Application URLs

Update your application configuration to use the custom domain:

1. Frontend applications should use `https://api.urbanai.site`
2. Update CORS settings if needed
3. Update any hardcoded URLs in your application

## DNS Propagation Timeline
- **Initial Setup**: 1-2 hours for basic DNS resolution
- **Global Propagation**: 24-48 hours for worldwide availability
- **SSL Certificate**: 15-30 minutes after domain verification

## Troubleshooting

### Common Issues:

1. **Domain verification fails**:
   - Ensure TXT record is correctly added to GoDaddy
   - Wait for DNS propagation (use `nslookup` to verify)

2. **SSL certificate creation fails**:
   - Verify domain is properly added and verified
   - Check domain ownership validation

3. **Site not accessible via custom domain**:
   - Verify CNAME records point to correct Azure URL
   - Check DNS propagation status
   - Ensure SSL binding is configured

### Verification Commands:
```bash
# Check DNS propagation
nslookup urbanai.site
nslookup api.urbanai.site

# Check SSL certificate
openssl s_client -connect urbanai.site:443 -servername urbanai.site

# Test HTTP redirects
curl -L -I http://urbanai.site
```

## Security Considerations
1. **HTTPS Only**: Ensure HTTPS redirect is enabled in App Service
2. **HSTS Headers**: Consider enabling HTTP Strict Transport Security
3. **Certificate Auto-Renewal**: Azure managed certificates auto-renew
4. **Domain Locking**: Consider enabling domain lock in GoDaddy

## Cost Impact
- **Custom Domain**: Free with Azure App Service
- **SSL Certificate**: Free with Azure Managed Certificates
- **DNS Queries**: Minimal cost through GoDaddy

## Next Steps After Setup
1. Update CI/CD pipelines to use production domain
2. Configure monitoring for custom domain endpoints
3. Set up domain redirect from root to API if needed
4. Update documentation and API references

## Support
If you encounter issues:
1. Check Azure Portal → App Service → Custom domains for error messages
2. Verify DNS settings in GoDaddy DNS management
3. Use Azure Support if certificate issues persist
