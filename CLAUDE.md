# UrbanAI Project Context

This file provides guidance to Claude Code when working with code in this repository.

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
Follow GitHub workflow:
- Branch naming: `feature/description` (e.g., `feature/oauth-integration`)
- Commit directly to develop branch for now
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`

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

## Mobile App Development Guidelines

When creating mobile applications:
- Follow existing project structure: create mobile app as `src/UrbanAI.Mobile/`
- Reuse existing API types, constants, and configuration from `src/UrbanAI.Frontend/`
- Share common components, utilities, and styles between web and mobile
- Use React Native with TypeScript following same patterns as web app
- Maintain consistency with existing OAuth, API endpoints, and backend integration
- Never start new projects outside the existing solution structure
- Always check existing shared code before creating new implementations

## Mission and Scope

**Mission**: Provide a structured platform for reporting, triaging, and resolving urban issues while linking cases to relevant regulations and supporting operators with an AI assistant.

**Current Scope (v1)**:
- Backend Clean Architecture (API, Application, Domain, Infrastructure)
- Issue lifecycle (create/read/update)
- Basic auth scaffolding with OAuth
- REST API contracts
- Frontend scaffold (Vite + React + TS) consuming API
- CI with tests and coverage

**Non-goals**: Advanced workflow automation, complex AI planning, multi-tenant support

## Stakeholders
- **Citizens**: submit issues, receive confirmations/status
- **Municipal operators**: review, update, resolve issues, reference regulations, generate reports
- **Administrators**: configure integrations, monitor compliance and system health

## Technology Patterns

### Clean Architecture Implementation
- **API Layer**: Controllers are thin, handle HTTP concerns only
- **Application Layer**: Business logic, DTOs, service interfaces
- **Domain Layer**: Entities, value objects, domain interfaces
- **Infrastructure Layer**: Data access, external services, implements domain interfaces

### Data Access Patterns
- Entity Framework Core for relational data with migrations
- Repository pattern for data access abstraction
- DTOs for API data transfer, mapped in Application services

### Testing Patterns
- Unit tests for business logic in Application and Domain layers
- Integration tests for API endpoints and database operations
- E2E tests for critical user flows
- Comprehensive test coverage with reporting

### Frontend Patterns
- Component-based architecture with React
- TypeScript for type safety
- Vite for fast development and building
- API integration through centralized service layer

## Current Development Context

**Recent Changes**: 
- Migrated from Cline AI assistant to Claude Code
- Consolidated OAuth functionality to use v1/oauth endpoints
- Removed Azure DevOps dependencies, using GitHub ecosystem
- No longer using Figma, using HTML mocks instead
- Cleaned up codebase, removed duplicate code and unused files

**Active Focus**: Streamlining development tools and maintaining clean architecture while building core urban issue reporting functionality.

## Important Reminders

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- Follow existing code conventions and patterns
- Keep changes incremental and auditable
- Respect the Clean Architecture boundaries