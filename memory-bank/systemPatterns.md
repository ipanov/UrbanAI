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

## Frontend UI Validation: MANDATORY WORKFLOW
**CRITICAL**: ALL frontend/UI changes MUST be validated using embedded browser testing.

### Required Validation Steps
1. **IMPLEMENT** changes to HTML/CSS/frontend files
2. **LAUNCH** embedded browser using `browser_action` tool
3. **NAVIGATE** to modified pages/components
4. **CAPTURE** screenshots for visual verification
5. **TEST** interactive elements (hover, focus, click states)
6. **VERIFY** responsive behavior across screen sizes
7. **DOCUMENT** validation results in task completion
8. **CLOSE** browser before proceeding to other tools

### Validation Checklist
- ✅ Visual elements display correctly
- ✅ Brand assets appear as intended
- ✅ Interactive states work properly
- ✅ Responsive design functions across screen sizes
- ✅ Accessibility features are functional
- ✅ No console errors or warnings

### Non-Negotiable Rules
- **NO COMPLETION** of frontend tasks without browser validation
- **NO MERGE** of UI changes without documented testing
- **ALWAYS** test before marking tasks complete
- **DOCUMENT** any visual discrepancies or issues found

This ensures UI quality and prevents visual regressions across all UrbanAI interfaces.

## DevOps/Infra
- Azure Pipelines (`azure-pipelines.yml`) builds, tests, publishes coverage
- Bicep IaC under `infra/` for Azure resource provisioning
- Runsettings for coverage (`coverlet.runsettings`, `integration-coverage.runsettings`)

## Key decisions
- Clean Architecture boundaries are enforced; Infrastructure is replaceable
- EF Core for transactional/stateful data; MongoDB for regulation documents
- Keep AI Agent integrations behind Application abstractions for future evolution
- Documentation-first: diagrams and OpenAPI define contracts

## OAuth Authentication Patterns

### Production OAuth Implementation
- **Privacy-First Architecture**: Anonymous GUID storage, zero PII on servers
- **PKCE Security**: Proof Key for Code Exchange for all OAuth flows
- **Provider Support**: Google, Microsoft, Facebook with real OAuth applications
- **Token Exchange**: Authorization code → access token → user info → JWT
- **State Parameter**: CSRF protection for all OAuth flows

### OAuth Service Architecture
```csharp
public interface IOAuthService
{
    string GenerateCodeVerifier();           // PKCE code verifier generation
    string GenerateCodeChallenge(string);    // SHA256 challenge from verifier
    string GenerateState();                  // CSRF protection state
    string BuildAuthorizationUrl(...);       // Provider-specific auth URLs
    Task<OAuthTokenResponse> ExchangeCodeForTokenAsync(...);  // Code → token
    Task<OAuthUserInfo> GetUserInfoAsync(...);               // Token → user info
}
```

### OAuth Controller Patterns
- **OAuthCallbackController**: Handles provider callbacks and token exchange
- **AuthController**: Manages JWT generation and user registration
- **Security**: PKCE validation, state verification, provider validation
- **Error Handling**: Comprehensive logging and user-friendly error responses

### Testing Patterns for OAuth
- **React Unit Tests**: Mock OAuth flows, test legal agreement modal
- **Backend Unit Tests**: Mock HTTP responses, test PKCE generation
- **E2E Tests**: Full OAuth flow testing with Playwright
- **Integration Tests**: OAuth callback endpoint testing

## References
- Component diagram: `docs/component_diagram.md`
- Sequence: `docs/sequence_diagram.md`
- OpenAPI: `docs/api/openapi.yaml`
- Architecture overview: `docs/architecture-overview.md`
- OAuth Setup: `docs/oauth-setup/` (Google, Microsoft, Facebook)
