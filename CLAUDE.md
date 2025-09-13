# UrbanAI Project Context

This file provides guidance to Claude Code when working with code in this repository.

## Core Architecture

UrbanAI is a full-stack application built with:
- **Backend**: ASP.NET Core Web API (.NET 9) using Clean Architecture (Domain/Application/Infrastructure/API layers)
- **Alternative Backend**: Azure Functions (.NET 9) for serverless event-driven architecture (future scaling)
- **Frontend**: React TypeScript with Vite, using React Router for navigation  
- **Database**: Azure SQL Database (production) + Azure Cosmos DB MongoDB API, InMemory provider for development
- **Authentication**: OAuth2 integration with Microsoft and Google providers, JWT tokens
- **Hosting**: Microsoft Azure (cost-optimized at $4.90/month for MVP)
- **Testing**: xUnit for .NET backend, Vitest for React frontend, Playwright for E2E testing

The solution follows Clean Architecture principles with clear separation of concerns across projects in `src/`:
- `UrbanAI.Domain`: Core entities and interfaces
- `UrbanAI.Application`: Business logic and DTOs  
- `UrbanAI.Infrastructure`: Data access and external services
- `UrbanAI.API`: Web API controllers and configuration (primary backend)
- `UrbanAI.Functions`: Azure Functions for serverless/event-driven architecture (alternative backend)

## Development Commands

### Backend (.NET)
```bash
# Build entire solution
dotnet build

# Run API locally (FORBIDDEN - use startup script instead)
# cd src/UrbanAI.API
# dotnet run  # ❌ NEVER USE

# MANDATORY: Start development servers (ONLY ACCEPTABLE METHOD)
node .claude/scripts/start-development-servers.js

# Run Azure Functions locally (alternative backend)
cd src/UrbanAI.Functions
func start

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

# Start development server (FORBIDDEN - use startup script instead)
# npm run dev  # ❌ NEVER USE

# MANDATORY: Start development servers (ONLY ACCEPTABLE METHOD)
node .claude/scripts/start-development-servers.js

# Build for production
npm run build

# Run unit tests
npm run test

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests (requires backend running)
npm run test:e2e

# Run E2E tests with specific project (optimized)
npx playwright test --project=chromium-fast          # Fast embedded browser tests
npx playwright test --project=smoke                  # Critical path smoke tests  
npx playwright test --project=firefox-validation     # Cross-browser validation
npx playwright test --project=chrome-branded         # Real browser validation

# Run visual regression tests (MANDATORY for UI changes)
npm run test:e2e:visual

# Run E2E tests in debug mode (headed)
LOCAL_DEBUG=true npx playwright test

# Run complete test suite
npm run test:complete

# Start both backend proxy and frontend
npm run start:all
```

### Azure Deployment
```bash
# Deploy infrastructure and application
azd up -e production

# Deploy Functions only
cd src/UrbanAI.Functions
func azure functionapp publish urbanai-func-production-{token}

# Deploy API only  
az webapp deploy --resource-group urbanai-rg --name urbanai-api-production-{token} --src-path src/UrbanAI.API
```

### Git Branching
Follow GitHub workflow:
- Branch naming: `feature/description` (e.g., `feature/oauth-integration`)
- Commit directly to develop branch for now
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`

## Key Configuration Files

- **Backend**: `src/UrbanAI.API/appsettings.json` - API configuration including database connections and OAuth settings
- **Functions**: `src/UrbanAI.Functions/local.settings.json` - Azure Functions local development settings
- **Frontend**: `src/UrbanAI.Frontend/src/config/api.ts` - API endpoints and configuration
- **Infrastructure**: `infra/main.bicep` - Azure infrastructure as code
- **Deployment**: `azure.yaml` - Azure Developer CLI configuration
- **Tests**: `coverlet.runsettings` and `integration-coverage.runsettings` for test coverage configuration
- **E2E**: `src/UrbanAI.Frontend/playwright.config.ts` for Playwright configuration

## Database Setup

The application uses different database providers by environment:
- **Development**: InMemory database (EF Core) for quick setup
- **Production**: Azure SQL Database (relational) + Azure Cosmos DB MongoDB API (documents)
- **Testing**: InMemory provider configured in test factories

Database context is configured in `src/UrbanAI.Infrastructure/Data/ApplicationDbContext.cs`.

## Azure Architecture & Cost

**MVP Phase (Cost: $4.90/month)**:
- Azure SQL Database Basic ($4.90/month, 2GB, 5 DTUs)
- Azure Cosmos DB MongoDB API Free Tier (1000 RU/s, 25GB)
- Azure Functions/App Service F1 Free Tier
- Azure Storage Account (minimal cost for Functions)

**Future Event-Driven Phase (Cost: ~$25-50/month)**:
- Azure Service Bus for message queuing
- Azure SignalR for real-time LLM chat
- Azure OpenAI for AI agents
- Container Apps for microservices scaling

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

### Backend Testing (.NET)
- Unit tests for business logic in Application and Domain layers
- Integration tests for API endpoints and database operations
- Comprehensive test coverage with reporting

### Frontend Testing (React/Playwright)
- **Unit Tests**: Co-located with components using Vitest and React Testing Library
- **E2E Tests**: Located in `src/UrbanAI.Frontend/tests/e2e/` using Playwright
- **Browser Strategy**: Embedded Chromium for speed and reliability, real browsers for final validation only
- **Test Organization**: 
  - `*.spec.ts` - Standard E2E tests (embedded Chromium)
  - `*smoke*.spec.ts` - Critical path smoke tests 
  - `*mobile*.spec.ts` - Mobile viewport tests
  - `*production*.spec.ts` - Real browser validation tests
- **Performance**: Optimized for fast feedback with 15s action timeouts and parallel execution
- **CI/CD**: Smoke tests on every commit, full regression nightly, cross-browser pre-release

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

## 🚨 CRITICAL: MANDATORY PORT COMPLIANCE RULES

**ABSOLUTE PROHIBITION: NEVER CHANGE OR OVERRIDE DEVELOPMENT PORTS**

### 🔒 ENFORCED DEVELOPMENT PORTS (NO EXCEPTIONS):
- **API Server**: Port **5001** ONLY (from `src/UrbanAI.API/Properties/launchSettings.json`)
- **Frontend Server**: Port **3000** ONLY (from `src/UrbanAI.API/appsettings.json` OAuth config)

### ❌ FORBIDDEN ACTIONS:
- ❌ **NEVER** use `--urls` parameter to override API port
- ❌ **NEVER** use `--port`, `-p`, or `PORT=` to override frontend port  
- ❌ **NEVER** start servers on ports 3100, 5101, 4173, 5173, or any non-config ports
- ❌ **NEVER** ask user about port changes or conflicts
- ❌ **NEVER** suggest port modifications for "avoiding conflicts"

### ✅ MANDATORY PROCESS BEFORE STARTING SERVERS:
1. **ALWAYS** run: `node .claude/scripts/start-development-servers.js`
2. **NEVER** start servers manually with `dotnet run` or `npm run dev`
3. **ALWAYS** kill ALL existing processes before starting
4. **ALWAYS** validate ports match configuration files exactly

### 🛡️ ENFORCEMENT WORKFLOW:
```bash
# ONLY ACCEPTABLE WAY TO START DEVELOPMENT SERVERS:
node .claude/scripts/start-development-servers.js

# FORBIDDEN COMMANDS - NEVER USE:
# ❌ dotnet run --urls http://localhost:XXXX
# ❌ PORT=XXXX npm run dev
# ❌ npm run dev -- --port XXXX
```

### 🚨 VIOLATION CONSEQUENCES:
- **Immediate termination** of incorrect processes
- **Mandatory restart** using correct script
- **Task failure** until ports are corrected
- **No exceptions** - configuration is sacred

**THIS IS NON-NEGOTIABLE. PORT VIOLATIONS WILL NEVER BE TOLERATED.**

## 🎨 MANDATORY Visual Validation Rules

**ALL FRONTEND/UI TASKS MUST INCLUDE VISUAL VALIDATION:**

### Before Marking Any Frontend Task Complete:
1. **MANDATORY**: Take screenshots of implementation using Playwright MCP server (multi-browser, multi-viewport)
2. **MANDATORY**: Compare with corresponding HTML mockup in `mocks/` folder
3. **MANDATORY**: Run visual comparison: `node .claude/scripts/visual-compare.js <component-name>`
4. **MANDATORY**: Validate responsive design (desktop, tablet, mobile with real device profiles)
5. **MANDATORY**: Test interactive states (hover, focus, active, disabled) programmatically
6. **MANDATORY**: Measure Core Web Vitals and accessibility compliance
7. **MANDATORY**: Iterate implementation until pixel-perfect match achieved

### Visual Validation Workflow:
```bash
# 1. Initialize reference system (run once)
node .claude/scripts/capture-reference-screenshots.js

# 2. For each component implementation:
# - Take implementation screenshots with Playwright MCP (multi-browser, multi-viewport)
# - Compare with HTML mockup reference
# - Test interactive states programmatically
# - Run comparison tool
node .claude/scripts/visual-compare.js "component-name"

# 3. Run visual regression tests
npm run test:e2e:visual

# 4. Enhanced validation hook runs automatically after MultiEdit
```

### Failure Criteria - Task NOT Complete If:
- ❌ No visual comparison performed with HTML mockups
- ❌ Layout differs significantly from mockup design  
- ❌ Colors, typography, or spacing incorrect
- ❌ Responsive design broken on mobile/tablet
- ❌ Interactive states missing or non-functional
- ❌ No implementation screenshot provided

### Success Criteria - Task Complete Only When:
- ✅ Implementation screenshot matches HTML mockup reference
- ✅ Responsive design validated across all breakpoints  
- ✅ Interactive states function as designed
- ✅ Visual comparison checklist completed
- ✅ Enhanced validation hooks pass without errors

**NO EXCEPTIONS: All frontend agents and Claude Code MUST follow this visual validation workflow.**

## Testing Guidelines for Claude Code

### QA Engineer Persona Available
- Use the QA engineer persona (`qa-engineer.md`) for all testing-related tasks
- Specialized in Playwright, React Testing Library, and modern testing practices
- Optimized for 2025 testing standards with embedded browser strategy

### E2E Testing Best Practices
- **Always use embedded browsers** (Playwright's Chromium) unless specifically testing real browser features
- **Prioritize test speed** - Use 15s action timeouts and optimized configurations
- **Test user-visible behavior** - Focus on actual user interactions, not implementation details
- **Maintain test isolation** - Each test should be independent and use fresh browser contexts
- **Smart browser selection**:
  - Smoke tests: `chromium-fast` project for every commit
  - Cross-browser: `firefox-validation`, `webkit-validation` for nightly runs
  - Real browser: `chrome-branded` project only for production validation

### Test Organization Standards
- Keep E2E tests in the same project as frontend code (`src/project/tests/e2e/`)
- Co-locate unit tests with components (`__tests__/` folders)
- Use proper naming conventions for test targeting
- Implement Page Object Model for maintainability