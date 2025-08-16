// Azure Functions infrastructure for UrbanAI
// This template deploys the Functions App for UrbanAI application

targetScope = 'resourceGroup'

@description('The name of the environment. This will be used to generate resource names and tags.')
param environmentName string

@description('The primary location for all resources')
param location string = resourceGroup().location

@description('The resource token used for naming')
param resourceToken string

@description('The SQL Server name')
param sqlServerName string

@description('The SQL Database name')
param sqlDatabaseName string

@description('The SQL administrator login')
param sqlAdminLogin string

@description('The SQL administrator password')
@secure()
param sqlAdminPassword string

@description('The Cosmos DB database name')
param cosmosDatabaseName string

@description('The staging Cosmos DB account name')
param stagingCosmosAccountName string

@description('The production Cosmos DB account name')
param productionCosmosAccountName string

@description('The managed identity ID')
param managedIdentityId string

@description('The managed identity principal ID')
param managedIdentityPrincipalId string

// Common tags for all resources
var tags = {
  'azd-env-name': environmentName
  Environment: environmentName
  Application: 'UrbanAI'
  ManagedBy: 'Bicep'
}

// Resource names using the resource token for uniqueness
var stagingFunctionAppName = 'urbanai-func-staging-${resourceToken}'
var productionFunctionAppName = 'urbanai-func-production-${resourceToken}'
var stagingStorageAccountName = 'urbanstaging${resourceToken}'
var productionStorageAccountName = 'urbanprod${resourceToken}'

// Storage Account for Functions - Staging
resource stagingStorageAccount 'Microsoft.Storage/storageAccounts@2024-01-01' = {
  name: stagingStorageAccountName
  location: location
  tags: union(tags, { Environment: 'staging' })
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}

// Storage Account for Functions - Production
resource productionStorageAccount 'Microsoft.Storage/storageAccounts@2024-01-01' = {
  name: productionStorageAccountName
  location: location
  tags: union(tags, { Environment: 'production' })
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}

// Function App (Functions App) - Staging
resource stagingFunctionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: stagingFunctionAppName
  location: location
  kind: 'functionapp'
  tags: union(tags, { Environment: 'staging', 'azd-service-name': 'functions' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentityId}': {}
    }
  }
  properties: {
    serverFarmId: resourceId('Microsoft.Web/serverfarms', 'urbanai-plan-staging-${resourceToken}')
    httpsOnly: true
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${stagingStorageAccount.name};AccountKey=${listKeys(stagingStorageAccount.id, '2024-01-01').keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet-isolated'
        }
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Staging'
        }
        {
          name: 'ConnectionStrings__DefaultConnection'
          value: 'Server=${sqlServerName}.database.windows.net;Database=${sqlDatabaseName};User Id=${sqlAdminLogin};Password=${sqlAdminPassword};Encrypt=True;TrustServerCertificate=False;'
        }
        {
          name: 'MongoDbSettings__ConnectionString'
          value: 'mongodb://${stagingCosmosAccountName}.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${stagingCosmosAccountName}@'
        }
        {
          name: 'MongoDbSettings__DatabaseName'
          value: cosmosDatabaseName
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
      alwaysOn: false // F1 tier doesn't support Always On
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      use32BitWorkerProcess: true // F1 tier limitation
      cors: {
        allowedOrigins: ['*']
        supportCredentials: false
      }
    }
  }
}

// Function App (Functions App) - Production
resource productionFunctionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: productionFunctionAppName
  location: location
  kind: 'functionapp'
  tags: union(tags, { Environment: 'production', 'azd-service-name': 'functions' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentityId}': {}
    }
  }
  properties: {
    serverFarmId: resourceId('Microsoft.Web/serverfarms', 'urbanai-plan-production-${resourceToken}')
    httpsOnly: true
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${productionStorageAccount.name};AccountKey=${listKeys(productionStorageAccount.id, '2024-01-01').keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet-isolated'
        }
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Production'
        }
        {
          name: 'ConnectionStrings__DefaultConnection'
          value: 'Server=${sqlServerName}.database.windows.net;Database=${sqlDatabaseName};User Id=${sqlAdminLogin};Password=${sqlAdminPassword};Encrypt=True;TrustServerCertificate=False;'
        }
        {
          name: 'MongoDbSettings__ConnectionString'
          value: 'mongodb://${productionCosmosAccountName}.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${productionCosmosAccountName}@'
        }
        {
          name: 'MongoDbSettings__DatabaseName'
          value: cosmosDatabaseName
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
      alwaysOn: false // F1 tier doesn't support Always On
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      use32BitWorkerProcess: true // F1 tier limitation
      cors: {
        allowedOrigins: ['*']
        supportCredentials: false
      }
    }
  }
}

// Outputs for use in application configuration
@description('The staging Function App URL')
output stagingFunctionAppUrl string = 'https://${stagingFunctionApp.properties.defaultHostName}'

@description('The production Function App URL')
output productionFunctionAppUrl string = 'https://${productionFunctionApp.properties.defaultHostName}'

@description('The staging Function App name')
output stagingFunctionAppName string = stagingFunctionApp.name

@description('The production Function App name')
output productionFunctionAppName string = productionFunctionApp.name
