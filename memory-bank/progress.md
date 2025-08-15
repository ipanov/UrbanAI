# Progress – UrbanAI

## Status summary
- Memory Bank initialized with core files:
  - projectbrief.md, productContext.md, systemPatterns.md, techContext.md, activeContext.md, progress.md
- Project-specific `.clinerules` created and aligned to Cline Memory Bank best practices.
- Documentation sources mapped: `docs/api/openapi.yaml`, diagrams, design system, personas.
- Solution structure verified: API, Application, Domain, Infrastructure, Frontend scaffold present.
- Tests present across layers; CI pipeline defined (Azure Pipelines) with coverage artifacts.

## What works (repo evidence)
- API layer: `AuthController`, `IssuesController` wired to Application services.
- Application layer: DTOs and Services for Issues/Regulations/Users; explicit DTO↔Entity mapping.
- Domain layer: Entities (`Issue`, `Regulation`, `User`), repository interfaces, base entity.
- Infrastructure layer:
  - EF Core: `ApplicationDbContext`, configuration, migrations present.
  - Mongo: `MongoDbContext`, `MongoDbSettings`, `RegulationDocument`, repositories.
- Frontend: Vite + React + TypeScript scaffold available.
- CI/CD: `azure-pipelines.yml` configured to build, test, and publish coverage.

## In progress (this session)
- Establish Memory Bank and align `.clinerules` with team conventions.
- Capture system patterns and tech context from codebase and docs.
- Prepare custom instructions for docs to mirror `.clinerules`.

## Next up
- Validate OpenAPI spec vs. implemented endpoints (Issues/Auth) and close any gaps.
- Extend integration tests for Mongo-backed regulation flows.
- Implement/verify regulation endpoints in API via `RegulationService` + repo.
- Frontend: connect basic issue create/read flows to API.
- Create a short Developer Onboarding guide referencing Memory Bank and run commands.

## Completed (2025-08-15)
- Created HTML mocks for all 6 UrbanAI MVP pages:
  - Web Landing Page (1440×3200px)
  - Web Login Page (1440×900px) 
  - GDPR Compliance Page (1440×2800px)
  - Dashboard Page (1440×1024px)
  - Android Login Screen (375×812px)
  - Android Landing Screen (375×812px)
- All mocks implemented with exact design specifications from Figma mockup requirements
- Files located in `/mocks` directory for easy access and review

## Known gaps / risks
- Environment configuration specifics (connection strings per env) to be finalized.
- Auth provider specifics for non-test runs (stub vs. external identity).
- Potential duplication between `Application/Interfaces` and `Application/Features/*`.
- Production hardening items (CORS, HTTPS enforcement, logging/monitoring, secrets management).

## Decisions (tracking)
- Clean Architecture boundaries enforced.
- EF Core for relational data; MongoDB for regulation documents.
- REST-first; diagrams and OpenAPI are contract sources of truth.
- Keep AI Agent integration behind Application abstractions.

## References
- OpenAPI: `docs/api/openapi.yaml`
- Component: `docs/component_diagram.md`
- Sequence: `docs/sequence_diagram.md`
- Arch overview: `docs/architecture-overview.md`

## Asset Integration Decisions (2025-08-15)
Gemini source assets directory is empty (`docs/design-system/gemini-assets/`), so no extraction possible. Decision: proceed with curated, license-compliant replacements.
- Icon library: Heroicons (MIT) outline set (stroke 1.5–2px) themed via `currentColor`.
- Store badges: Official Apple App Store & Google Play badges (unaltered, per brand usage guidelines).
- Backgrounds: Abstract gradient mesh (SVG + exported WebP) plus optional subtle geometric pattern; performance budgets: desktop ≤180KB, mobile ≤120KB.
- Photos (if needed): Unsplash (or Pexels) with explicit attribution entries.
- Logo mark: retain existing `logo-mark.svg`; refine only if necessary after integrating new palette.

Next immediate actions:
1. Create brand asset subdirectories: `icons/`, `backgrounds/`, `badges/`, `stores/`, `photos/`.
2. Acquire initial icon set (feature & dashboard actions) and optimize (SVGO profile).
3. Source/generate hero background variants (desktop/mobile) and optimize to WebP with fallback.
4. Update `docs/design-system/assets/attribution.md` incrementally as assets are added.

This section documents the irreversible shift from extraction strategy to curated sourcing due to absent Gemini asset files.

## MVP Scope Alignment (2025-08-15)
To mitigate prior scope drift (non-MVP feature ideation), reaffirmed UrbanAI MVP boundaries:
- IN SCOPE: Citizen issue submission, issue classification, regulation lookup, guided data capture, reporting/status visibility.
- OUT OF SCOPE (deferred): Advanced analytics dashboards, gamification, AI chat assistants beyond guided capture, automated multi-channel publishing, non-essential badge systems.
Rationale: Maintain delivery focus, reduce asset/UI churn, keep architectural surface minimal for security & performance.
Guiding Constraints:
- UI elements added during asset integration must map directly to MVP flows above.
- Any new icon request must reference a concrete MVP action/state; otherwise rejected.
Enforcement:
- Asset checklist cross-referenced with MVP list before inclusion.
- Attribution entries only for assets actually wired into MVP mockups.
Next Review Gate:
- Post asset integration accessibility/performance audit; confirm no scope creep before expanding visuals.
