# UrbanAI Development Tool Switcher
# Enables seamless switching between Claude Code and Cline development environments

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("claude", "cline")]
    [string]$TargetTool,

    [Parameter(Mandatory=$false)]
    [switch]$Force
)

Write-Host "🔄 UrbanAI Development Tool Switcher" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Get current git status
$gitStatus = git status --porcelain
$hasChanges = $gitStatus -and $gitStatus.Length -gt 0

# Check current branch
$currentBranch = git branch --show-current

# Define tool configurations
$claudeConfig = @{
    Branch = "develop"
    ConfigDir = ".claude"
    ToolName = "Claude Code"
    Description = "Primary development tool with latest work"
}

$clineConfig = @{
    Branch = "cline-metadata-archive"
    ConfigDir = ".cline"
    ToolName = "Cline"
    Description = "Secondary tool with memory bank and rules"
}

# Select target configuration
$targetConfig = if ($TargetTool -eq "claude") { $claudeConfig } else { $clineConfig }
$currentConfig = if ($TargetTool -eq "claude") { $clineConfig } else { $claudeConfig }

Write-Host "Target Tool: $($targetConfig.ToolName)" -ForegroundColor Yellow
Write-Host "Description: $($targetConfig.Description)" -ForegroundColor Yellow
Write-Host "Target Branch: $($targetConfig.Branch)" -ForegroundColor Yellow
Write-Host ""

# Check if we need to stash changes
if ($hasChanges) {
    Write-Host "⚠️  Uncommitted changes detected:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Red

    if (-not $Force) {
        $stashChoice = Read-Host "Do you want to stash these changes? (y/n)"
        if ($stashChoice -ne "y" -and $stashChoice -ne "Y") {
            Write-Host "❌ Operation cancelled. Please commit or stash your changes first." -ForegroundColor Red
            exit 1
        }
    }

    Write-Host "📦 Stashing current changes..." -ForegroundColor Blue
    $stashMessage = "Auto-stash: Switching to $($targetConfig.ToolName)"
    git stash push -m $stashMessage
    Write-Host "✅ Changes stashed successfully" -ForegroundColor Green
}

# Check if target branch exists
$branchExists = git branch -r | Where-Object { $_.Trim() -eq "origin/$($targetConfig.Branch)" }
if (-not $branchExists) {
    Write-Host "❌ Target branch '$($targetConfig.Branch)' does not exist on remote" -ForegroundColor Red
    exit 1
}

# Switch to target branch
Write-Host "🔄 Switching to branch: $($targetConfig.Branch)" -ForegroundColor Blue
git checkout $targetConfig.Branch

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to switch to branch $($targetConfig.Branch)" -ForegroundColor Red
    exit 1
}

# Pull latest changes
Write-Host "📥 Pulling latest changes..." -ForegroundColor Blue
git pull origin $targetConfig.Branch

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Failed to pull latest changes. Continuing..." -ForegroundColor Yellow
}

# Check if target configuration exists
$configExists = Test-Path $targetConfig.ConfigDir
if (-not $configExists) {
    Write-Host "⚠️  $($targetConfig.ConfigDir) directory not found" -ForegroundColor Yellow
    Write-Host "This might be expected if switching to a different tool configuration" -ForegroundColor Yellow
}

# Success message
Write-Host ""
Write-Host "✅ Successfully switched to $($targetConfig.ToolName)!" -ForegroundColor Green
Write-Host "Current branch: $(git branch --show-current)" -ForegroundColor Green
Write-Host "Configuration directory: $($targetConfig.ConfigDir)" -ForegroundColor Green

# Show available stashes if any exist
$stashList = git stash list
if ($stashList) {
    Write-Host ""
    Write-Host "📦 Available stashes:" -ForegroundColor Cyan
    Write-Host $stashList -ForegroundColor White
    Write-Host ""
    Write-Host "💡 To restore stashed changes: git stash pop" -ForegroundColor Cyan
}

# Show next steps
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start your preferred development tool" -ForegroundColor White
Write-Host "2. Read memory-bank/ files to understand current state" -ForegroundColor White
Write-Host "3. Continue development work" -ForegroundColor White
Write-Host ""
Write-Host "🔄 To switch back: .\scripts\switch-dev-tools.ps1 -$($currentConfig.ToolName.ToLower())" -ForegroundColor Cyan
