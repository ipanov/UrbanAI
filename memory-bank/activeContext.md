# Active Context – UrbanAI

## Current focus (this session)
- Set up Cline Memory Bank and project-specific .clinerules.
- Create and populate core memory-bank files:
  - projectbrief.md
  - productContext.md
  - systemPatterns.md
  - techContext.md
  - activeContext.md (this file)
  - progress.md (planned next)
- Align custom instructions with docs/* and current solution state.

## What’s in place (repo scan)
- Clean Architecture solution:
  - API: `src/UrbanAI.API` (Program, Controllers: Auth, Issues; env appsettings)
  - Application: DTOs, Interfaces, Services; tests present
  - Domain: Entities (`Issue`, `Regulation`, `User`), Interfaces, BaseEntity; tests present
  - Infrastructure: EF Core (`ApplicationDbContext`, Migrations), Mongo (`MongoDbContext`, `MongoDbSettings`, `RegulationDocument`), Repositories; tests present
- Frontend scaffold: `src/UrbanAI.Frontend` (Vite + React + TS)
- CI: `azure-pipelines.yml` (coverage publishing, thresholds)
- Infra: `infra/` Bicep
- Docs: OpenAPI at `docs/api/openapi.yaml`, architecture and sequence diagrams, design-system specs, personas.

## Decisions captured
- EF Core for relational state; MongoDB for regulation documents.
- Repository pattern with Domain interfaces, Infrastructure implementations.
- REST-first API aligned to OpenAPI spec and diagrams.
- High test coverage enforced in CI.

## Immediate next steps
- Write `memory-bank/progress.md` with current status and gaps.
- Add `docs/cline-custom-instructions.md` to mirror .clinerules for human reference.
- Quick audit: ensure `docs/api/openapi.yaml` aligns with `IssuesController` and auth endpoints.
- Confirm Mongo wiring path for Regulation ingestion/search (Repository interface + Infrastructure mapping).

## Near-term roadmap
- Implement/verify regulation endpoints in API using `RegulationService` and Mongo repo.
- Harden auth flow (align with `docs/architecture/authentication-privacy-architecture.md`).
- Expand integration tests to cover Mongo-backed scenarios.
- Frontend: wire minimal flows (issue create/read) against API.

## Open questions / assumptions
- DB engine/connection for EF in each environment (Dev/Staging/Prod) to be finalized.
- Auth provider specifics (stub vs. real identity) for non-test runs.
- Any duplication between `Application/Interfaces` and `Application/Features/*` to be rationalized.

## References
- OpenAPI: `docs/api/openapi.yaml`
- Component diagram: `docs/component_diagram.md`
- Sequence: `docs/sequence_diagram.md`
- Architecture overview: `docs/architecture-overview.md`
