# Custom Domain Setup Script for UrbanAI (PowerShell)
# This script helps configure the custom domain after deployment

Write-Host "UrbanAI Custom Domain Setup Script" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Get deployment values
Write-Host "Getting deployment values..." -ForegroundColor Yellow
$envValues = azd env get-values --output json | ConvertFrom-Json
$prodAppName = $envValues.productionAppServiceName
$resourceGroup = $envValues.AZURE_RESOURCE_GROUP_NAME
$domain = "urbanai.site"
$apiDomain = "api.urbanai.site"

Write-Host "Production App Service: $prodAppName" -ForegroundColor Cyan
Write-Host "Resource Group: $resourceGroup" -ForegroundColor Cyan
Write-Host "Custom Domain: $domain" -ForegroundColor Cyan
Write-Host "API Domain: $apiDomain" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 1: Getting App Service default hostname..." -ForegroundColor Yellow
$defaultHostname = az webapp show --name $prodAppName --resource-group $resourceGroup --query defaultHostName -o tsv
Write-Host "Default hostname: $defaultHostname" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 2: Domain verification..." -ForegroundColor Yellow
Write-Host "Please add the following DNS records in GoDaddy:" -ForegroundColor White
Write-Host ""
Write-Host "1. CNAME Record for Root Domain:" -ForegroundColor Green
Write-Host "   Type: CNAME" -ForegroundColor White
Write-Host "   Name: @" -ForegroundColor White
Write-Host "   Value: $defaultHostname" -ForegroundColor White
Write-Host "   TTL: 1 Hour" -ForegroundColor White
Write-Host ""
Write-Host "2. CNAME Record for API Subdomain:" -ForegroundColor Green
Write-Host "   Type: CNAME" -ForegroundColor White
Write-Host "   Name: api" -ForegroundColor White
Write-Host "   Value: $defaultHostname" -ForegroundColor White
Write-Host "   TTL: 1 Hour" -ForegroundColor White
Write-Host ""

# Get domain verification details
Write-Host "3. Domain Verification TXT Record:" -ForegroundColor Green
$verificationId = az webapp show --name $prodAppName --resource-group $resourceGroup --query customDomainVerificationId -o tsv
Write-Host "   Type: TXT" -ForegroundColor White
Write-Host "   Name: asuid" -ForegroundColor White
Write-Host "   Value: $verificationId" -ForegroundColor White
Write-Host "   TTL: 1 Hour" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter after you've added the DNS records in GoDaddy"

Write-Host ""
Write-Host "Step 3: Adding custom domains to App Service..." -ForegroundColor Yellow

# Add root domain
Write-Host "Adding $domain..." -ForegroundColor Cyan
az webapp config hostname add `
    --webapp-name $prodAppName `
    --resource-group $resourceGroup `
    --hostname $domain

# Add API subdomain  
Write-Host "Adding $apiDomain..." -ForegroundColor Cyan
az webapp config hostname add `
    --webapp-name $prodAppName `
    --resource-group $resourceGroup `
    --hostname $apiDomain

Write-Host ""
Write-Host "Step 4: Creating SSL certificates..." -ForegroundColor Yellow

# Create managed certificates
Write-Host "Creating SSL certificate for $domain..." -ForegroundColor Cyan
az webapp config ssl create `
    --name $prodAppName `
    --resource-group $resourceGroup `
    --hostname $domain

Write-Host "Creating SSL certificate for $apiDomain..." -ForegroundColor Cyan
az webapp config ssl create `
    --name $prodAppName `
    --resource-group $resourceGroup `
    --hostname $apiDomain

Write-Host ""
Write-Host "Step 5: Binding SSL certificates..." -ForegroundColor Yellow

# Get certificate thumbprints and bind them
$domainThumbprint = az webapp config ssl list --resource-group $resourceGroup --query "[?name=='$domain'].thumbprint" -o tsv
$apiThumbprint = az webapp config ssl list --resource-group $resourceGroup --query "[?name=='$apiDomain'].thumbprint" -o tsv

if ($domainThumbprint) {
    Write-Host "Binding SSL for $domain..." -ForegroundColor Cyan
    az webapp config ssl bind `
        --name $prodAppName `
        --resource-group $resourceGroup `
        --certificate-thumbprint $domainThumbprint `
        --ssl-type SNI `
        --hostname $domain
}

if ($apiThumbprint) {
    Write-Host "Binding SSL for $apiDomain..." -ForegroundColor Cyan
    az webapp config ssl bind `
        --name $prodAppName `
        --resource-group $resourceGroup `
        --certificate-thumbprint $apiThumbprint `
        --ssl-type SNI `
        --hostname $apiDomain
}

Write-Host ""
Write-Host "Setup complete! Testing domains..." -ForegroundColor Green
Write-Host ""

# Test domains
Write-Host "Testing $domain..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://$domain" -Method Head -ErrorAction SilentlyContinue
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Not yet accessible (DNS propagation may be needed)" -ForegroundColor Yellow
}

Write-Host "Testing $apiDomain..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://$apiDomain" -Method Head -ErrorAction SilentlyContinue
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Not yet accessible (DNS propagation may be needed)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Custom domain setup completed!" -ForegroundColor Green
Write-Host "Your production API is now available at: https://$apiDomain" -ForegroundColor Cyan
Write-Host "Note: DNS propagation may take 24-48 hours for global availability." -ForegroundColor Yellow
