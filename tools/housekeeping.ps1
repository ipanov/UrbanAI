[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

# Move to repo root
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $root

# Targets to remove
$removePaths = @(
  'temp',
  'UrbanAI.git',
  'scripts',
  'dist',
  'src/UrbanAI.Frontend/dist'
)

foreach ($p in $removePaths) {
  if (Test-Path -LiteralPath $p) {
    try {
      Get-ChildItem -Path $p -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object {
        try { $_.Attributes = 'Normal' } catch {}
      }
      Remove-Item -LiteralPath $p -Recurse -Force
      Write-Host "Removed: $p"
    } catch {
      Write-Warning "Failed to remove: $p. $($_.Exception.Message)"
    }
  }
}

# Ensure .gitignore contains patterns
$gitignorePath = Join-Path $root '.gitignore'
if (-not (Test-Path $gitignorePath)) {
  New-Item -ItemType File -Path $gitignorePath -Force | Out-Null
}
$patterns = @(
  '# Housekeeping',
  'temp/',
  'UrbanAI.git/',
  'scripts/',
  'dist/',
  'src/UrbanAI.Frontend/dist/'
)
$existing = Get-Content $gitignorePath -ErrorAction SilentlyContinue
foreach ($line in $patterns) {
  if ($existing -notcontains $line) {
    Add-Content -Path $gitignorePath -Value $line
  }
}

# Untrack removed/ignored items from Git index if present
$toUntrack = @(
  'temp',
  'UrbanAI.git',
  'scripts',
  'dist',
  'src/UrbanAI.Frontend/dist'
)
foreach ($i in $toUntrack) {
  cmd /c ('git rm -r --cached --ignore-unmatch "{0}"' -f $i) | Out-Null
}

# Stage and commit (ignore if nothing to commit)
cmd /c "git add -A" | Out-Null
$commitCmd = 'git commit -m "Housekeeping: remove temp, scripts, UrbanAI.git; ignore build artifacts"'
$global:LASTEXITCODE = 0
cmd /c $commitCmd | Out-Null
$commitExit = $LASTEXITCODE
if ($commitExit -ne 0) {
  Write-Host "Nothing to commit or commit skipped (exit $commitExit)"
}

# Build .NET solution
cmd /c "dotnet restore UrbanAI.sln"
cmd /c "dotnet build UrbanAI.sln -c Release"

# Optional: build frontend if present (won't fail the script)
$frontendDir = Join-Path $root 'src/UrbanAI.Frontend'
if (Test-Path (Join-Path $frontendDir 'package.json')) {
  Push-Location $frontendDir
  try {
    cmd /c "npm ci"
    cmd /c "npm run build"
  } catch {
    Write-Warning "Frontend build failed or npm unavailable: $($_.Exception.Message)"
  } finally {
    Pop-Location
  }
}

Write-Host "Housekeeping and build complete."
