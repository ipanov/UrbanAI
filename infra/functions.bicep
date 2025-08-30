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

@description('The Cosmos DB account name')
param cosmosAccountName string

@description('The managed identity ID')
param managedIdentityId string

@description('The managed identity principal ID')
param managedIdentityPrincipalId string

@description('The App Service Plan ID')
param appServicePlanId string

@description('The Key Vault name for secret management')
param keyVaultName string

// Common tags for all resources
var tags = {
  'azd-env-name': environmentName
  Environment: environmentName
  Application: 'UrbanAI'
  ManagedBy: 'Bicep'
}

// Resource names using the resource token for uniqueness (single environment)
var functionAppName = 'urbanai-func-${resourceToken}'
var storageAccountName = 'urban${resourceToken}'

// Storage Account for Functions
resource storageAccount 'Microsoft.Storage/storageAccounts@2024-01-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}

// Function App (Functions App) - Single Environment
resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  tags: union(tags, { 'azd-service-name': 'functions' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentityId}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlanId
    httpsOnly: true
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${listKeys(storageAccount.id, '2024-01-01').keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
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
          value: environmentName
        }
        {
          name: 'ConnectionStrings__DefaultConnection'
          value: 'Server=${sqlServerName}.database.windows.net;Database=${sqlDatabaseName};User Id=${sqlAdminLogin};Password=${sqlAdminPassword};Encrypt=True;TrustServerCertificate=False;'
        }
        {
          name: 'MongoDbSettings__ConnectionString'
          value: 'mongodb://${cosmosAccountName}.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${cosmosAccountName}@'
        }
        {
          name: 'MongoDbSettings__DatabaseName'
          value: cosmosDatabaseName
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'AZURE_KEY_VAULT_ENDPOINT'
          value: 'https://${keyVaultName}.vault.azure.net/'
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
@description('The Function App URL')
output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'

@description('The Function App name')
output functionAppName string = functionApp.name

@description('The Function App resource for domain binding')
output functionApp resource = functionApp