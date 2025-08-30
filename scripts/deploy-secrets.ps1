# UrbanAI Secret Deployment Script
# This script securely deploys secrets to Azure Key Vault
# Usage: .\deploy-secrets.ps1 -Environment production -KeyVaultName "urbanai-kv-abc123"

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("development", "staging", "production")]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [string]$KeyVaultName,
    
    [Parameter(Mandatory=$false)]
    [switch]$WhatIf
)

# Color coding for output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "🔐 UrbanAI Secret Deployment Script" "Cyan"
Write-ColorOutput "Environment: $Environment" "Yellow"
Write-ColorOutput "Key Vault: $KeyVaultName" "Yellow"

# Check if user is logged in to Azure
try {
    $context = Get-AzContext
    if (-not $context) {
        Write-ColorOutput "❌ Not logged in to Azure. Please run 'az login' or 'Connect-AzAccount'" "Red"
        exit 1
    }
    Write-ColorOutput "✅ Authenticated as: $($context.Account.Id)" "Green"
}
catch {
    Write-ColorOutput "❌ Error checking Azure authentication: $($_.Exception.Message)" "Red"
    exit 1
}

# Check if Key Vault exists
try {
    $keyVault = Get-AzKeyVault -VaultName $KeyVaultName -ErrorAction Stop
    Write-ColorOutput "✅ Key Vault '$KeyVaultName' found in resource group: $($keyVault.ResourceGroupName)" "Green"
}
catch {
    Write-ColorOutput "❌ Key Vault '$KeyVaultName' not found or no access: $($_.Exception.Message)" "Red"
    exit 1
}

# Define secrets for each environment
$secrets = @{
    "development" = @{
        "jwt-secret" = "dev-jwt-secret-256-bit-key-for-local-development-testing-only"
        "oauth--google--client-id" = "your-dev-google-client-id"
        "oauth--google--client-secret" = "your-dev-google-client-secret"
        "oauth--microsoft--client-id" = "your-dev-microsoft-client-id"
        "oauth--microsoft--client-secret" = "your-dev-microsoft-client-secret"
        "oauth--facebook--app-id" = "your-dev-facebook-app-id"
        "oauth--facebook--app-secret" = "your-dev-facebook-app-secret"
    }
    "staging" = @{
        "jwt-secret" = (Read-Host -Prompt "Enter JWT secret (256-bit key)" -AsSecureString | ConvertFrom-SecureString -AsPlainText)
        "oauth--google--client-id" = (Read-Host -Prompt "Enter staging Google OAuth client ID")
        "oauth--google--client-secret" = (Read-Host -Prompt "Enter staging Google OAuth client secret" -AsSecureString | ConvertFrom-SecureString -AsPlainText)
        "oauth--microsoft--client-id" = (Read-Host -Prompt "Enter staging Microsoft OAuth client ID")
        "oauth--microsoft--client-secret" = (Read-Host -Prompt "Enter staging Microsoft OAuth client secret" -AsSecureString | ConvertFrom-SecureString -AsPlainText)
        "oauth--facebook--app-id" = (Read-Host -Prompt "Enter staging Facebook app ID")
        "oauth--facebook--app-secret" = (Read-Host -Prompt "Enter staging Facebook app secret" -AsSecureString | ConvertFrom-SecureString -AsPlainText)
    }
    "production" = @{
        "jwt-secret" = (Read-Host -Prompt "Enter production JWT secret (256-bit key)" -AsSecureString | ConvertFrom-SecureString -AsPlainText)
        "oauth--google--client-id" = (Read-Host -Prompt "Enter production Google OAuth client ID")
        "oauth--google--client-secret" = (Read-Host -Prompt "Enter production Google OAuth client secret" -AsSecureString | ConvertFrom-SecureString -AsPlainText)
        "oauth--microsoft--client-id" = (Read-Host -Prompt "Enter production Microsoft OAuth client ID")
        "oauth--microsoft--client-secret" = (Read-Host -Prompt "Enter production Microsoft OAuth client secret" -AsSecureString | ConvertFrom-SecureString -AsPlainText)
        "oauth--facebook--app-id" = (Read-Host -Prompt "Enter production Facebook app ID")
        "oauth--facebook--app-secret" = (Read-Host -Prompt "Enter production Facebook app secret" -AsSecureString | ConvertFrom-SecureString -AsPlainText)
    }
}

$environmentSecrets = $secrets[$Environment]

Write-ColorOutput "`n🚀 Deploying secrets to Key Vault..." "Cyan"

# Deploy secrets
$successCount = 0
$errorCount = 0

foreach ($secretName in $environmentSecrets.Keys) {
    $secretValue = $environmentSecrets[$secretName]
    
    if ($WhatIf) {
        Write-ColorOutput "WHAT-IF: Would deploy secret '$secretName'" "Yellow"
        continue
    }
    
    try {
        # Convert to secure string
        $secureValue = ConvertTo-SecureString -String $secretValue -AsPlainText -Force
        
        # Set the secret
        $result = Set-AzKeyVaultSecret -VaultName $KeyVaultName -Name $secretName -SecretValue $secureValue
        
        Write-ColorOutput "✅ Deployed secret: $secretName" "Green"
        $successCount++
    }
    catch {
        Write-ColorOutput "❌ Failed to deploy secret '$secretName': $($_.Exception.Message)" "Red"
        $errorCount++
    }
}

# Summary
Write-ColorOutput "`n📊 Deployment Summary:" "Cyan"
Write-ColorOutput "✅ Successfully deployed: $successCount secrets" "Green"
if ($errorCount -gt 0) {
    Write-ColorOutput "❌ Failed to deploy: $errorCount secrets" "Red"
}

# Verify deployed secrets
Write-ColorOutput "`n🔍 Verifying deployed secrets..." "Cyan"

foreach ($secretName in $environmentSecrets.Keys) {
    try {
        $secret = Get-AzKeyVaultSecret -VaultName $KeyVaultName -Name $secretName -ErrorAction Stop
        $status = $secret.Enabled ? "Enabled" : "Disabled"
        Write-ColorOutput "✅ $secretName - $status (Version: $($secret.Version))" "Green"
    }
    catch {
        Write-ColorOutput "❌ $secretName - Not found or no access" "Red"
    }
}

# Security reminders
Write-ColorOutput "`n🛡️ Security Reminders:" "Yellow"
Write-ColorOutput "1. Rotate secrets regularly (JWT: 90 days, OAuth: as needed)" "White"
Write-ColorOutput "2. Monitor Key Vault access logs" "White"
Write-ColorOutput "3. Review access permissions quarterly" "White"
Write-ColorOutput "4. Never log or expose secret values" "White"
Write-ColorOutput "5. Use managed identity for application access" "White"

# Next steps
Write-ColorOutput "`n📋 Next Steps:" "Cyan"
Write-ColorOutput "1. Deploy updated application configuration" "White"
Write-ColorOutput "2. Restart applications to load new secrets" "White"
Write-ColorOutput "3. Test authentication flows" "White"
Write-ColorOutput "4. Update documentation with secret rotation dates" "White"

Write-ColorOutput "`n✨ Secret deployment completed!" "Green"