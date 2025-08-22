#!/bin/bash

# UrbanAI Comprehensive Test Script
# Runs all tests across the solution: unit, integration, and E2E tests

set -e  # Exit on any error

# Parse command line arguments
SKIP_BUILD=false
COVERAGE=false
CI=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --ci)
            CI=true
            shift
            ;;
        *)
            echo "Unknown option $1"
            echo "Usage: $0 [--skip-build] [--coverage] [--ci]"
            exit 1
            ;;
    esac
done

echo "🚀 Starting UrbanAI Comprehensive Test Suite"
echo "================================================"

START_TIME=$(date +%s)

# Function to run command and check exit code
run_command() {
    local command="$1"
    local description="$2"
    
    echo "📋 $description"
    echo "   Command: $command"
    
    if eval "$command"; then
        echo "✅ $description completed successfully"
        echo ""
    else
        echo "❌ $description failed with exit code $?"
        exit 1
    fi
}

# Step 1: Build the solution (unless skipped)
if [ "$SKIP_BUILD" = false ]; then
    run_command "dotnet build --configuration Release" "Building .NET solution"
else
    echo "⏭️  Skipping build step"
fi

# Step 2: Run backend unit tests
echo "🧪 Running Backend Unit Tests"
echo "=============================="

if [ "$COVERAGE" = true ]; then
    run_command "dotnet test tests/UrbanAI.Domain.Tests/ --collect:\"XPlat Code Coverage\" --settings coverlet.runsettings --logger trx" "Domain Unit Tests with Coverage"
    run_command "dotnet test tests/UrbanAI.Application.Tests/ --collect:\"XPlat Code Coverage\" --settings coverlet.runsettings --logger trx" "Application Unit Tests with Coverage"
    run_command "dotnet test tests/UrbanAI.Infrastructure.Tests/ --collect:\"XPlat Code Coverage\" --settings coverlet.runsettings --logger trx" "Infrastructure Unit Tests with Coverage"
    run_command "dotnet test tests/UrbanAI.API.Tests/ --collect:\"XPlat Code Coverage\" --settings coverlet.runsettings --logger trx" "API Unit Tests with Coverage"
else
    run_command "dotnet test tests/UrbanAI.Domain.Tests/ --logger trx" "Domain Unit Tests"
    run_command "dotnet test tests/UrbanAI.Application.Tests/ --logger trx" "Application Unit Tests"
    run_command "dotnet test tests/UrbanAI.Infrastructure.Tests/ --logger trx" "Infrastructure Unit Tests"
    run_command "dotnet test tests/UrbanAI.API.Tests/ --logger trx" "API Unit Tests"
fi

# Step 3: Run backend integration tests
echo "🔗 Running Backend Integration Tests"
echo "====================================="

if [ "$COVERAGE" = true ]; then
    run_command "dotnet test tests/UrbanAI.API.IntegrationTests/ --collect:\"XPlat Code Coverage\" --settings integration-coverage.runsettings --logger trx" "API Integration Tests with Coverage"
else
    run_command "dotnet test tests/UrbanAI.API.IntegrationTests/ --logger trx" "API Integration Tests"
fi

# Step 4: Frontend tests
echo "⚛️  Running Frontend Tests"
echo "==========================="

cd src/UrbanAI.Frontend

# TypeScript compilation check
run_command "npm run type-check" "TypeScript Compilation Check"

# ESLint checks
run_command "npm run lint" "ESLint Code Quality Check"

# Unit tests
if [ "$COVERAGE" = true ]; then
    run_command "npm run test:coverage" "Frontend Unit Tests with Coverage"
else
    run_command "npm run test" "Frontend Unit Tests"
fi

# E2E tests
echo "🎭 Running End-to-End Tests"
echo "============================"

if [ "$CI" = true ]; then
    run_command "npm run test:e2e:ci" "Playwright E2E Tests (CI Mode)"
else
    run_command "npm run test:e2e:all" "Playwright E2E Tests"
fi

cd ../..

# Step 5: Test Results Summary
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo "🎉 All Tests Completed Successfully!"
echo "===================================="
printf "Total Duration: %02d:%02d\n" $MINUTES $SECONDS
echo ""
echo "Test Results:"
echo "• ✅ Domain Unit Tests"
echo "• ✅ Application Unit Tests"
echo "• ✅ Infrastructure Unit Tests"
echo "• ✅ API Unit Tests"
echo "• ✅ API Integration Tests"
echo "• ✅ Frontend Unit Tests"
echo "• ✅ Frontend E2E Tests"
echo ""

if [ "$COVERAGE" = true ]; then
    echo "📊 Coverage reports generated in TestResults/ directories"
fi

echo "🚢 Ready for deployment to main branch!"