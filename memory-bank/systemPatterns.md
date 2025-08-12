# System Patterns – UrbanAI

## Architecture
- Clean Architecture layering:
  - API → Application → Domain
  - Infrastructure implements Domain interfaces and is referenced by API (composition root)
- Cross-layer contracts via DTOs and interfaces
- Separation of concerns: controllers thin, business logic in Application, pure models in Domain

## Components and relationships
- UrbanAI.API
  - ASP.NET Core minimal hosting (`Program.cs`)
  - Controllers: `AuthController`, `IssuesController`
  - Maps HTTP to Application services/DTOs
- UrbanAI.Application
  - DTOs: `AuthRequestDto`, `AuthResponseDto`, `IssueDto`, `CreateIssueRequestDto`, `CreateIssueResponseDto`, `UpdateIssueRequestDto`
  - Services: `IssueService`, `RegulationService`, `UserService`
  - Interfaces: `IIssueService`, `IRegulationService`
- UrbanAI.Domain
  - Entities: `Issue`, `Regulation`, `User`
  - Interfaces: `IIssueRepository`, `IRegulationRepository`
  - Base model: `BaseEntity` (Id, timestamps, etc.)
- UrbanAI.Infrastructure
  - EF Core: `ApplicationDbContext`, factory, `IssueConfiguration`, Migrations
  - Mongo: `MongoDbContext`, `MongoDbSettings`, `RegulationDocument` model
  - Repositories: `IssueRepository`, `RegulationRepository`

## Data patterns
- Relational persistence with EF Core Migrations (design-time factory present)
- Document storage in MongoDB for regulations
- Repository pattern:
  - Domain defines repository interfaces
  - Infrastructure provides implementations
- DTO ↔ Entity mapping done in Application layer (explicit mapping in services)

## API patterns
- REST endpoints per `docs/api/openapi.yaml`
  - Example: `POST /v1/issues` (Create Issue), consistent with `docs/sequence_diagram.md`
- Controllers validate/map DTOs, delegate to Application services
- Consistent 201/200/404 semantics for CRUD endpoints

## Testing patterns
- Unit tests for Domain, Application, API controllers
- Integration tests for API with custom web application factories (authenticated/unauthenticated)
- Infrastructure tests for DbContext factory, Mongo settings/context, repositories
- Coverage enforced in CI (Cobertura; high threshold)

## Configuration and environments
- `appsettings.json` per environment (Development/Staging/Production)
- Connection strings and secrets externalized; example `.env.example`
- `.editorconfig` present for code style consistency

## Frontend alignment
- Vite + React + TypeScript scaffold under `src/UrbanAI.Frontend`
- Design system and UX specs in `docs/design-system/*` and `docs/figma_project.md`
- Frontend should consume REST API as source of truth

## DevOps/Infra
- Azure Pipelines (`azure-pipelines.yml`) builds, tests, publishes coverage
- Bicep IaC under `infra/` for Azure resource provisioning
- Runsettings for coverage (`coverlet.runsettings`, `integration-coverage.runsettings`)

## Key decisions
- Clean Architecture boundaries are enforced; Infrastructure is replaceable
- EF Core for transactional/stateful data; MongoDB for regulation documents
- Keep AI Agent integrations behind Application abstractions for future evolution
- Documentation-first: diagrams and OpenAPI define contracts

## References
- Component diagram: `docs/component_diagram.md`
- Sequence diagram: `docs/sequence_diagram.md`
- OpenAPI: `docs/api/openapi.yaml`
- Architecture overview: `docs/architecture-overview.md`
