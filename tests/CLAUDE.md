# UrbanAI Testing Context

This file provides specific guidance for working with the test suites across the UrbanAI project.

## Testing Overview

The project follows a comprehensive testing strategy with multiple layers:
- **Unit Tests**: Fast, isolated tests for business logic
- **Integration Tests**: API endpoints and service interaction testing
- **End-to-End Tests**: Complete user workflow validation

## Test Project Structure

```
tests/
├── UrbanAI.API.Tests/              # Unit tests for API controllers
├── UrbanAI.API.IntegrationTests/   # Integration tests for API endpoints
├── UrbanAI.Application.Tests/      # Unit tests for application services
├── UrbanAI.Domain.Tests/           # Unit tests for domain entities
└── UrbanAI.Infrastructure.Tests/   # Unit tests for infrastructure components
```

## Backend Testing Stack

### Technologies Used
- **xUnit**: Primary testing framework for .NET
- **Moq**: Mocking framework for dependencies
- **FluentAssertions**: Readable assertion library
- **ASP.NET Core TestServer**: Integration testing infrastructure
- **Coverlet**: Code coverage analysis
- **Entity Framework InMemory**: Database testing

### Test Categories

#### Unit Tests
Focus on testing individual components in isolation:
- Controllers (HTTP handling only)
- Application services (business logic)
- Domain entities (business rules)
- Repository implementations

#### Integration Tests
Test component interaction and full request/response cycles:
- API endpoint behavior
- Database operations
- Authentication and authorization
- External service integration

## Frontend Testing Stack

### Technologies Used
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end browser testing
- **jsdom**: DOM simulation for unit tests

### Test Categories

#### Component Tests
- React component rendering
- User interaction handling
- Props and state management
- Custom hooks behavior

#### E2E Tests
- Complete user workflows
- Authentication flows
- Cross-browser compatibility
- Real API integration

## Running Tests

### Backend Tests
```bash
# Run all backend tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage" --settings coverlet.runsettings

# Run specific test project
dotnet test tests/UrbanAI.API.Tests/
dotnet test tests/UrbanAI.Application.Tests/
dotnet test tests/UrbanAI.Domain.Tests/
dotnet test tests/UrbanAI.Infrastructure.Tests/

# Run integration tests with special coverage
dotnet test tests/UrbanAI.API.IntegrationTests/ --collect:"XPlat Code Coverage" --settings integration-coverage.runsettings
```

### Frontend Tests
```bash
cd src/UrbanAI.Frontend

# Unit tests
npm run test
npm run test:coverage

# E2E tests (requires backend running)
npm run test:e2e

# Complete test suite
npm run test:complete
```

## Test Configuration

### Coverage Settings
- **coverlet.runsettings**: Standard unit test coverage configuration
- **integration-coverage.runsettings**: Specialized settings for integration tests
- Target: 80%+ coverage for critical business logic

### Test Databases
- **Development**: InMemory database for fast test execution
- **Integration**: SQLite in-memory for realistic data operations
- **E2E**: Test database with seed data

## Writing Effective Tests

### Unit Test Patterns

#### AAA Pattern (Arrange, Act, Assert)
```csharp
[Fact]
public async Task RegisterExternal_ShouldCreateUser_WhenValidDataProvided()
{
    // Arrange
    var dto = new ExternalRegisterDto
    {
        Provider = "google",
        ExternalId = "google123"
    };

    // Act
    var result = await _controller.RegisterExternal(dto);

    // Assert
    var okResult = Assert.IsType<OkObjectResult>(result);
    var response = Assert.IsType<AuthResponseDto>(okResult.Value);
    Assert.NotNull(response.Token);
}
```

#### Descriptive Test Names
- Use clear, descriptive names that explain the scenario
- Format: `MethodName_ShouldExpectedBehavior_WhenCondition`
- Example: `RegisterExternal_ShouldReturnBadRequest_WhenProviderIsEmpty`

### Integration Test Patterns

#### Test Server Setup
```csharp
public class AuthControllerTests : TestBase
{
    public AuthControllerTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task RegisterExternal_ShouldReturnOk_WhenValidDataProvided()
    {
        // Arrange
        var request = new { Provider = "google", ExternalId = "test123" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register-external", request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
```

### Frontend Test Patterns

#### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { OAuthLoginPage } from '../OAuthLoginPage';

test('should display login options', () => {
  render(<OAuthLoginPage />);
  
  expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  expect(screen.getByText('Sign in with Microsoft')).toBeInTheDocument();
});
```

#### E2E Testing
```typescript
import { test, expect } from '@playwright/test';

test('OAuth login flow', async ({ page }) => {
  await page.goto('/login');
  
  // Start OAuth flow
  await page.click('[data-testid="google-login"]');
  
  // Should redirect to dashboard after auth
  await expect(page).toHaveURL('/dashboard');
});
```

## Test Data Management

### Test Fixtures
- Use builder pattern for complex test data
- Create reusable test data factories
- Isolate test data to prevent test interference

### Database Seeding
- Use consistent seed data for integration tests
- Clear database state between tests
- Use transactions for test isolation

## Mocking Strategies

### Backend Mocking
```csharp
// Mock external dependencies
var mockHttpClientFactory = new Mock<IHttpClientFactory>();
var mockConfiguration = new Mock<IConfiguration>();

// Setup mock behavior
mockConfiguration.Setup(c => c["Jwt:Secret"]).Returns("test-secret");
```

### Frontend Mocking
```typescript
// Mock API calls
vi.mock('../config/api', () => ({
  buildApiUrl: vi.fn((endpoint) => `http://localhost:5000/api/${endpoint}`)
}));
```

## Common Testing Scenarios

### Authentication Testing
- Valid OAuth flows
- Invalid credentials
- Token expiration
- Unauthorized access

### API Testing
- Request/response validation
- Error handling
- Input validation
- Security measures

### User Interface Testing
- Component rendering
- User interactions
- Form submissions
- Error states

## Quality Assurance Guidelines

### Code Coverage
- Aim for 80%+ coverage on business logic
- 100% coverage on critical paths
- Focus on meaningful coverage, not just numbers

### Test Maintenance
- Keep tests fast and reliable
- Update tests when requirements change
- Remove obsolete tests
- Refactor for maintainability

### Continuous Integration
- All tests must pass before merging
- Run tests on multiple environments
- Generate coverage reports
- Monitor test execution times

## Debugging Test Failures

### Common Issues
- Test order dependencies
- Shared state between tests
- Timing issues in async tests
- Environment configuration differences

### Debugging Techniques
- Use descriptive assertion messages
- Add logging for complex scenarios
- Run tests in isolation
- Check test data setup and teardown

## Best Practices

### Test Organization
- Group related tests in classes
- Use descriptive test method names
- Keep tests focused and simple
- Maintain consistent test structure

### Performance
- Keep unit tests fast (< 1 second)
- Minimize external dependencies
- Use efficient test data setup
- Parallelize test execution where possible

### Reliability
- Avoid flaky tests
- Use deterministic test data
- Handle async operations properly
- Clean up resources after tests