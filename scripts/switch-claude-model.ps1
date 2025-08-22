#!/usr/bin pwsh

<#
.SYNOPSIS
Switches between Claude model configurations
.DESCRIPTION
This script allows you to easily switch between GLM-4.5 Air (free) and Claude Sonnet 4 (paid) configurations.
.PARAMETER model
The model to switch to: "glm45" or "sonnet4"
.EXAMPLE
.\switch-claude-model.ps1 glm45    # Switch to GLM-4.5 Air (free)
.\switch-claude-model.ps1 sonnet4  # Switch to Claude Sonnet 4
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("glm45", "sonnet4")]
    [string]$model
)

$claudeDir = ".claude"
$currentSettings = "$claudeDir/settings.local.json"
$glm45Settings = "$claudeDir/settings-glm45.json"
$sonnet4Settings = "$claudeDir/settings-sonnet4.json"

function Show-Usage {
    Write-Host "Usage: .\switch-claude-model.ps1 <glm45|sonnet4>" -ForegroundColor Yellow
    Write-Host "  glm45  - Switch to GLM-4.5 Air (free via OpenRouter)" -ForegroundColor Green
    Write-Host "  sonnet4 - Switch to Claude Sonnet 4" -ForegroundColor Cyan
    exit 1
}

# Check if required files exist
if (-not (Test-Path $glm45Settings)) {
    Write-Host "Error: GLM-4.5 Air configuration not found at $glm45Settings" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $sonnet4Settings)) {
    Write-Host "Error: Sonnet 4 configuration not found at $sonnet4Settings" -ForegroundColor Red
    exit 1
}

# Switch to the requested model
switch ($model) {
    "glm45" {
        Write-Host "Switching to GLM-4.5 Air (free via OpenRouter)..." -ForegroundColor Green
        if (Test-Path $currentSettings) {
            Remove-Item $currentSettings
        }
        Copy-Item $glm45Settings $currentSettings
        Write-Host "✅ Successfully switched to GLM-4.5 Air" -ForegroundColor Green
        Write-Host "💡 Note: Make sure to set your OpenRouter API key in $currentSettings" -ForegroundColor Yellow
    }
    
    "sonnet4" {
        Write-Host "Switching to Claude Sonnet 4..." -ForegroundColor Cyan
        if (Test-Path $currentSettings) {
            Remove-Item $currentSettings
        }
        Copy-Item $sonnet4Settings $currentSettings
        Write-Host "✅ Successfully switched to Claude Sonnet 4" -ForegroundColor Cyan
    }
    
    default {
        Show-Usage
    }
}

Write-Host ""
Write-Host "Current configuration:" -ForegroundColor White
Get-Content $currentSettings | ConvertFrom-Json | ConvertTo-Json -Depth 3
