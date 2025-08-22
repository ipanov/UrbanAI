#!/usr/bin/env pwsh

# UrbanAI Comprehensive Test Script
# Runs all tests across the solution: unit, integration, and E2E tests

param(
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild,
    
    [Parameter(Mandatory=$false)]
    [switch]$Coverage,
    
    [Parameter(Mandatory=$false)]
    [switch]$CI
)

Write-Host "🚀 Starting UrbanAI Comprehensive Test Suite" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

$ErrorActionPreference = "Stop"
$startTime = Get-Date

# Function to run command and check exit code
function Invoke-Command-Safe {
    param([string]$Command, [string]$Description)
    
    Write-Host "📋 $Description" -ForegroundColor Cyan
    Write-Host "   Command: $Command" -ForegroundColor Gray
    
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ $Description failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "✅ $Description completed successfully" -ForegroundColor Green
    Write-Host ""
}

try {
    # Step 1: Build the solution (unless skipped)
    if (!$SkipBuild) {
        Invoke-Command-Safe "dotnet build --configuration Release" "Building .NET solution"
    } else {
        Write-Host "⏭️  Skipping build step" -ForegroundColor Yellow
    }

    # Step 2: Run backend unit tests
    Write-Host "🧪 Running Backend Unit Tests" -ForegroundColor Blue
    Write-Host "==============================" -ForegroundColor Blue
    
    if ($Coverage) {
        Invoke-Command-Safe "dotnet test tests/UrbanAI.Domain.Tests/ --collect:`"XPlat Code Coverage`" --settings coverlet.runsettings --logger trx" "Domain Unit Tests with Coverage"
        Invoke-Command-Safe "dotnet test tests/UrbanAI.Application.Tests/ --collect:`"XPlat Code Coverage`" --settings coverlet.runsettings --logger trx" "Application Unit Tests with Coverage"
        Invoke-Command-Safe "dotnet test tests/UrbanAI.Infrastructure.Tests/ --collect:`"XPlat Code Coverage`" --settings coverlet.runsettings --logger trx" "Infrastructure Unit Tests with Coverage"
        Invoke-Command-Safe "dotnet test tests/UrbanAI.API.Tests/ --collect:`"XPlat Code Coverage`" --settings coverlet.runsettings --logger trx" "API Unit Tests with Coverage"
    } else {
        Invoke-Command-Safe "dotnet test tests/UrbanAI.Domain.Tests/ --logger trx" "Domain Unit Tests"
        Invoke-Command-Safe "dotnet test tests/UrbanAI.Application.Tests/ --logger trx" "Application Unit Tests"
        Invoke-Command-Safe "dotnet test tests/UrbanAI.Infrastructure.Tests/ --logger trx" "Infrastructure Unit Tests"
        Invoke-Command-Safe "dotnet test tests/UrbanAI.API.Tests/ --logger trx" "API Unit Tests"
    }

    # Step 3: Run backend integration tests
    Write-Host "🔗 Running Backend Integration Tests" -ForegroundColor Blue
    Write-Host "=====================================" -ForegroundColor Blue
    
    if ($Coverage) {
        Invoke-Command-Safe "dotnet test tests/UrbanAI.API.IntegrationTests/ --collect:`"XPlat Code Coverage`" --settings integration-coverage.runsettings --logger trx" "API Integration Tests with Coverage"
    } else {
        Invoke-Command-Safe "dotnet test tests/UrbanAI.API.IntegrationTests/ --logger trx" "API Integration Tests"
    }

    # Step 4: Frontend tests
    Write-Host "⚛️  Running Frontend Tests" -ForegroundColor Blue
    Write-Host "===========================" -ForegroundColor Blue
    
    Push-Location "src/UrbanAI.Frontend"
    try {
        # TypeScript compilation check
        Invoke-Command-Safe "npm run type-check" "TypeScript Compilation Check"
        
        # ESLint checks
        Invoke-Command-Safe "npm run lint" "ESLint Code Quality Check"
        
        # Unit tests
        if ($Coverage) {
            Invoke-Command-Safe "npm run test:coverage" "Frontend Unit Tests with Coverage"
        } else {
            Invoke-Command-Safe "npm run test" "Frontend Unit Tests"
        }
        
        # E2E tests
        Write-Host "🎭 Running End-to-End Tests" -ForegroundColor Blue
        Write-Host "============================" -ForegroundColor Blue
        
        if ($CI) {
            Invoke-Command-Safe "npm run test:e2e:ci" "Playwright E2E Tests (CI Mode)"
        } else {
            Invoke-Command-Safe "npm run test:e2e:all" "Playwright E2E Tests"
        }
        
    } finally {
        Pop-Location
    }

    # Step 5: Test Results Summary
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    Write-Host "🎉 All Tests Completed Successfully!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "Total Duration: $($duration.ToString('mm\:ss'))" -ForegroundColor Green
    Write-Host ""
    Write-Host "Test Results:" -ForegroundColor Cyan
    Write-Host "• ✅ Domain Unit Tests" -ForegroundColor Green
    Write-Host "• ✅ Application Unit Tests" -ForegroundColor Green  
    Write-Host "• ✅ Infrastructure Unit Tests" -ForegroundColor Green
    Write-Host "• ✅ API Unit Tests" -ForegroundColor Green
    Write-Host "• ✅ API Integration Tests" -ForegroundColor Green
    Write-Host "• ✅ Frontend Unit Tests" -ForegroundColor Green
    Write-Host "• ✅ Frontend E2E Tests" -ForegroundColor Green
    Write-Host ""
    
    if ($Coverage) {
        Write-Host "📊 Coverage reports generated in TestResults/ directories" -ForegroundColor Yellow
    }
    
    Write-Host "🚢 Ready for deployment to main branch!" -ForegroundColor Green

} catch {
    Write-Host "❌ Test suite failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}