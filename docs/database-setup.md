# UrbanAI Database Environment Setup

## Overview
This document describes the complete database setup for different environments in the UrbanAI application. The application uses a hybrid architecture with both relational (Azure SQL) and NoSQL (Azure Cosmos DB) databases.

## Database Architecture

### 🏗️ Relational Database (Azure SQL)
- **Purpose**: Structured data (Users, Issues, audit trails)
- **Technology**: Azure SQL Database with Entity Framework Core
- **Environments**: LocalDB (dev), InMemory (test), Azure SQL (staging/prod)

### 📄 NoSQL Database (Azure Cosmos DB for MongoDB API)
- **Purpose**: Semi-structured documents (Regulations, crawled content)
- **Technology**: Azure Cosmos DB with MongoDB API compatibility
- **Driver**: MongoDB.Driver (v3.4.0)
- **Benefits**: Global distribution, auto-scaling, MongoDB compatibility

## Environment Configuration

### 🔧 Development Environment
- **SQL Database**: SQL Server LocalDB
- **SQL Connection**: `Server=(localdb)\\mssqllocaldb;Database=UrbanAIDb;Trusted_Connection=True;MultipleActiveResultSets=true`
- **MongoDB**: Local MongoDB instance
- **MongoDB Connection**: `mongodb://localhost:27017`
- **MongoDB Database**: `UrbanAI`
- **Configuration File**: `appsettings.Development.json`

### 🧪 Testing Environment  
- **SQL Database**: InMemory provider (via Entity Framework)
- **SQL Connection**: `DataSource=:memory:`
- **MongoDB**: Test MongoDB instance or local
- **MongoDB Connection**: `mongodb://localhost:27017`
- **MongoDB Database**: `UrbanAI_Test`
- **Configuration Files**: `appsettings.Testing.json` + `CustomWebApplicationFactory.cs`

### 🚀 Staging Environment
- **SQL Database**: Azure SQL Database
- **SQL Server**: `urbanai-sql-g7drrgxp6alde.database.windows.net`
- **SQL Database Name**: `UrbanAIDb`
- **Cosmos DB**: Azure Cosmos DB (MongoDB API, Serverless)
- **Cosmos Account**: `urbanai-cosmos-{uniqueToken}`
- **Cosmos Database**: `UrbanAI`
- **Resource Group**: `rg-urbanai-staging`
- **Configuration File**: `appsettings.Staging.json`

### 🏭 Production Environment
- **SQL Database**: Azure SQL Database  
- **SQL Server**: `urbanai-sql-gzg3yvtdjpx7m.database.windows.net`
- **SQL Database Name**: `UrbanAIDb`
- **Cosmos DB**: Azure Cosmos DB (MongoDB API, Provisioned)
- **Cosmos Account**: `urbanai-cosmos-{uniqueToken}`
- **Cosmos Database**: `UrbanAI`
- **Resource Group**: `rg-urbanai-production`
- **Configuration File**: `appsettings.Production.json`

## Infrastructure as Code

### Bicep Templates
- **Main Template**: `infra/main.bicep`
- **Parameters**: `infra/main.parameters.json`
- **Deployed with**: Azure CLI (`az deployment group create`)

### Azure Resources Created
```
rg-urbanai-staging/
├── urbanai-sql-g7drrgxp6alde (SQL Server)
│   ├── UrbanAIDb (Database)
│   └── master (System Database)
├── urbanai-cosmos-{uniqueToken} (Cosmos DB Account)
│   └── UrbanAI (MongoDB Database)

rg-urbanai-production/
├── urbanai-sql-gzg3yvtdjpx7m (SQL Server)
│   ├── UrbanAIDb (Database)
│   └── master (System Database)
├── urbanai-cosmos-{uniqueToken} (Cosmos DB Account)
│   └── UrbanAI (MongoDB Database)
```

### Cosmos DB Configuration
- **API**: MongoDB API (compatible with existing MongoDB.Driver)
- **Consistency Level**: Session (optimal for most applications)
- **Scaling**: Serverless (staging), Provisioned (production)
- **Server Version**: MongoDB 5.0
- **SSL/TLS**: Required (Tls12 minimum)
- **Backup**: Automatic (continuous backup available)

## Program.cs Configuration

The application uses conditional database context registration:

```csharp
// Configure database context based on environment
// - Development: Local SQL Server (localdb)
// - Staging/Production: Azure SQL Database  
// - Testing: InMemory provider (configured in CustomWebApplicationFactory)
if (!builder.Environment.IsEnvironment("Testing"))
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("DefaultConnection connection string is not configured.");
    }
    
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(connectionString));
}
```

## Running the Application

### Development
```bash
cd src/UrbanAI.API
dotnet run --environment Development
```
- Automatically uses LocalDB
- Available at: http://localhost:5001
- Swagger UI: http://localhost:5001/swagger

### Staging  
```bash
cd src/UrbanAI.API
dotnet run --environment Staging
```
- Uses Azure SQL in rg-urbanai-staging

### Production
```bash
cd src/UrbanAI.API  
dotnet run --environment Production
```
- Uses Azure SQL in rg-urbanai-production

### Testing
```bash
dotnet test
```
- Uses InMemory provider via CustomWebApplicationFactory
- All 47 integration tests pass ✅

## Database Migrations

To apply migrations to any environment:

```bash
# Development (LocalDB)
dotnet ef database update

# Staging
dotnet ef database update --connection "Server=urbanai-sql-g7drrgxp6alde.database.windows.net,1433;Initial Catalog=UrbanAIDb;User ID=urbanai-admin;Password=ComplexPassword123!;MultipleActiveResultSets=true;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Production  
dotnet ef database update --connection "Server=urbanai-sql-gzg3yvtdjpx7m.database.windows.net,1433;Initial Catalog=UrbanAIDb;User ID=urbanai-admin;Password=ComplexPassword123!;MultipleActiveResultSets=true;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
```

## Security Notes

⚠️ **Important**: The connection strings in configuration files contain credentials and should be:
1. Replaced with environment variables or Key Vault references in production
2. Added to `.gitignore` or use user secrets for local development
3. Secured using managed identities when deploying to Azure

## Azure DevOps Integration

This setup supports the Azure DevOps work items:
- **Work Item #26**: Database setup for different environments ✅
- **Work Item #39**: Infrastructure provisioning and configuration ✅

## Next Steps

1. Replace hardcoded passwords with secure secret management
2. Set up automated migrations in CI/CD pipelines
3. Configure monitoring and alerting for Azure SQL databases
4. Implement backup and disaster recovery strategies
