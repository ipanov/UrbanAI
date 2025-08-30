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

// Resource names using the resource token for uniqueness (single environment)
var sqlServerName = 'urbanai-sql-${resourceToken}'
var sqlDatabaseName = 'UrbanAIDb'
var cosmosDatabaseName = 'UrbanAI'
var cosmosAccountName = 'urbanai-cosmos-${resourceToken}'
var appServicePlanName = 'urbanai-plan-${resourceToken}'

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

// Azure Cosmos DB Account for MongoDB API (single environment with free tier)
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2024-11-15' = {
  name: cosmosAccountName
  location: location
  kind: 'MongoDB'
  tags: tags
  properties: {
    databaseAccountOfferType: 'Standard'
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
    enableFreeTier: true // Free tier (1000 RU/s, 25GB)
    capabilities: [
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

// App Service Plan (F1 Free tier) - Single Environment
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: appServicePlanName
  location: location
  kind: 'app'
  tags: tags
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  properties: {
    reserved: false
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
    cosmosAccountName: cosmosAccountName
    managedIdentityId: managedIdentity.id
    managedIdentityPrincipalId: managedIdentity.properties.principalId
    appServicePlanId: appServicePlan.id
    keyVaultName: keyVault.name
  }
}

// Custom domain binding for Function App (if enabled)
resource customDomainBinding 'Microsoft.Web/sites/hostNameBindings@2024-04-01' = if (enableProductionCustomDomain && productionCustomDomain != '') {
  parent: functions.outputs.functionApp
  name: productionCustomDomain
  properties: {
    azureResourceName: functions.outputs.functionAppName
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

// User-assigned managed identity for Function Apps
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'urbanai-identity-${resourceToken}'
  location: location
  tags: tags
}

// Azure Key Vault for secure secret management
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: 'urbanai-kv-${resourceToken}'
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: false
    enableRbacAuthorization: true
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
    accessPolicies: []
  }
}

// Role assignment: Give the managed identity Key Vault Secrets User role
resource keyVaultSecretsUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, managedIdentity.id, 'Key Vault Secrets User')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6') // Key Vault Secrets User
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
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

@description('The name of the Cosmos DB account')
output cosmosAccountName string = cosmosAccount.name

@description('The Cosmos DB database name')
output cosmosDatabaseName string = cosmosDatabaseName

@description('The Function App URL')
output functionAppUrl string = functions.outputs.functionAppUrl

@description('The Function App name')
output functionAppName string = functions.outputs.functionAppName

@description('Resource group ID')
output RESOURCE_GROUP_ID string = resourceGroup().id

@description('The managed identity ID')
output managedIdentityId string = managedIdentity.id

@description('The managed identity principal ID')  
output managedIdentityPrincipalId string = managedIdentity.properties.principalId

@description('Custom domain URL (if enabled)')
output customDomainUrl string = enableProductionCustomDomain && productionCustomDomain != '' ? 'https://${productionCustomDomain}' : ''

@description('API custom domain URL (if enabled)')
output apiCustomDomainUrl string = enableProductionCustomDomain && productionCustomDomain != '' ? 'https://api.${productionCustomDomain}' : ''

@description('The Key Vault name')
output keyVaultName string = keyVault.name

@description('The Key Vault URI')
output keyVaultUri string = keyVault.properties.vaultUri