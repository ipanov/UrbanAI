# Tech Context – UrbanAI

## Stack
- Backend: ASP.NET Core (.NET) with Clean Architecture
- Data:
  - EF Core for relational persistence (migrations in `src/UrbanAI.Infrastructure/Migrations`)
  - MongoDB (C# driver) for regulation documents
- API: REST, contracts referenced in `docs/api/openapi.yaml`
- Frontend: Vite + React + TypeScript (`src/UrbanAI.Frontend`)
- CI/CD: Azure Pipelines (`azure-pipelines.yml`)
- Infra as Code: Bicep (`infra/`)

## Local development
- Requirements:
  - .NET SDK (matching solution)
  - Node.js (LTS) + npm for frontend
  - Local SQL database (or connection string for EF Core)
  - MongoDB instance for regulations
- Useful commands:
  - Backend
    - `dotnet build UrbanAI.sln`
    - `dotnet test --settings coverlet.runsettings`
    - `dotnet run --project src/UrbanAI.API`
  - Frontend
    - `cd src/UrbanAI.Frontend && npm install`
    - `npm run dev`
- Configuration:
  - App settings per environment: `appsettings.{Environment}.json`
  - Example environment file: `.env.example`
  - Keep secrets out of source control (use user secrets, environment variables, or pipeline vars)

## Dependencies and patterns
- EF Core DbContext: `ApplicationDbContext` (+ factory)
- Mongo: `MongoDbContext`, `MongoDbSettings`, `RegulationDocument`
- Repository pattern via Domain interfaces implemented in Infrastructure
- DTO mapping in Application services (explicit)

## Testing
- Unit tests across layers in `tests/*`
- Integration tests for API with custom factories
- Coverage settings via `coverlet.runsettings` and `integration-coverage.runsettings`
- CI publishes coverage; high threshold enforced

## Environments
- Config files present for Development/Staging/Production under `src/UrbanAI.API/`
- Pipeline/environment variables should supply connection strings and secrets
- Production hardening:
  - Enforce HTTPS, CORS rules
  - Centralized logging/monitoring
  - Secure secret storage

## Tooling
- Editor config in `.editorconfig`
- Scripts under `scripts/` for auxiliary tasks
- MCP servers present under `mcp_servers/` for wiki tooling

## References
- Architecture: `docs/architecture-overview.md`, `docs/component_diagram.md`
- Sequence flows: `docs/sequence_diagram.md`
- API: `docs/api/openapi.yaml`
