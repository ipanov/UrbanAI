# UrbanAI Secrets Management Strategy

This document outlines the secure secrets management implementation for UrbanAI using Azure Key Vault.

## Overview

All production secrets are stored in Azure Key Vault and referenced through configuration. Development environments use placeholder values or local user secrets.

## Secret Categories

### 1. JWT Authentication Secrets
- **Purpose**: Token signing and validation
- **Rotation**: Every 90 days
- **Access**: API and Functions applications

### 2. OAuth Provider Secrets  
- **Purpose**: Third-party authentication (Google, Microsoft, Facebook)
- **Rotation**: When providers require or security incident
- **Access**: API application only

### 3. Database Connection Secrets
- **Purpose**: Secure database authentication
- **Rotation**: Every 180 days or as required
- **Access**: API and Functions applications

## Secret Naming Convention

Following Azure Key Vault best practices with hierarchical naming using double dashes (`--`):

| Configuration Path | Key Vault Secret Name | Description |
|-------------------|----------------------|-------------|
| `Jwt:Secret` | `jwt-secret` | JWT token signing key |
| `Authentication:Google:ClientId` | `oauth--google--client-id` | Google OAuth client ID |
| `Authentication:Google:ClientSecret` | `oauth--google--client-secret` | Google OAuth client secret |
| `Authentication:Microsoft:ClientId` | `oauth--microsoft--client-id` | Microsoft OAuth client ID |
| `Authentication:Microsoft:ClientSecret` | `oauth--microsoft--client-secret` | Microsoft OAuth client secret |
| `Authentication:Facebook:AppId` | `oauth--facebook--app-id` | Facebook app ID |
| `Authentication:Facebook:AppSecret` | `oauth--facebook--app-secret` | Facebook app secret |
| `ConnectionStrings:DefaultConnection` | `database--sql--connection` | Azure SQL connection string |
| `MongoDbSettings:ConnectionString` | `database--mongo--connection` | Cosmos DB MongoDB connection |

## Environment Strategy

### Development Environment
- Uses placeholder values in configuration files
- Real secrets stored in user secrets for local testing
- No Key Vault access required for local development

### Production Environment  
- All secrets retrieved from Azure Key Vault
- Configuration references Key Vault using `@Microsoft.KeyVault()` syntax
- Managed Identity authentication to Key Vault

## Access Control

### Managed Identity Permissions
The UrbanAI managed identity has the following Key Vault permissions:
- **Secrets**: Get, List
- **Scope**: Key Vault Secrets User role (RBAC)

### Network Access
- Key Vault allows access from Azure services
- Public access enabled for deployment and management
- Consider Private Link for production hardening

## Implementation Details

### Configuration Providers
1. **Azure Key Vault Configuration Provider** (production)
   ```csharp
   builder.Configuration.AddAzureKeyVault(
       new Uri(keyVaultEndpoint),
       new DefaultAzureCredential());
   ```

2. **User Secrets** (development)
   ```bash
   dotnet user-secrets set "Jwt:Secret" "local-development-secret"
   ```

### Authentication Flow
1. Application starts with `DefaultAzureCredential`
2. In Azure: Uses managed identity
3. Locally: Uses Azure CLI or Visual Studio credentials
4. Secrets loaded at application startup

## Security Best Practices

### Secret Storage
- ✅ No secrets in source code
- ✅ No secrets in configuration files (production)
- ✅ Environment-specific secret isolation
- ✅ Least privilege access (managed identity)

### Secret Rotation
- JWT secrets: 90-day rotation schedule
- OAuth secrets: Provider-driven rotation
- Database secrets: 180-day rotation schedule
- Automated rotation using Azure automation (future)

### Monitoring & Auditing
- Key Vault access logs enabled
- Azure Monitor alerts for unauthorized access
- Regular access reviews and permission audits

## Deployment Process

### Initial Secret Setup
1. Create Azure Key Vault via Bicep template
2. Set up managed identity and RBAC permissions
3. Deploy secrets using Azure CLI or PowerShell
4. Validate application configuration

### Secret Updates
1. Update secret value in Key Vault
2. Restart application to reload secrets
3. Validate functionality with new secret
4. Document rotation in change log

### Emergency Procedures
1. **Compromised Secret**: Immediately rotate in Key Vault
2. **Access Issues**: Verify managed identity and permissions
3. **Outage**: Fallback to environment variables (temporary)

## Development Workflow

### For Developers
1. Use placeholder values in local development
2. Configure real secrets via user secrets when needed
3. Never commit actual secrets to source control
4. Test with production-like secret rotation

### For DevOps
1. Manage Key Vault through Infrastructure as Code
2. Automate secret deployment through CI/CD
3. Monitor Key Vault access and usage
4. Implement secret rotation schedules

## Compliance Considerations

### GDPR Compliance
- Secrets handling follows data minimization principles
- Access logging provides audit trail
- Regular access reviews ensure compliance

### SOC 2 Requirements
- Documented secret management procedures
- Regular access reviews and recertification
- Incident response for compromised secrets
- Change management for secret updates

## Future Enhancements

1. **Automated Secret Rotation**: Azure Automation for regular rotation
2. **Certificate Management**: X.509 certificates for authentication
3. **Private Link**: Network isolation for Key Vault access
4. **Multi-Environment**: Separate Key Vaults per environment
5. **Secret Scanning**: Automated scanning for leaked secrets

## Troubleshooting

### Common Issues
1. **403 Forbidden**: Check managed identity permissions
2. **Secret Not Found**: Verify secret name and Key Vault reference
3. **Timeout**: Check network connectivity to Key Vault
4. **Authentication Failed**: Verify DefaultAzureCredential setup

### Validation Steps
1. Test managed identity access to Key Vault
2. Verify secret names match configuration references
3. Check application logs for Key Vault errors
4. Validate RBAC permissions and role assignments

## Contact Information

- **Security Team**: For secret rotation and incident response
- **DevOps Team**: For Key Vault infrastructure changes
- **Development Team**: For application configuration issues

---

*This document should be reviewed quarterly and updated as security requirements evolve.*