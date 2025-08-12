# Product Context – UrbanAI

## Why this exists
Cities need a structured way to intake, triage, and resolve urban issues (e.g., potholes, lighting, waste) while referencing relevant regulations. UrbanAI centralizes issue reporting, links cases to regulations, and assists operators with an AI agent to accelerate resolution and reporting.

## Users and goals
- Citizens
  - Report issues with photo, description, location
  - Receive confirmation and track basic status
- Municipal operators
  - Review, update, and resolve issues
  - Search and reference regulations
  - Generate reports and persist case context
- Administrators
  - Configure integrations and data sources
  - Monitor system health and compliance

## Key workflows (from docs)
- Issue Intake (docs/figma_project.md)
  - Submit details (photo, description, location)
  - Confirmation and tracking
- Regulations Crawler / Search (docs/figma_project.md)
  - Search by location/keywords
  - View details and cite in cases
- AI-Agent Chat (docs/figma_project.md)
  - Ask procedural or regulation questions
  - Maintain chat history per case
- Report Generation (docs/figma_project.md)
  - Review collected case data
  - Generate PDF/docx reports
  - Persist case state and artifacts

## Product principles
- Clean Architecture with clear boundaries
- Trustworthy data model for cases and regulations
- Auditability: every change linked to a user and time
- API-first: REST as source of truth
- Extensible: future AI automations and additional data sources

## Success criteria (experience)
- Citizens can submit issues in under 1 minute
- Operators can resolve common tasks without leaving the app
- Regulations are discoverable and citable from the same interface
- Reports are reproducible and consistent

## References
- Component diagram: docs/component_diagram.md
- Sequence: docs/sequence_diagram.md
- API: docs/api/openapi.yaml
- Figma overview: docs/figma_project.md
