<#
.SYNOPSIS
Starts the TalkToFigma (cursor-talk-to-figma-socket) WebSocket server used by the UrbanAI MCP client.

.DESCRIPTION
Reads FIGMA_API_KEY from .env (if present) or current environment and launches the socket server via bunx.
Requires: bun (or falls back to npx) installed, and a valid Figma personal access token.

.USAGE
  powershell -ExecutionPolicy Bypass -File .\scripts\start-talktofigma.ps1

Optional parameters:
  -Port  -- override default port 11435
  -Verbose
#>
param(
  [int]$Port = 11435
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Import-DotEnv {
  param([string]$Path = '.env')
  if (Test-Path $Path) {
    Get-Content $Path |
      Where-Object { $_ -match '=' -and ($_ -notmatch '^#') } |
      ForEach-Object {
        $name,$value = $_ -split '=',2
        if (-not [string]::IsNullOrWhiteSpace($name)) {
          $trimmedName = $name.Trim()
          if (-not (Get-Item -Path Env: | Where-Object { $_.Name -eq $trimmedName })) {
            Set-Item -Path Env:$trimmedName -Value ($value.Trim()) | Out-Null
          }
        }
      }
  }
}

Import-DotEnv

if (-not $env:FIGMA_API_KEY) {
  Write-Error 'FIGMA_API_KEY not set. Add FIGMA_API_KEY=your_token to .env or environment.'
  exit 1
}

Write-Host "Starting TalkToFigma socket on port $Port..." -ForegroundColor Cyan

# Prefer bunx if available, else npx
$bun = Get-Command bun -ErrorAction SilentlyContinue
if ($bun) {
  & bunx cursor-talk-to-figma-socket --figma-api-key $env:FIGMA_API_KEY --port $Port
} else {
  & npx -y cursor-talk-to-figma-socket --figma-api-key $env:FIGMA_API_KEY --port $Port
}

if ($LASTEXITCODE -ne 0) {
  Write-Error "TalkToFigma server exited with code $LASTEXITCODE"
}
