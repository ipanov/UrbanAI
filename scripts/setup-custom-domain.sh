#!/bin/bash
# Custom Domain Setup Script for UrbanAI
# This script helps configure the custom domain after deployment

echo "UrbanAI Custom Domain Setup Script"
echo "=================================="

# Get deployment values
echo "Getting deployment values..."
PROD_APP_NAME=$(azd env get-values --output json | jq -r .productionAppServiceName)
RESOURCE_GROUP=$(azd env get-values --output json | jq -r .AZURE_RESOURCE_GROUP_NAME)
DOMAIN="urbanai.site"
API_DOMAIN="api.urbanai.site"

echo "Production App Service: $PROD_APP_NAME"
echo "Resource Group: $RESOURCE_GROUP"
echo "Custom Domain: $DOMAIN"
echo "API Domain: $API_DOMAIN"

echo ""
echo "Step 1: Getting App Service default hostname..."
DEFAULT_HOSTNAME=$(az webapp show --name $PROD_APP_NAME --resource-group $RESOURCE_GROUP --query defaultHostName -o tsv)
echo "Default hostname: $DEFAULT_HOSTNAME"

echo ""
echo "Step 2: Domain verification..."
echo "Please add the following DNS records in GoDaddy:"
echo ""
echo "1. CNAME Record for Root Domain:"
echo "   Type: CNAME"
echo "   Name: @"
echo "   Value: $DEFAULT_HOSTNAME"
echo "   TTL: 1 Hour"
echo ""
echo "2. CNAME Record for API Subdomain:"
echo "   Type: CNAME" 
echo "   Name: api"
echo "   Value: $DEFAULT_HOSTNAME"
echo "   TTL: 1 Hour"
echo ""

# Get domain verification details
echo "3. Domain Verification TXT Record:"
VERIFICATION_ID=$(az webapp show --name $PROD_APP_NAME --resource-group $RESOURCE_GROUP --query customDomainVerificationId -o tsv)
echo "   Type: TXT"
echo "   Name: asuid"
echo "   Value: $VERIFICATION_ID"
echo "   TTL: 1 Hour"
echo ""

read -p "Press Enter after you've added the DNS records in GoDaddy..."

echo ""
echo "Step 3: Adding custom domains to App Service..."

# Add root domain
echo "Adding $DOMAIN..."
az webapp config hostname add \
    --webapp-name $PROD_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --hostname $DOMAIN

# Add API subdomain  
echo "Adding $API_DOMAIN..."
az webapp config hostname add \
    --webapp-name $PROD_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --hostname $API_DOMAIN

echo ""
echo "Step 4: Creating SSL certificates..."

# Create managed certificates
echo "Creating SSL certificate for $DOMAIN..."
az webapp config ssl create \
    --name $PROD_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --hostname $DOMAIN

echo "Creating SSL certificate for $API_DOMAIN..."
az webapp config ssl create \
    --name $PROD_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --hostname $API_DOMAIN

echo ""
echo "Step 5: Binding SSL certificates..."

# Get certificate thumbprints and bind them
DOMAIN_THUMBPRINT=$(az webapp config ssl list --resource-group $RESOURCE_GROUP --query "[?name=='$DOMAIN'].thumbprint" -o tsv)
API_THUMBPRINT=$(az webapp config ssl list --resource-group $RESOURCE_GROUP --query "[?name=='$API_DOMAIN'].thumbprint" -o tsv)

if [ ! -z "$DOMAIN_THUMBPRINT" ]; then
    echo "Binding SSL for $DOMAIN..."
    az webapp config ssl bind \
        --name $PROD_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --certificate-thumbprint $DOMAIN_THUMBPRINT \
        --ssl-type SNI \
        --hostname $DOMAIN
fi

if [ ! -z "$API_THUMBPRINT" ]; then
    echo "Binding SSL for $API_DOMAIN..."
    az webapp config ssl bind \
        --name $PROD_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --certificate-thumbprint $API_THUMBPRINT \
        --ssl-type SNI \
        --hostname $API_DOMAIN
fi

echo ""
echo "Setup complete! Testing domains..."
echo ""

# Test domains
echo "Testing $DOMAIN..."
curl -I https://$DOMAIN 2>/dev/null | head -1

echo "Testing $API_DOMAIN..."
curl -I https://$API_DOMAIN 2>/dev/null | head -1

echo ""
echo "Custom domain setup completed!"
echo "Your production API is now available at: https://$API_DOMAIN"
echo "Note: DNS propagation may take 24-48 hours for global availability."
