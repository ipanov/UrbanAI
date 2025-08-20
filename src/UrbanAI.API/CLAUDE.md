# UrbanAI Backend API Context

This file provides specific guidance for working with the ASP.NET Core Web API backend.

## Architecture Overview

The API follows Clean Architecture with these layers:
- **API Layer** (`Controllers/`): HTTP concerns, request/response handling
- **Application Layer** (referenced): Business logic, DTOs, service interfaces  
- **Domain Layer** (referenced): Core entities and business rules
- **Infrastructure Layer** (referenced): Data access, external services

## Project Structure

```
src/UrbanAI.API/
├── Controllers/           # API endpoints
├── Properties/           # Launch settings
├── appsettings*.json     # Configuration files
├── Program.cs           # Application startup
└── UrbanAI.API.http     # HTTP test file
```

## Key Configuration

### Environment-Specific Settings
- `appsettings.json` - Base configuration
- `appsettings.Development.json` - Local development
- `appsettings.Production.json` - Production settings
- `appsettings.Staging.json` - Staging environment

### Important Configuration Sections
- **ConnectionStrings**: Database connections (EF Core, Supabase)
- **Authentication**: OAuth provider settings (Microsoft, Google)
- **Jwt**: JWT token configuration
- **OAuth**: Redirect URIs and provider settings

## Controllers Guidelines

### Controller Responsibilities
- Handle HTTP request/response only
- Validate input parameters
- Call Application services for business logic
- Return appropriate HTTP status codes
- Handle authentication/authorization

### Current Controllers
- **AuthController** (`/api/auth`): User registration and JWT management
- **OAuthCallbackController** (`/api/v1/oauth`): OAuth flow handling  
- **IssuesController** (`/api/issues`): Issue CRUD operations

### Controller Patterns
```csharp
[ApiController]
[Route("api/[controller]")]
public class ExampleController : ControllerBase
{
    private readonly IExampleService _service;
    
    public ExampleController(IExampleService service)
    {
        _service = service;
    }
    
    [HttpGet]
    public async Task<ActionResult<ExampleDto>> Get()
    {
        var result = await _service.GetExampleAsync();
        return Ok(result);
    }
}
```

## Authentication & Authorization

### OAuth Flow
- Authorization endpoint: `POST /api/v1/oauth/authorize/{provider}`
- Callback endpoint: `GET /api/v1/oauth/callback/{provider}`
- Supported providers: Microsoft, Google

### JWT Configuration
- Tokens expire in 1 hour
- Include user ID, username, role claims
- Configured in appsettings with secret, issuer, audience

### User Registration
- External user registration: `POST /api/auth/register-external`
- Creates anonymous users linked to OAuth provider
- Returns JWT token for authenticated sessions

## Database Integration

### Entity Framework Core
- Context: `ApplicationDbContext` (from Infrastructure)
- Migrations: Managed in Infrastructure project
- Development: InMemory provider
- Production: PostgreSQL via Supabase

### Data Access Pattern
- Controllers reference Application services
- Application services use repository interfaces
- Infrastructure implements repositories with EF Core

## Testing Strategy

### Integration Tests
- Test complete API endpoints
- Use TestServer with in-memory database
- Located in `tests/UrbanAI.API.IntegrationTests/`

### Unit Tests  
- Test controller logic in isolation
- Mock Application service dependencies
- Located in `tests/UrbanAI.API.Tests/`

## Development Commands

```bash
# Run API locally
dotnet run --project src/UrbanAI.API

# Run with specific environment
dotnet run --project src/UrbanAI.API --environment Development

# Test API endpoints
dotnet test tests/UrbanAI.API.Tests/
dotnet test tests/UrbanAI.API.IntegrationTests/

# Use HTTP file for manual testing
# Open UrbanAI.API.http in VS Code with REST Client extension
```

## Common Development Tasks

### Adding New Controller
1. Create controller class inheriting from `ControllerBase`
2. Add `[ApiController]` and `[Route]` attributes
3. Inject required Application services via constructor
4. Implement HTTP methods following REST conventions
5. Add appropriate tests in both test projects

### Configuration Changes
1. Update appropriate `appsettings*.json` file
2. Add configuration classes if needed
3. Register in `Program.cs` if required for DI
4. Update tests with new configuration

### Security Considerations
- Never log sensitive information (passwords, tokens)
- Validate all input parameters
- Use HTTPS in production
- Implement proper error handling without exposing internals
- Follow OWASP guidelines for API security

## Important Notes

- Keep controllers thin - business logic belongs in Application layer
- Use DTOs for all request/response models
- Follow REST conventions for HTTP methods and status codes
- Maintain backward compatibility when possible
- Document API changes in OpenAPI specification