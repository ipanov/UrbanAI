# DNS Configuration for UrbanAI

This guide will help you configure your custom domain `urbanai.site` to point to your deployed UrbanAI application.

## Prerequisites

1. Azure resources deployed using `infra/azure-setup.ps1`
2. Access to GoDaddy domain management panel
3. Static Web App and Web App URLs from deployment

## Step 1: Configure Frontend DNS (Static Web App)

### 1.1 Get Static Web App Custom Domain Information

After deploying to Azure Static Web Apps, you'll receive:
- **Frontend URL**: `https://urbanai-frontend-test.1.azurestaticapps.net`
- **Custom Domain Verification Code**: (Found in Azure Portal → Static Web App → Custom Domains)

### 1.2 Add DNS Records in GoDaddy

1. Log into your GoDaddy account
2. Navigate to **Domains** → **urbanai.site** → **DNS Management**

3. Add the following DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `urbanai-frontend-test.1.azurestaticapps.net` | 1 hour |
| TXT | `asuid.www` | `[Verification Code from Azure]` | 1 hour |

4. For root domain (apex domain), add:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `Static Web App IP Address` | 1 hour |
| TXT | `asuid` | `[Verification Code from Azure]` | 1 hour |

**Note**: The Static Web App IP address can be found in the Azure Portal under your Static Web App → Custom Domains.

## Step 2: Configure API DNS (Web App)

### 2.1 Add API Subdomain

Add a CNAME record for your API:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `api` | `urbanai-api-test.azurewebsites.net` | 1 hour |

## Step 3: Enable SSL Certificates

### 3.1 For Static Web App

Azure Static Web Apps automatically provides SSL certificates for custom domains. After adding the DNS records:

1. Go to Azure Portal → Static Web App → Custom Domains
2. Click "Add" and enter your domain (`www.urbanai.site`)
3. Azure will automatically validate and issue SSL certificate

### 3.2 For Web App (API)

1. Go to Azure Portal → Web App → TLS/SSL settings
2. Click "Private Key Certificates (.pfx)"
3. Click "Create App Service Managed Certificate"
4. Select your custom domain (`api.urbanai.site`)
5. Click "Create"

## Step 4: Update Application Configuration

### 4.1 Update Frontend Environment Variables

In your frontend code, update the API base URL:

```typescript
// src/UrbanAI.Frontend/src/config/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.urbanai.site' 
  : 'http://localhost:5000';
```

### 4.2 Update Backend Configuration

In Azure Web App → Configuration → Application Settings, add:

| Name | Value |
|------|-------|
| `FrontendBaseUrl` | `https://www.urbanai.site` |
| `ApiBaseUrl` | `https://api.urbanai.site` |
| `AllowedHosts` | `www.urbanai.site,api.urbanai.site,localhost` |

## Step 5: Verify Configuration

### 5.1 Test DNS Resolution

```bash
# Test frontend
nslookup www.urbanai.site
curl -I https://www.urbanai.site

# Test API
nslookup api.urbanai.site
curl -I https://api.urbanai.site/health
```

### 5.2 Check SSL Certificates

Visit:
- https://www.urbanai.site (should show valid SSL)
- https://api.urbanai.site/swagger (should show valid SSL)

## Troubleshooting

### Common Issues

1. **DNS Not Propagating**
   - Wait 5-30 minutes for DNS changes to propagate
   - Use `dig` or online tools to check DNS records

2. **SSL Certificate Issues**
   - Ensure DNS records are correct before requesting certificates
   - Check Azure validation status in Custom Domains section

3. **Mixed Content Warnings**
   - Ensure all API calls use HTTPS
   - Update any hardcoded HTTP URLs in your code

### Useful Commands

```bash
# Check DNS records
dig www.urbanai.site CNAME
dig api.urbanai.site CNAME

# Test SSL certificate
openssl s_client -connect www.urbanai.site:443 -servername www.urbanai.site

# Test API endpoint
curl -X GET "https://api.urbanai.site/api/health" -H "accept: application/json"
```

## Cost Considerations

| Service | Monthly Cost | Notes |
|---------|--------------|-------|
| Domain (GoDaddy) | $0.99-12/year | First year often discounted |
| Static Web App | $0 | Free tier sufficient for testing |
| Azure Container Apps | $0.10-0.50/month | Scales to zero when not in use |
| SQL Database (Basic) | ~$5/month | Can use free tier for development |

**Cost Optimization Warning:** 
Avoid accidentally deploying the API to Azure App Service (B1 tier) as it costs ~$55/month. 
Always use Azure Container Apps for API hosting to maintain cost efficiency.

## Next Steps

1. Monitor application performance using Application Insights
2. Set up monitoring and alerting
3. Configure backup and disaster recovery
4. Implement proper logging and diagnostics
5. **Cost Validation**:
   - After deployment, verify in Azure Portal that:
     - API is running in Container Apps (not App Service)
     - Container App is configured with Consumption Plan
     - SQL Database is Basic tier ($5/month)
