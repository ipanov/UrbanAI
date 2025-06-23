using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using UrbanAI.Infrastructure.Data;
using System.Linq;
using Microsoft.Data.Sqlite; // For SqliteConnection
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting; // Required for IHostBuilder
using Microsoft.AspNetCore.Authentication; // Required for AuthenticationSchemeOptions
using Microsoft.Extensions.DependencyInjection.Extensions; // Required for RemoveAll
using UrbanAI.Domain.Interfaces; // Required for IRegulationRepository
using Moq; // Required for Mock

namespace UrbanAI.API.IntegrationTests
{    public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        private DbConnection _dbConnection = null!;

        public HttpClient HttpClient { get; private set; } = null!;

        public async Task InitializeAsync()
        {
            // Create a new in-memory SQLite connection for each test run
            _dbConnection = new SqliteConnection("DataSource=:memory:");
            await _dbConnection.OpenAsync();            // Perform initial database setup (create schema) ONCE for the entire test collection
            using (var scope = Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                // EnsureCreatedAsync creates the database schema based on the model
                await dbContext.Database.EnsureCreatedAsync(); 
            }

            HttpClient = CreateClient(); // Create client last
        }

        public new async Task DisposeAsync()
        {
            await _dbConnection.DisposeAsync();
            // No container to dispose for in-memory SQLite
        }        public async Task ResetDatabaseAsync()
        {
            // For in-memory SQLite, a full reset means recreating the schema
            // This is handled by InitializeAsync for the entire collection,
            // or by individual test setup if needed per test.
            // For simplicity, we'll just ensure the database is created.
            using (var scope = Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                await dbContext.Database.EnsureCreatedAsync();
            }
        }

        // Override ConfigureWebHost to configure test services directly
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Remove existing DbContext registrations
                var dbContextRelatedServices = services.Where(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>) ||
                         d.ServiceType == typeof(ApplicationDbContext) ||
                         d.ServiceType == typeof(IDbContextFactory<ApplicationDbContext>)).ToList();

                foreach (var descriptor in dbContextRelatedServices)
                {
                    services.Remove(descriptor);
                }                // Add the in-memory SQLite DbContext
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseSqlite(_dbConnection); 
                    options.ConfigureWarnings(x => x.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
                });

                // Remove existing authentication
                var authServices = services.Where(s => 
                    s.ServiceType.FullName != null && 
                    s.ServiceType.FullName.Contains("Authentication")).ToList();
                foreach (var service in authServices)
                {
                    services.Remove(service);
                }

                // Add test authentication as the default
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
                    options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
                    options.DefaultScheme = TestAuthHandler.SchemeName;
                })
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.SchemeName, options => { });
                
                services.AddAuthorization();

                // Mock IRegulationRepository to prevent MongoDB connection during tests
                services.RemoveAll(typeof(IRegulationRepository));
                var mockRegulationRepository = new Mock<IRegulationRepository>();
                mockRegulationRepository.Setup(repo => repo.GetByLocationAsync(It.IsAny<string>()))
                    .ReturnsAsync((string location) =>
                    {
                        if (location == "TestLocation")
                        {
                            return new List<UrbanAI.Domain.Entities.Regulation>
                            {
                                new UrbanAI.Domain.Entities.Regulation { Id = Guid.NewGuid(), Title = "Test Regulation", Content = "Content", Location = "TestLocation", EffectiveDate = DateTime.UtcNow, Jurisdiction = "Test", Keywords = new List<string> { "Test" }, SourceUrl = "http://test.com", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                            };
                        }
                        return new List<UrbanAI.Domain.Entities.Regulation>();
                    });
                services.AddSingleton(mockRegulationRepository.Object);
            });            // Ensure the environment is set to Testing for integration tests
            builder.UseEnvironment("Testing");
        }
    }
}
