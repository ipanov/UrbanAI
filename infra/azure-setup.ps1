# Azure Resource Setup Script for UrbanAI
# Run this script to create all necessary Azure resources for deployment

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$Location = "West Europe",
    
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId,
    
    [Parameter(Mandatory=$false)]
    [string]$Environment = "test"
)

# Login to Azure
Write-Host "Logging into Azure..." -ForegroundColor Green
az login

# Set subscription
Write-Host "Setting subscription..." -ForegroundColor Green
az account set --subscription $SubscriptionId

# Create Resource Group
Write-Host "Creating Resource Group: $ResourceGroupName" -ForegroundColor Green
az group create --name $ResourceGroupName --location $Location

# Create Static Web App for Frontend
Write-Host "Creating Static Web App for Frontend..." -ForegroundColor Green
$staticWebApp = az staticwebapp create `
    --name "urbanai-frontend-$Environment" `
    --resource-group $ResourceGroupName `
    --location $Location `
    --sku Free `
    --branch main `
    --app-location "/src/UrbanAI.Frontend" `
    --output-location "dist" `
    --api-location "api" `
    | ConvertFrom-Json

Write-Host "Static Web App created with URL: $($staticWebApp.defaultHostname)" -ForegroundColor Yellow

# Create Azure Container Registry
Write-Host "Creating Azure Container Registry..." -ForegroundColor Green
$acrName = "urbanaiacr$Environment$(Get-Random -Maximum 1000)"
az acr create `
    --name $acrName `
    --resource-group $ResourceGroupName `
    --sku Basic `
    --admin-enabled true

# Create Container Apps Environment
Write-Host "Creating Container Apps Environment..." -ForegroundColor Green
az containerapp env create `
    --name "urbanai-env-$Environment" `
    --resource-group $ResourceGroupName `
    --location $Location

# Create Container App for API
Write-Host "Creating Container App for API..." -ForegroundColor Green
$containerApp = az containerapp create `
    --name "urbanai-api-$Environment" `
    --resource-group $ResourceGroupName `
    --environment "urbanai-env-$Environment" `
    --image "$acrName.azurecr.io/urbanai-api:latest" `
    --target-port 80 `
    --ingress 'external' `
    --registry-server "$acrName.azurecr.io" `
    --registry-identity 'system' `
    | ConvertFrom-Json

Write-Host "Container App created with URL: $($containerApp.configuration.ingress.fqdn)" -ForegroundColor Yellow

# Create SQL Server Database
Write-Host "Creating SQL Server Database..." -ForegroundColor Green
$sqlServerName = "urbanai-sql-$Environment-$(Get-Random)"
$sqlAdminUser = "urbanaiadmin"
$sqlAdminPassword = "UrbanAI2025!" # In production, use Azure Key Vault

az sql server create `
    --name $sqlServerName `
    --resource-group $ResourceGroupName `
    --location $Location `
    --admin-user $sqlAdminUser `
    --admin-password $sqlAdminPassword

# Create SQL Database
az sql db create `
    --name "urbanai-db-$Environment" `
    --server $sqlServerName `
    --resource-group $ResourceGroupName `
    --service-objective Basic

# Configure SQL Server Firewall
az sql server firewall-rule create `
    --name "AllowAzureServices" `
    --server $sqlServerName `
    --resource-group $ResourceGroupName `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0

# Create Application Insights
Write-Host "Creating Application Insights..." -ForegroundColor Green
az monitor app-insights component create `
    --app "urbanai-insights-$Environment" `
    --location $Location `
    --kind web `
    --resource-group $ResourceGroupName `
    --application-type web

# Output Configuration Information
Write-Host "`n=== DEPLOYMENT COMPLETE ===" -ForegroundColor Green
Write-Host "Resources created in Resource Group: $ResourceGroupName" -ForegroundColor Yellow
Write-Host "Frontend URL: https://$($staticWebApp.defaultHostname)" -ForegroundColor Cyan
Write-Host "API URL: https://$($containerApp.configuration.ingress.fqdn)" -ForegroundColor Cyan
Write-Host "SQL Server: $sqlServerName.database.windows.net" -ForegroundColor Cyan
Write-Host "Container Registry: $acrName.azurecr.io" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Green
Write-Host "1. Configure GitHub Secrets with Azure credentials" -ForegroundColor White
Write-Host "2. Update app settings in Azure Web Apps" -ForegroundColor White
Write-Host "3. Configure custom domain (urbanai.site)" -ForegroundColor White
Write-Host "4. Set up SSL certificate" -ForegroundColor White
