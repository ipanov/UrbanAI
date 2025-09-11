# UrbanAI Technical Context

## Technology Stack Overview

### Frontend Technologies
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: CSS Modules with design system approach
- **State Management**: React Context API + useState for local state
- **Routing**: React Router v6 for client-side navigation
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Package Manager**: npm with lockfile for reproducible builds

### Backend Technologies
- **Runtime**: .NET 9 (ASP.NET Core)
- **Architecture**: Clean Architecture (Domain → Application → Infrastructure → API)
- **Database**: Azure SQL Database + MongoDB (document storage)
- **ORM**: Entity Framework Core 9
- **Authentication**: Microsoft Identity Platform (OAuth 2.0)
- **API Documentation**: OpenAPI/Swagger
- **Testing**: xUnit with Moq for unit tests

### Infrastructure & DevOps
- **Cloud Provider**: Microsoft Azure
- **Compute**: Azure Functions (Consumption plan) + Azure App Service
- **Storage**: Azure Blob Storage for file uploads
- **Secrets**: Azure Key Vault for secure configuration
- **CI/CD**: GitHub Actions with Azure deployment
- **Monitoring**: Azure Application Insights
- **Version Control**: Git with GitHub

### Mobile Technologies
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: Context API (consistent with web)
- **Build**: EAS Build for managed workflow
- **Distribution**: App Store + Google Play Store

## Development Environment

### Local Development Setup
```json
// package.json scripts
{
  "scripts": {
    "dev": "vite --host",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  }
}
```

### Environment Configuration
```env
# .env.development
VITE_API_URL=http://localhost:5001
VITE_ENVIRONMENT=development

# .env.production
VITE_API_URL=https://urbanai-api.azurewebsites.net
VITE_ENVIRONMENT=production
```

## API Architecture

### RESTful Endpoints
```
GET    /api/v1/issues          ← List issues with pagination
POST   /api/v1/issues          ← Create new issue
GET    /api/v1/issues/{id}     ← Get issue details
PUT    /api/v1/issues/{id}     ← Update issue
DELETE /api/v1/issues/{id}     ← Delete issue (admin only)

GET    /api/v1/auth/me         ← Get current user profile
POST   /api/v1/auth/login      ← OAuth login initiation
POST   /api/v1/auth/callback   ← OAuth callback handling
```

### Data Models
```typescript
// Domain Entities
interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: Priority;
  status: IssueStatus;
  location: GeoLocation;
  attachments: Attachment[];
  reporter: User;
  assignedTo?: Authority;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole; // Citizen | Authority | Investor
  profile: UserProfile;
}

// DTOs for API communication
interface CreateIssueRequest {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  attachments?: File[];
}
```

## Database Schema

### Azure SQL Tables
```sql
-- Core Issues Table
CREATE TABLE Issues (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Category NVARCHAR(50) NOT NULL,
    Priority NVARCHAR(20) NOT NULL DEFAULT 'Medium',
    Status NVARCHAR(20) NOT NULL DEFAULT 'Open',
    Latitude DECIMAL(9,6),
    Longitude DECIMAL(9,6),
    ReporterId UNIQUEIDENTIFIER NOT NULL,
    AssignedToId UNIQUEIDENTIFIER,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Users Table
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(255) UNIQUE NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Role NVARCHAR(20) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
```

### MongoDB Collections
```javascript
// Issue attachments and metadata
{
  _id: ObjectId,
  issueId: "uuid",
  attachments: [
    {
      filename: "photo.jpg",
      contentType: "image/jpeg",
      size: 1024000,
      uploadedAt: ISODate("2024-01-01T00:00:00Z")
    }
  ],
  metadata: {
    deviceInfo: "iPhone 12",
    appVersion: "1.0.0"
  }
}
```

## Authentication Flow

### OAuth 2.0 Implementation
```typescript
// Frontend OAuth flow
const initiateLogin = async (userType: UserRole) => {
  const authUrl = `${API_BASE}/auth/login?userType=${userType}`;
  window.location.href = authUrl;
};

// Backend OAuth callback
[HttpPost("callback")]
public async Task<IActionResult> HandleCallback([FromBody] OAuthCallbackRequest request)
{
    var token = await _authService.ExchangeCodeForToken(request.Code);
    var user = await _authService.GetUserInfo(token);
    var jwt = _jwtService.GenerateToken(user);

    return Ok(new { token = jwt, user });
}
```

## Deployment Architecture

### Azure Infrastructure
```
┌─────────────────┐    ┌─────────────────┐
│   Azure Front   │    │   Azure API     │
│   Door (CDN)    │────│   App Service   │
└─────────────────┘    └─────────────────┘
          │                       │
          └───────────────────────┘
                    │
          ┌─────────────────┐
          │   Azure SQL     │
          │   Database      │
          └─────────────────┘
                    │
          ┌─────────────────┐
          │   Azure Key     │
          │   Vault         │
          └─────────────────┘
```

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test:ci
      - name: Build
        run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v3
        with:
          app-name: urbanai-api
          package: ./publish
```

## Performance Considerations

### Frontend Optimization
- **Bundle Splitting**: Route-based code splitting with React.lazy()
- **Image Optimization**: WebP format with responsive images
- **Caching Strategy**: Service worker for offline capability
- **Bundle Size**: Target < 200KB initial bundle size

### Backend Optimization
- **Database Indexing**: Optimized queries with proper indexing
- **Caching**: Redis for frequently accessed data
- **Async Processing**: Background jobs for heavy operations
- **API Response**: Gzip compression and pagination

### Monitoring & Observability
- **Application Insights**: Real-time telemetry and performance metrics
- **Health Checks**: API endpoints for system health monitoring
- **Logging**: Structured logging with correlation IDs
- **Alerting**: Proactive monitoring and notifications

## Security Implementation

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with refresh tokens
- **Role-Based Access**: Citizen, Authority, Investor permissions
- **API Security**: Bearer token validation and rate limiting
- **CORS**: Configured for frontend domain only

### Data Protection
- **Encryption**: Azure Key Vault for secrets management
- **GDPR Compliance**: Data minimization and consent management
- **Audit Logging**: Track all data access and modifications
- **Secure Headers**: OWASP recommended security headers

## Testing Strategy

### Unit Testing
```typescript
// Frontend unit test example
import { render, screen } from '@testing-library/react';
import { IssueCard } from './IssueCard';

describe('IssueCard', () => {
  it('displays issue title and status', () => {
    const issue = {
      id: '1',
      title: 'Pothole on Main St',
      status: 'Open'
    };

    render(<IssueCard issue={issue} />);

    expect(screen.getByText('Pothole on Main St')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
```

### Integration Testing
```csharp
// Backend integration test example
[Fact]
public async Task CreateIssue_ShouldReturnCreatedIssue()
{
    // Arrange
    var request = new CreateIssueRequest
    {
        Title = "Test Issue",
        Description = "Test Description",
        Category = "Infrastructure"
    };

    // Act
    var response = await _client.PostAsJsonAsync("/api/v1/issues", request);
    var result = await response.Content.ReadFromJsonAsync<IssueDto>();

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Created);
    result.Title.Should().Be("Test Issue");
}
```

### E2E Testing
```typescript
// Playwright E2E test example
import { test, expect } from '@playwright/test';

test('user can report an issue', async ({ page }) => {
  await page.goto('/login');
  await page.click('text=Citizen');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.click('text=Report Issue');

  await page.fill('[data-testid="title"]', 'Pothole on Main St');
  await page.fill('[data-testid="description"]', 'Large pothole causing damage');
  await page.click('text=Submit');

  await expect(page.locator('text=Issue reported successfully')).toBeVisible();
});
```

## Development Workflow

### Local Development
1. **Clone Repository**: `git clone https://github.com/ipanov/UrbanAI.git`
2. **Install Dependencies**: `npm install` (frontend), `dotnet restore` (backend)
3. **Start Services**: `npm run dev` (frontend), `dotnet run` (backend)
4. **Database Setup**: Run EF Core migrations
5. **Test**: Run unit and integration tests

### Code Quality
- **Linting**: ESLint for JavaScript/TypeScript, StyleCop for C#
- **Formatting**: Prettier for consistent code formatting
- **Type Checking**: TypeScript strict mode enabled
- **Security**: Automated security scanning in CI pipeline

### Documentation
- **API Documentation**: OpenAPI/Swagger for backend APIs
- **Component Documentation**: Storybook for frontend components
- **Architecture Diagrams**: Draw.io for system architecture
- **Code Comments**: XML comments for public APIs
