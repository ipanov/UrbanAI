using UrbanAI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Bogus;
using UrbanAI.Domain.Entities;
using System.Net.Http.Headers;
using UrbanAI.Application.DTOs;

namespace UrbanAI.API.IntegrationTests;

[Collection("Integration Tests")]
public abstract class TestBase : IAsyncLifetime
{
    protected readonly CustomWebApplicationFactory _factory;
    protected readonly HttpClient _client;
    protected IServiceScope _scope = null!;
    protected ApplicationDbContext _dbContext = null!;

    protected TestBase(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(TestAuthHandler.SchemeName);
    }

    public async Task InitializeAsync()
    {
        _scope = _factory.Services.CreateScope();
        _dbContext = _scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // For in-memory SQLite, the database is fresh for each factory instance.
        // We just need to ensure the schema is created and data is seeded.
        await _dbContext.Database.EnsureCreatedAsync(); // Ensure schema is created
        await SeedDataAsync();
    }

    public async Task DisposeAsync()
    {
        _scope.Dispose();
        // For in-memory SQLite, the connection is closed and the database is lost on dispose.
        // No need for explicit database reset here.
        await Task.CompletedTask; // To satisfy IAsyncLifetime interface
    }
    protected virtual async Task ClearDatabaseAsync()
    {
        // Clear all data from tables
        _dbContext.Issues.RemoveRange(_dbContext.Issues);
        _dbContext.Regulations.RemoveRange(_dbContext.Regulations);
        _dbContext.ExternalLogins.RemoveRange(_dbContext.ExternalLogins);
        _dbContext.Users.RemoveRange(_dbContext.Users);
        await _dbContext.SaveChangesAsync();

        // Ensure the schema is still created
        await _dbContext.Database.EnsureCreatedAsync();
    }

    protected virtual async Task SeedDataAsync()
    {
        // Example: Seed a test user
        var faker = new Faker();
        var testUser = new User
        {
            Username = faker.Internet.UserName(),
            Role = "User",
            ExternalLogins = new List<ExternalLogin>
            {
                new ExternalLogin
                {
                    Provider = "google",
                    ExternalId = faker.Random.Guid().ToString(),
                    CreatedAt = DateTime.UtcNow
                }
            }
        };

        if (!await _dbContext.Users.AnyAsync(u => u.Username == testUser.Username))
        {
            _dbContext.Users.Add(testUser);
            await _dbContext.SaveChangesAsync();
        }
    }

    protected async Task<string> GetUserTokenAsync()
    {
        // Create a mock external user registration
        var registerRequest = new
        {
            Provider = "google",
            ExternalId = "test_" + Guid.NewGuid().ToString().Substring(0, 8)
        };
        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register-external", registerRequest);
        registerResponse.EnsureSuccessStatusCode();

        var authResponse = await registerResponse.Content.ReadFromJsonAsync<AuthResponseDto>();
        return authResponse?.Token ?? throw new InvalidOperationException("Failed to get authentication token");
    }
}
