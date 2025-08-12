# UrbanAI Cost-Optimized Architecture

## Overview
This document describes the cost-optimized architecture for UrbanAI MVP, designed to minimize Azure costs while maintaining separate staging and production environments.

## Architecture Components

### Shared Resources (Cost Optimization)
- **SQL Server & Database**: One shared SQL Database (Basic tier, ~$4.90/month) used by both staging and production environments
  - Server: `urbanai-sql-{resourceToken}`
  - Database: `UrbanAIDb`
  - SKU: Basic (2GB storage)
  - Both staging and production App Services connect to this shared database

### Environment-Specific Resources (Free/Low-Cost)
#### Staging Environment
- **App Service Plan**: `urbanai-plan-staging-{resourceToken}` (F1 Free tier)
- **App Service**: `urbanai-api-staging-{resourceToken}` (F1 Free tier)
  - URL: `https://urbanai-api-staging-{resourceToken}.azurewebsites.net`
- **Cosmos DB**: `urbanai-cosmos-staging-{resourceToken}` (Free tier with serverless)

#### Production Environment  
- **App Service Plan**: `urbanai-plan-production-{resourceToken}` (F1 Free tier)
- **App Service**: `urbanai-api-production-{resourceToken}` (F1 Free tier)
  - Default URL: `https://urbanai-api-production-{resourceToken}.azurewebsites.net`
  - **Custom Domain**: `https://urbanai.site` (root domain)
  - **API Endpoint**: `https://api.urbanai.site` (main API endpoint)
- **Cosmos DB**: `urbanai-cosmos-production-{resourceToken}` (Serverless tier, pay-per-use)

### Security & Identity
- **Managed Identity**: One user-assigned managed identity shared by both App Services
- **CORS**: Enabled on both App Services for web API access
- **SQL Firewall**: Azure services allowed, all IPs allowed for staging (development ease)

## Cost Breakdown (Estimated Monthly)
- **SQL Database (Basic)**: $4.90/month (fixed cost, shared)
- **App Service Plans (2x F1)**: $0/month (free tier)
- **Cosmos DB Staging**: $0/month (free tier allowance)
- **Cosmos DB Production**: ~$0-5/month (serverless, usage-based)
- **Managed Identity**: $0/month (free)

**Total Estimated Cost**: ~$5-10/month

## Deployment Strategy
1. The Bicep template creates all resources in a single deployment
2. Both staging and production App Services are configured to use the shared SQL Database
3. Each environment has its own Cosmos DB for document storage isolation
4. Resource naming includes environment suffix for App Services and Cosmos DB, but not for SQL Server/Database

## Key Benefits
- **Minimum Cost**: Only pay for one SQL Database instance
- **Environment Isolation**: Separate App Services and Cosmos DBs for staging/production
- **Data Consistency**: Shared SQL Database ensures consistent relational data across environments
- **Free Tier Maximization**: Uses F1 App Service Plans and Cosmos DB free tier where possible

## Important Notes
- Only one Cosmos DB account can use the free tier (assigned to staging)
- F1 App Service Plan limitations: No Always On, 32-bit worker process, limited compute
- Shared database means staging and production share the same relational data (acceptable for MVP)
- Both environments use the same SQL admin credentials (stored in Azure Key Vault in production)

## Next Steps
1. Deploy infrastructure using `azd up`
2. Configure CI/CD pipelines for staging and production deployments
3. Set up monitoring and alerts
4. Consider upgrading to dedicated databases when revenue supports the additional cost
