using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using UrbanAI.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication;
using UrbanAI.API.Tests;

namespace UrbanAI.API.IntegrationTests
{
    /// <summary>
    /// Test web application factory for integration tests with OAuth mocking
    /// </summary>
    public class TestWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup> where TStartup : class
    {
        private readonly bool _useTestAuthentication;
        private readonly TestAuthenticationSchemeOptions? _authOptions;

        public TestWebApplicationFactory(bool useTestAuthentication = true, TestAuthenticationSchemeOptions? authOptions = null)
        {
            _useTestAuthentication = useTestAuthentication;
            _authOptions = authOptions ?? new TestAuthenticationSchemeOptions();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Remove the app's ApplicationDbContext registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Add ApplicationDbContext using an in-memory database for testing
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryDbForTesting");
                });

                // Configure test authentication if requested
                if (_useTestAuthentication)
                {
                    services.AddAuthentication(TestAuthenticationHandler.AuthenticationScheme)
                        .AddScheme<TestAuthenticationSchemeOptions, TestAuthenticationHandler>(
                            TestAuthenticationHandler.AuthenticationScheme, 
                            options =>
                            {
                                options.ShouldAuthenticate = _authOptions?.ShouldAuthenticate ?? true;
                                options.UserId = _authOptions?.UserId;
                                options.UserName = _authOptions?.UserName;
                                options.Provider = _authOptions?.Provider;
                                options.ExternalId = _authOptions?.ExternalId;
                                options.Email = _authOptions?.Email;
                                options.IsAnonymous = _authOptions?.IsAnonymous ?? true;
                                options.CustomClaims = _authOptions?.CustomClaims;
                            });
                }

                // Build the service provider
                var sp = services.BuildServiceProvider();

                // Create a scope to obtain a reference to the database context (ApplicationDbContext)
                using (var scope = sp.CreateScope())
                {
                    var scopedServices = scope.ServiceProvider;
                    var db = scopedServices.GetRequiredService<ApplicationDbContext>();
                    var logger = scopedServices.GetRequiredService<ILogger<TestWebApplicationFactory<TStartup>>>();

                    // Ensure the database is created
                    db.Database.EnsureCreated();

                    try
                    {
                        // Seed the database with test data
                        SeedTestData(db);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "An error occurred seeding the test database.");
                        throw;
                    }
                }
            });

            builder.UseEnvironment("Testing");
        }

        /// <summary>
        /// Seed test data for integration tests
        /// </summary>
        private static void SeedTestData(ApplicationDbContext context)
        {
            // Clear existing data
            context.Issues.RemoveRange(context.Issues);
            context.Users.RemoveRange(context.Users);
            context.ExternalLogins.RemoveRange(context.ExternalLogins);
            context.SaveChanges();

            // Add test users
            var testUser = new UrbanAI.Domain.Entities.User
            {
                Id = Guid.Parse("550e8400-e29b-41d4-a716-446655440000"),
                Username = "TestUser",
                CreatedAt = DateTime.UtcNow
            };

            var testUser2 = new UrbanAI.Domain.Entities.User
            {
                Id = Guid.Parse("550e8400-e29b-41d4-a716-446655440001"),
                Username = "TestUser2",
                CreatedAt = DateTime.UtcNow
            };

            context.Users.AddRange(testUser, testUser2);

            // Add test external logins
            var externalLogin = new UrbanAI.Domain.Entities.ExternalLogin
            {
                UserId = testUser.Id,
                Provider = "TestProvider",
                ExternalId = "test-external-123"
            };

            context.ExternalLogins.Add(externalLogin);

            // Add test issues
            var testIssue = new UrbanAI.Domain.Entities.Issue
            {
                Id = Guid.Parse("660e8400-e29b-41d4-a716-446655440000"),
                Title = "Test Issue 1",
                Description = "This is a test issue for integration testing",
                Latitude = 40.7128,
                Longitude = -74.0060,
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                UserId = testUser.Id
            };

            var testIssue2 = new UrbanAI.Domain.Entities.Issue
            {
                Id = Guid.Parse("660e8400-e29b-41d4-a716-446655440001"),
                Title = "Test Issue 2",
                Description = "This is another test issue",
                Latitude = 40.7589,
                Longitude = -73.9851,
                Status = "In Progress",
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                UserId = testUser2.Id
            };

            context.Issues.AddRange(testIssue, testIssue2);
            context.SaveChanges();
        }

        /// <summary>
        /// Create a client with test authentication
        /// </summary>
        public HttpClient CreateAuthenticatedClient(TestAuthenticationSchemeOptions? authOptions = null)
        {
            var client = CreateClient();
            
            if (_useTestAuthentication)
            {
                // Add authentication header for test authentication handler
                client.DefaultRequestHeaders.Add("Authorization", "Test");
            }

            return client;
        }

        /// <summary>
        /// Get the application's database context for direct database operations in tests
        /// </summary>
        public ApplicationDbContext GetDbContext()
        {
            var scope = Services.CreateScope();
            return scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        }
    }
}