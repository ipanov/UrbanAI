// Main Bicep template for UrbanAI infrastructure
// This template deploys the complete infrastructure for UrbanAI application

targetScope = 'resourceGroup'

@description('The name of the environment. This will be used to generate resource names and tags.')
param environmentName string

@description('The primary location for all resources')
param location string = resourceGroup().location

@description('The administrator login username for the SQL Server')
@secure()
param sqlAdminLogin string

@description('The administrator login password for the SQL Server')
@secure()
param sqlAdminPassword string

@description('Enable Cosmos DB free tier - Always use free/serverless for cost optimization')
param enableCosmosServerless bool = true

@description('Custom domain name for production (e.g., urbanai.site)')
param productionCustomDomain string = ''

@description('Enable custom domain for production')
param enableProductionCustomDomain bool = false

// Generate a unique suffix for resource names
var resourceToken = toLower(uniqueString(subscription().id, resourceGroup().id, environmentName))

// Common tags for all resources
var tags = {
  'azd-env-name': environmentName
  Environment: environmentName
  Application: 'UrbanAI'
  ManagedBy: 'Bicep'
}

// Resource names using the resource token for uniqueness
var sqlServerName = 'urbanai-sql-${resourceToken}'
var sqlDatabaseName = 'UrbanAIDb'
var cosmosDatabaseName = 'UrbanAI'

// Staging environment resources
var stagingCosmosAccountName = 'urbanai-cosmos-staging-${resourceToken}'
var stagingAppServicePlanName = 'urbanai-plan-staging-${resourceToken}'
var stagingAppServiceName = 'urbanai-api-staging-${resourceToken}'

// Production environment resources
var productionCosmosAccountName = 'urbanai-cosmos-production-${resourceToken}'
var productionAppServicePlanName = 'urbanai-plan-production-${resourceToken}'
var productionAppServiceName = 'urbanai-api-production-${resourceToken}'

// SQL Server
resource sqlServer 'Microsoft.Sql/servers@2021-11-01' = {
  name: sqlServerName
  location: location
  tags: tags
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

// SQL Database with Basic configuration (shared between environments)
resource sqlDatabase 'Microsoft.Sql/servers/databases@2021-11-01' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
  }
  tags: tags
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648 // 2GB for Basic
    catalogCollation: 'SQL_Latin1_General_CP1_CI_AS'
    zoneRedundant: false
    requestedBackupStorageRedundancy: 'Local'
  }
}

// Azure Cosmos DB Account for MongoDB API - Staging
resource stagingCosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2024-11-15' = {
  name: stagingCosmosAccountName
  location: location
  kind: 'MongoDB'
  tags: union(tags, { Environment: 'staging' })
  properties: {
    databaseAccountOfferType: 'Standard'
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
    enableFreeTier: true
    capabilities: [
      {
        name: 'EnableServerless'
      }
      {
        name: 'EnableMongo'
      }
    ]
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    apiProperties: {
      serverVersion: '5.0'
    }
    minimalTlsVersion: 'Tls12'
    publicNetworkAccess: 'Enabled'
    networkAclBypass: 'AzureServices'
  }
}

// Azure Cosmos DB Account for MongoDB API - Production
resource productionCosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2024-11-15' = {
  name: productionCosmosAccountName
  location: location
  kind: 'MongoDB'
  tags: union(tags, { Environment: 'production' })
  properties: {
    databaseAccountOfferType: 'Standard'
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
    enableFreeTier: false // Only one account can use free tier
    capabilities: enableCosmosServerless ? [
      {
        name: 'EnableServerless'
      }
      {
        name: 'EnableMongo'
      }
    ] : [
      {
        name: 'EnableMongo'
      }
    ]
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    apiProperties: {
      serverVersion: '5.0'
    }
    minimalTlsVersion: 'Tls12'
    publicNetworkAccess: 'Enabled'
    networkAclBypass: 'AzureServices'
  }
}

// App Service Plan (F1 Free tier) - Staging
resource stagingAppServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: stagingAppServicePlanName
  location: location
  kind: 'app'
  tags: union(tags, { Environment: 'staging' })
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  properties: {
    reserved: false
  }
}

// App Service Plan (F1 Free tier) - Production
resource productionAppServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: productionAppServicePlanName
  location: location
  kind: 'app'
  tags: union(tags, { Environment: 'production' })
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  properties: {
    reserved: false
  }
}

// App Service (Web App for API) - Staging
resource stagingAppService 'Microsoft.Web/sites@2024-04-01' = {
  name: stagingAppServiceName
  location: location
  kind: 'app'
  tags: union(tags, { Environment: 'staging', 'azd-service-name': 'api' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: stagingAppServicePlan.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: false // F1 tier doesn't support Always On
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      netFrameworkVersion: 'v8.0'
      use32BitWorkerProcess: true // F1 tier limitation
      cors: {
        allowedOrigins: ['*']
        supportCredentials: false
      }
      appSettings: [
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Staging'
        }
        {
          name: 'ConnectionStrings__DefaultConnection'
          value: 'Server=${sqlServer.properties.fullyQualifiedDomainName};Database=${sqlDatabaseName};User Id=${sqlAdminLogin};Password=${sqlAdminPassword};Encrypt=True;TrustServerCertificate=False;'
        }
        {
          name: 'MongoDbSettings__ConnectionString'
          value: stagingCosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
        }
        {
          name: 'MongoDbSettings__DatabaseName'
          value: cosmosDatabaseName
        }
      ]
    }
  }
}

// App Service (Web App for API) - Production
resource productionAppService 'Microsoft.Web/sites@2024-04-01' = {
  name: productionAppServiceName
  location: location
  kind: 'app'
  tags: union(tags, { Environment: 'production', 'azd-service-name': 'api' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: productionAppServicePlan.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: false // F1 tier doesn't support Always On
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      netFrameworkVersion: 'v8.0'
      use32BitWorkerProcess: true // F1 tier limitation
      cors: {
        allowedOrigins: ['*']
        supportCredentials: false
      }
      appSettings: [
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Production'
        }
        {
          name: 'ConnectionStrings__DefaultConnection'
          value: 'Server=${sqlServer.properties.fullyQualifiedDomainName};Database=${sqlDatabaseName};User Id=${sqlAdminLogin};Password=${sqlAdminPassword};Encrypt=True;TrustServerCertificate=False;'
        }
        {
          name: 'MongoDbSettings__ConnectionString'
          value: productionCosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
        }
        {
          name: 'MongoDbSettings__DatabaseName'
          value: cosmosDatabaseName
        }
      ]
    }
  }
}

// Include Azure Functions infrastructure
module functions './functions.bicep' = {
  name: 'functions-deployment'
  params: {
    environmentName: environmentName
    location: location
    resourceToken: resourceToken
    sqlServerName: sqlServerName
    sqlDatabaseName: sqlDatabaseName
    sqlAdminLogin: sqlAdminLogin
    sqlAdminPassword: sqlAdminPassword
    cosmosDatabaseName: cosmosDatabaseName
    stagingCosmosAccountName: stagingCosmosAccountName
    productionCosmosAccountName: productionCosmosAccountName
    managedIdentityId: managedIdentity.id
    managedIdentityPrincipalId: managedIdentity.properties.principalId
  }
}

// Custom domain binding for production App Service (root domain)
resource productionCustomDomainBinding 'Microsoft.Web/sites/hostNameBindings@2024-04-01' = if (enableProductionCustomDomain && productionCustomDomain != '') {
  parent: productionAppService
  name: productionCustomDomain
  properties: {
    azureResourceName: productionAppService.name
    azureResourceType: 'Website'
    customHostNameDnsRecordType: 'CName'
    hostNameType: 'Verified'
    sslState: 'SniEnabled'
  }
}

// Custom domain binding for API subdomain (api.urbanai.site) - ONLY for production
resource productionApiCustomDomainBinding 'Microsoft.Web/sites/hostNameBindings@2024-04-01' = if (enableProductionCustomDomain && productionCustomDomain != '') {
  parent: productionAppService
  name: 'api.${productionCustomDomain}'
  properties: {
    azureResourceName: productionAppService.name
    azureResourceType: 'Website'
    customHostNameDnsRecordType: 'CName'
    hostNameType: 'Verified'
    sslState: 'SniEnabled'
  }
}

// Firewall rule to allow Azure services
resource sqlFirewallRuleAzure 'Microsoft.Sql/servers/firewallRules@2021-11-01' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Firewall rule to allow all IPs (for development/staging - should be restricted in production)
resource sqlFirewallRuleAll 'Microsoft.Sql/servers/firewallRules@2021-11-01' = if (environmentName != 'production') {
  parent: sqlServer
  name: 'AllowAllIPs'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '255.255.255.255'
  }
}

// User-assigned managed identity for App Services
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'urbanai-identity-${resourceToken}'
  location: location
  tags: tags
}

// Outputs for use in application configuration
@description('The fully qualified domain name of the SQL Server')
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName

@description('The name of the SQL Database')
output sqlDatabaseName string = sqlDatabase.name

@description('The SQL Server name')
output sqlServerName string = sqlServer.name

@description('The resource token used for naming')
output resourceToken string = resourceToken

@description('The name of the staging Cosmos DB account')
output stagingCosmosAccountName string = stagingCosmosAccount.name

@description('The name of the production Cosmos DB account')
output productionCosmosAccountName string = productionCosmosAccount.name

@description('The Cosmos DB database name')
output cosmosDatabaseName string = cosmosDatabaseName

@description('The staging App Service URL')
output stagingAppServiceUrl string = 'https://${stagingAppService.properties.defaultHostName}'

@description('The production App Service URL')
output productionAppServiceUrl string = 'https://${productionAppService.properties.defaultHostName}'

@description('The staging App Service name')
output stagingAppServiceName string = stagingAppService.name

@description('The production App Service name')
output productionAppServiceName string = productionAppService.name

@description('The staging Function App URL')
output stagingFunctionAppUrl string = functions.outputs.stagingFunctionAppUrl

@description('The production Function App URL')
output productionFunctionAppUrl string = functions.outputs.productionFunctionAppUrl

@description('The staging Function App name')
output stagingFunctionAppName string = functions.outputs.stagingFunctionAppName

@description('The production Function App name')
output productionFunctionAppName string = functions.outputs.productionFunctionAppName

@description('Resource group ID')
output RESOURCE_GROUP_ID string = resourceGroup().id

@description('The managed identity ID')
output managedIdentityId string = managedIdentity.id

@description('The managed identity principal ID')  
output managedIdentityPrincipalId string = managedIdentity.properties.principalId

@description('Production custom domain URL (if enabled)')
output productionCustomDomainUrl string = enableProductionCustomDomain && productionCustomDomain != '' ? 'https://${productionCustomDomain}' : ''

@description('Production API custom domain URL (if enabled)')
output productionApiCustomDomainUrl string = enableProductionCustomDomain && productionCustomDomain != '' ? 'https://api.${productionCustomDomain}' : ''
