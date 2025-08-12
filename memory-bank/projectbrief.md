# Project Brief – UrbanAI

## Mission
Provide a structured platform for reporting, triaging, and resolving urban issues while linking cases to relevant regulations and supporting operators with an AI assistant.

## Problem statement
Cities lack a unified flow for citizen issue intake and regulation-aware resolution. Data is fragmented across systems, slowing response times and reducing accountability.

## Scope (v1)
- Backend Clean Architecture (API, Application, Domain, Infrastructure)
- Issue lifecycle (create/read/update)
- Regulation storage/search via MongoDB
- Basic auth scaffolding
- REST API contracts (OpenAPI)
- Frontend scaffold (Vite + React + TS) consuming API
- CI with tests and coverage

## Non-goals (v1)
- Advanced workflow automation
- Full-featured role-based admin portal
- Complex AI planning/execution
- Multi-tenant support

## Stakeholders
- Citizens: submit issues, receive confirmations/status
- Municipal operators: review, update, resolve issues, reference regulations, generate reports
- Administrators: configure integrations, monitor compliance and system health

## Success criteria
- Issue submission under 1 minute
- Operators complete common tasks within app
- Regulations discoverable/citable during case work
- Repeatable report generation

## Architecture overview
- Clean Architecture: API → Application → Domain; Infrastructure implements interfaces
- Data:
  - EF Core for relational state (migrations in `src/UrbanAI.Infrastructure/Migrations`)
  - MongoDB for regulation documents
- API: REST per `docs/api/openapi.yaml`
- Frontend: Vite + React + TS under `src/UrbanAI.Frontend`
- CI/CD: Azure Pipelines with coverage
- IaC: Bicep under `infra/`

## Primary flows (from docs)
- Issue Intake (see `docs/sequence_diagram.md`, `docs/component_diagram.md`)
- Regulations Search/Crawler (see `docs/figma_project.md`)
- AI Agent assistance (concept; behind Application abstractions)
- Report generation (PDF/docx; conceptual in v1)

## References
- OpenAPI: `docs/api/openapi.yaml`
- Component diagram: `docs/component_diagram.md`
- Sequence diagram: `docs/sequence_diagram.md`
- Architecture overview: `docs/architecture-overview.md`
- Figma overview: `docs/figma_project.md`
