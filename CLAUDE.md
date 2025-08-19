# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Architecture

UrbanAI is a full-stack application built with:
- **Backend**: ASP.NET Core Web API (.NET 9) using Clean Architecture (Domain/Application/Infrastructure/API layers)
- **Frontend**: React TypeScript with Vite, using React Router for navigation
- **Database**: Supabase PostgreSQL (production) with Entity Framework Core, InMemory provider for development
- **Authentication**: OAuth2 integration with Microsoft and Google providers, JWT tokens
- **Testing**: xUnit for .NET backend, Vitest for React frontend, Playwright for E2E testing

The solution follows Clean Architecture principles with clear separation of concerns across four main projects in `src/`:
- `UrbanAI.Domain`: Core entities and interfaces
- `UrbanAI.Application`: Business logic and DTOs  
- `UrbanAI.Infrastructure`: Data access and external services
- `UrbanAI.API`: Web API controllers and configuration

## Development Commands

### Backend (.NET)
```bash
# Build entire solution
dotnet build

# Run API locally
cd src/UrbanAI.API
dotnet run

# Run all tests with coverage
dotnet test --collect:"XPlat Code Coverage" --settings coverlet.runsettings

# Run specific test project
dotnet test tests/UrbanAI.API.Tests/
dotnet test tests/UrbanAI.Application.Tests/
dotnet test tests/UrbanAI.Domain.Tests/
dotnet test tests/UrbanAI.Infrastructure.Tests/
dotnet test tests/UrbanAI.API.IntegrationTests/

# Integration tests require special coverage settings
dotnet test tests/UrbanAI.API.IntegrationTests/ --collect:"XPlat Code Coverage" --settings integration-coverage.runsettings
```

### Frontend (React)
```bash
cd src/UrbanAI.Frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run unit tests
npm run test

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests (requires backend running)
npm run test:e2e

# Run complete test suite
npm run test:complete

# Start both backend proxy and frontend
npm run start:all
```

### Git Branching
Follow Azure DevOps Work Item integration:
- Branch naming: `feature/WI-ID-short-description` (e.g., `feature/37-setup-integration-tests`)
- PR titles: `[Type]: WI-ID - Short description` (e.g., `feat: 37 - Setup Integration Tests Project`)

## Key Configuration Files

- **Backend**: `src/UrbanAI.API/appsettings.json` - API configuration including database connections and OAuth settings
- **Frontend**: `src/UrbanAI.Frontend/src/config/api.ts` - API endpoints and configuration
- **Tests**: `coverlet.runsettings` and `integration-coverage.runsettings` for test coverage configuration
- **E2E**: `src/UrbanAI.Frontend/playwright.config.ts` for Playwright configuration

## Database Setup

The application uses different database providers by environment:
- **Development**: InMemory database (EF Core) for quick setup
- **Production/Staging**: Supabase PostgreSQL with Entity Framework Core
- **Testing**: InMemory provider configured in test factories

Database context is configured in `src/UrbanAI.Infrastructure/Data/ApplicationDbContext.cs`.

## Authentication Architecture

OAuth2 flow implemented with:
- **Providers**: Microsoft and Google OAuth
- **Flow**: Authorization code flow with PKCE
- **Tokens**: JWT tokens for API authentication
- **Session**: ASP.NET Core sessions for OAuth state management
- **Frontend**: React components handle OAuth redirects and token management