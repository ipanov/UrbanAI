# Implementation Plan

[Overview]
Migrate UrbanAI from Azure cloud infrastructure to a cloud-agnostic architecture using Supabase as the primary database solution.

The current UrbanAI project faces mandatory Azure multi-factor authentication preventing deployment access, creating an urgent need to migrate away from Azure. This implementation will replace the dual database setup (SQL Server + MongoDB) with Supabase's comprehensive PostgreSQL-based backend-as-a-service, eliminate Azure-specific dependencies, and create a cloud-agnostic microservice architecture. The migration will maintain all existing functionality while reducing costs from current Azure pricing to under $10/month target budget and providing flexibility to deploy on multiple cloud providers (AWS, Google Cloud, DigitalOcean) or locally.

[Types]
Define new configuration interfaces and data transfer objects for cloud-agnostic database operations.

**New Configuration Types:**
```csharp
// Cloud-agnostic database configuration
public interface ICloudDatabaseConfig
{
    string ConnectionString { get; }
    string Provider { get; } // "supabase", "postgresql", "mysql"
    Dictionary<string, string> Settings { get; }
}

public class SupabaseConfig : ICloudDatabaseConfig
{
    public string ConnectionString { get; set; }
    public string Provider => "supabase";
    public string ProjectUrl { get; set; }
    public string AnonKey { get; set; }
    public string ServiceRoleKey { get; set; }
    public Dictionary<string, string> Settings { get; set; } = new();
}

// Cloud-agnostic storage configuration
public interface ICloudStorageConfig
{
    string Provider { get; }
    string BucketName { get; }
    Dictionary<string, string> Credentials { get; }
}

public class SupabaseStorageConfig : ICloudStorageConfig
{
    public string Provider => "supabase";
    public string BucketName { get; set; }
    public Dictionary<string, string> Credentials { get; set; } = new();
}

// Unified document storage model (replaces separate MongoDB collections)
public class RegulationDocument
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public JsonDocument Metadata { get; set; } // JSONB in PostgreSQL
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string[] Tags { get; set; } // PostgreSQL array
    public Vector Embedding { get; set; } // pgvector for AI features
}
```

**Modified Entity Framework Context:**
```csharp
public class UrbanAIDbContext : DbContext
{
    public DbSet<Issue> Issues { get; set; }
    public DbSet<RegulationDocument> RegulationDocuments { get; set; } // Replaces MongoDB
    public DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure JSONB support for PostgreSQL
        modelBuilder.Entity<RegulationDocument>()
            .Property(e => e.Metadata)
            .HasColumnType("jsonb");
            
        // Configure array support
        modelBuilder.Entity<RegulationDocument>()
            .Property(e => e.Tags)
            .HasColumnType("text[]");
            
        // Configure vector support for pgvector
        modelBuilder.Entity<RegulationDocument>()
            .Property(e => e.Embedding)
            .HasColumnType("vector(1536)");
    }
}
```

[Files]
Create new cloud-agnostic infrastructure files and modify existing Azure-dependent files.

**New Files to Create:**
- `src/UrbanAI.Infrastructure/Cloud/ICloudProvider.cs` - Cloud provider abstraction interface
- `src/UrbanAI.Infrastructure/Cloud/SupabaseProvider.cs` - Supabase implementation
- `src/UrbanAI.Infrastructure/Cloud/CloudProviderFactory.cs` - Factory for provider selection
- `src/UrbanAI.Infrastructure/Data/SupabaseDbContext.cs` - Supabase-specific DbContext
- `src/UrbanAI.Infrastructure/Storage/SupabaseStorageService.cs` - Supabase Storage API wrapper
- `infra/supabase/` - Directory for Supabase configuration files
- `infra/supabase/migrations/` - Database migration scripts for Supabase
- `infra/supabase/config.toml` - Supabase project configuration
- `infra/docker/` - Docker configurations for cloud-agnostic deployment
- `infra/docker/docker-compose.yml` - Multi-provider deployment configuration
- `deployment/railway/` - Railway.app deployment configuration
- `deployment/digitalocean/` - DigitalOcean App Platform configuration
- `deployment/local/` - Local development with Docker configuration

**Files to Modify:**
- `src/UrbanAI.API/Program.cs` - Replace Azure-specific services with cloud-agnostic providers
- `src/UrbanAI.API/appsettings.json` - Add Supabase configuration sections
- `src/UrbanAI.Infrastructure/Data/ApplicationDbContext.cs` - Merge MongoDB entities into PostgreSQL
- `src/UrbanAI.Infrastructure/Repositories/` - Update repository implementations for unified database
- `src/UrbanAI.Application/Services/` - Remove Azure-specific service dependencies
- `package.json` - Add Supabase CLI and deployment scripts

**Files to Delete:**
- `infra/main.bicep` - Azure Bicep template
- `infra/functions.bicep` - Azure Functions template  
- `azure.yaml` - Azure Developer CLI configuration
- `src/UrbanAI.Functions/` - Entire Azure Functions project
- `src/UrbanAI.Infrastructure/Data/MongoDbContext.cs` - MongoDB context
- `src/UrbanAI.Infrastructure/Repositories/MongoRepository.cs` - MongoDB repository

**Configuration Updates:**
- `.env.development` - Supabase environment variables
- `.env.production` - Production Supabase configuration
- `docker-compose.yml` - Local development with Supabase local setup

[Functions]
Implement cloud-agnostic service functions and migrate Azure Functions to Supabase Edge Functions.

**New Functions:**
- `CloudProviderFactory.CreateProvider(string providerType)` in `src/UrbanAI.Infrastructure/Cloud/CloudProviderFactory.cs`
- `SupabaseProvider.InitializeAsync()` in `src/UrbanAI.Infrastructure/Cloud/SupabaseProvider.cs`
- `SupabaseStorageService.UploadFileAsync()` in `src/UrbanAI.Infrastructure/Storage/SupabaseStorageService.cs`
- `MigrateFromMongoToPostgres()` in `src/UrbanAI.Infrastructure/Migrations/DataMigrationService.cs`

**Modified Functions:**
- `Program.ConfigureServices()` in `src/UrbanAI.API/Program.cs` - Replace Azure service registrations with cloud-agnostic providers
- `IssueService.CreateIssueAsync()` in `src/UrbanAI.Application/Services/IssueService.cs` - Use unified database context
- `RegulationService.SearchDocumentsAsync()` in `src/UrbanAI.Application/Services/RegulationService.cs` - Migrate from MongoDB to PostgreSQL with JSONB queries

**Removed Functions:**
- All Azure Functions in `src/UrbanAI.Functions/Functions/` - Replace with Supabase Edge Functions
- `MongoRepository.InsertAsync()` and related MongoDB operations
- Azure-specific authentication and storage functions

**Edge Functions to Create (TypeScript):**
- `supabase/functions/process-regulation-documents/index.ts` - Replace Azure Function for document processing
- `supabase/functions/send-notifications/index.ts` - Replace Azure Function for notifications
- `supabase/functions/generate-embeddings/index.ts` - AI embedding generation using OpenAI

[Classes]
Create cloud provider abstraction classes and modify existing data access classes.

**New Classes:**
```csharp
// Abstract cloud provider interface
public abstract class CloudProvider : ICloudProvider
{
    public abstract Task<bool> InitializeAsync(ICloudDatabaseConfig config);
    public abstract Task<ICloudStorageService> GetStorageService();
    public abstract Task<ICloudDatabaseService> GetDatabaseService();
}

// Supabase provider implementation
public class SupabaseProvider : CloudProvider
{
    private readonly SupabaseClient _client;
    private readonly ILogger<SupabaseProvider> _logger;
    
    public override async Task<bool> InitializeAsync(ICloudDatabaseConfig config)
    {
        // Initialize Supabase client with configuration
    }
}

// Unified data migration service
public class DataMigrationService
{
    private readonly ApplicationDbContext _sqlContext;
    private readonly MongoDbContext _mongoContext;
    private readonly ILogger<DataMigrationService> _logger;
    
    public async Task MigrateRegulationDocumentsAsync()
    {
        // Migrate MongoDB documents to PostgreSQL JSONB
    }
}
```

**Modified Classes:**
- `ApplicationDbContext` - Add RegulationDocument entity, remove MongoDB dependencies
- `IssueRepository` - Consolidate all data access through single PostgreSQL context
- `RegulationRepository` - Migrate from MongoDB to PostgreSQL with JSONB support
- `AuthController` - Remove Azure AD dependencies, use Supabase Auth
- `StorageService` - Abstract storage operations for multi-provider support

**Removed Classes:**
- `MongoDbContext` - Replace with PostgreSQL JSONB
- `MongoRepository<T>` - Consolidate into EF Core repositories
- `AzureFunctionContext` - Replace with Supabase Edge Functions
- Azure-specific service classes in `UrbanAI.Infrastructure`

[Dependencies]
Update package dependencies to remove Azure-specific packages and add Supabase support.

**Remove Azure Dependencies:**
```xml
<!-- Remove from all .csproj files -->
<PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.8.0" />
<PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.3.0" />
<PackageReference Include="Microsoft.Azure.Cosmos" Version="3.35.4" />
<PackageReference Include="Azure.Storage.Blobs" Version="12.17.0" />
<PackageReference Include="Microsoft.Extensions.Azure" Version="1.6.3" />
```

**Add Supabase Dependencies:**
```xml
<!-- Add to UrbanAI.Infrastructure.csproj -->
<PackageReference Include="Supabase" Version="0.13.3" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="7.0.11" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL.Design" Version="1.1.0" />
<PackageReference Include="Pgvector.EntityFrameworkCore" Version="0.1.2" />

<!-- Add to UrbanAI.API.csproj -->
<PackageReference Include="Npgsql" Version="7.0.6" />
```

**Frontend Dependencies (package.json):**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.4"
  },
  "devDependencies": {
    "supabase": "^1.100.1"
  }
}
```

**Development Tools:**
- Supabase CLI for local development and migrations
- Docker and Docker Compose for local PostgreSQL setup
- pgAdmin or equivalent for database administration

[Testing]
Update test configurations to support multiple database providers and remove Azure dependencies.

**Test Configuration Updates:**
- `tests/UrbanAI.API.IntegrationTests/appsettings.Testing.json` - Add Supabase test database configuration
- `tests/*/TestBase.cs` - Create cloud-agnostic test base class with provider switching
- `CustomWebApplicationFactory.cs` - Support Supabase test database initialization

**New Test Classes:**
- `SupabaseProviderTests.cs` - Test Supabase provider implementation
- `DataMigrationServiceTests.cs` - Test MongoDB to PostgreSQL migration
- `CloudProviderFactoryTests.cs` - Test provider selection logic

**Modified Test Classes:**
- `IssueRepositoryTests.cs` - Update for unified PostgreSQL database
- `RegulationServiceTests.cs` - Test PostgreSQL JSONB queries instead of MongoDB
- `AuthControllerTests.cs` - Update for Supabase Auth instead of Azure AD

**Test Data Management:**
- Create PostgreSQL test database schema with pgvector extension
- Migrate existing test data from MongoDB format to PostgreSQL JSONB
- Update integration tests to use Supabase local development setup

[Implementation Order]
Execute migration in sequential phases to minimize disruption and ensure successful transition.

1. **Phase 1: Foundation Setup (Days 1-2)**
   - Install Supabase CLI and create new Supabase project
   - Set up local Supabase development environment with Docker
   - Create cloud-agnostic configuration interfaces and base classes
   - Add Supabase NuGet packages to Infrastructure project

2. **Phase 2: Database Migration (Days 3-5)**
   - Design unified PostgreSQL schema combining SQL Server and MongoDB entities
   - Create Supabase migrations for new schema with pgvector extension
   - Implement DataMigrationService for MongoDB to PostgreSQL JSONB migration
   - Update ApplicationDbContext for PostgreSQL with JSONB support
   - Test data migration with sample data

3. **Phase 3: Infrastructure Abstraction (Days 6-8)**
   - Implement ICloudProvider interface and SupabaseProvider class
   - Create CloudProviderFactory for provider selection
   - Replace Azure Storage with Supabase Storage implementation
   - Update dependency injection in Program.cs for cloud-agnostic services
   - Remove Azure-specific service registrations

4. **Phase 4: Application Layer Updates (Days 9-11)**
   - Update repository implementations for unified PostgreSQL database
   - Migrate RegulationService from MongoDB queries to PostgreSQL JSONB
   - Replace Azure Functions with Supabase Edge Functions
   - Update authentication flow to use Supabase Auth
   - Remove Azure AD integration code

5. **Phase 5: Frontend Integration (Days 12-13)**
   - Install @supabase/supabase-js in React frontend
   - Update API client to use Supabase endpoints
   - Replace Azure-specific authentication with Supabase Auth
   - Update environment configurations for Supabase

6. **Phase 6: Testing and Validation (Days 14-15)**
   - Update all unit and integration tests for new architecture
   - Create comprehensive test suite for data migration
   - Validate all existing functionality works with Supabase
   - Performance testing for PostgreSQL vs previous dual database setup

7. **Phase 7: Deployment Configuration (Days 16-17)**
   - Create deployment configurations for Railway, DigitalOcean, and local hosting
   - Set up CI/CD pipelines for cloud-agnostic deployment
   - Configure production Supabase project and environment variables
   - Document deployment process for multiple cloud providers

8. **Phase 8: Production Migration (Day 18)**
   - Execute production data migration during maintenance window
   - Deploy new cloud-agnostic version to chosen provider
   - Monitor system performance and resolve any issues
   - Update DNS and complete migration from Azure
