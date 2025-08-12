# Cline Custom Instructions – UrbanAI

These instructions tailor Cline’s behavior for the UrbanAI repository. They summarize our Memory Bank workflow, coding conventions, architecture, and safety practices so Cline and contributors stay aligned.

## How Cline must start every task
1) Load Memory Bank core files (required):
   - `memory-bank/projectbrief.md`
   - `memory-bank/productContext.md`
   - `memory-bank/systemPatterns.md`
   - `memory-bank/techContext.md`
   - `memory-bank/activeContext.md`
   - `memory-bank/progress.md`
2) Skim relevant docs for the area of work:
   - API contracts: `docs/api/openapi.yaml`
   - Architecture: `docs/architecture-overview.md`, `docs/component_diagram.md`, `docs/sequence_diagram.md`, `docs/architecture/*`
   - Design system and personas: `docs/design-system/*`, `docs/personas/*`
3) Confirm understanding (Plan Mode), then act (Act Mode).

## Memory Bank rules
- Keep Memory Bank as the single source of truth for project context between sessions.
- Update Memory Bank when:
  - New patterns or architectural decisions are made
  - Significant code changes land
  - The user requests a Memory Bank update
  - Ambiguity is discovered and resolved
- Files build in hierarchy:
  - projectbrief → productContext, systemPatterns, techContext → activeContext → progress

## Architecture and conventions
- Clean Architecture with clear layers:
  - API (entrypoint) → Application (use cases, DTOs) → Domain (entities, interfaces)
  - Infrastructure (EF Core, MongoDB, repositories) implements Domain interfaces
- Data:
  - EF Core for relational/stateful data (`src/UrbanAI.Infrastructure/Migrations`)
  - MongoDB for regulation documents (`MongoDbContext`, `MongoDbSettings`, `RegulationDocument`)
- API:
  - REST endpoints defined by `docs/api/openapi.yaml`
  - Controllers are thin; Application services encapsulate logic and DTO mapping
- Frontend:
  - Vite + React + TypeScript (`src/UrbanAI.Frontend`) consuming REST API
- Tests:
  - Unit and integration tests under `tests/*`
  - Coverage settings via `coverlet.runsettings`, `integration-coverage.runsettings`
- CI/CD:
  - Azure Pipelines (`azure-pipelines.yml`) builds, tests, publishes coverage
- Infra:
  - Azure Bicep under `infra/`

## Coding and editing guidelines
- Use targeted edits with replace-in-file when possible; use write-to-file for new files or full rewrites.
- Follow `.editorconfig` and project style.
- Keep controllers focused on HTTP concerns; put business rules in Application layer.
- Map DTOs explicitly in Application services.
- Keep Infrastructure replaceable by depending on Domain interfaces.

## Local development quick commands
- Backend:
  - `dotnet build UrbanAI.sln`
  - `dotnet test --settings coverlet.runsettings`
  - `dotnet run --project src/UrbanAI.API`
- Frontend:
  - `cd src/UrbanAI.Frontend && npm install`
  - `npm run dev`
- Configuration:
  - Environment-specific: `src/UrbanAI.API/appsettings.{Environment}.json`
  - Use `.env.example` as template for secrets/env vars (do not commit secrets)

## Safety and operations
- OS/shell: Windows 11, `cmd.exe`. Run commands from the repo root unless specified.
- Destructive actions (deletes, reinstalls, secrets changes) require explicit confirmation.
- Prefer non-destructive, incremental changes; keep diffs small and auditable.
- Respect `.clineignore` to avoid reading/writing ignored or large artifacts.

## Sources of truth
- Memory Bank: `memory-bank/*.md` (core context)
- API: `docs/api/openapi.yaml`
- Architecture: `docs/architecture-overview.md`, `docs/architecture/*`, `docs/component_diagram.md`, `docs/sequence_diagram.md`
- UX & Personas: `docs/design-system/*`, `docs/personas/*`
- Code: `src/*`, tests in `tests/*`
- CI/Infra: `azure-pipelines.yml`, `infra/*`

## When to update these instructions
- When we broaden scope (new services, providers, or layers)
- When API contract changes significantly
- When DevEx changes (build, test, run steps)
- When Memory Bank workflow evolves
