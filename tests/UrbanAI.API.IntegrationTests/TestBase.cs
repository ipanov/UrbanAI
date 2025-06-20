using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using UrbanAI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Bogus;
using UrbanAI.Domain.Entities;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;

namespace UrbanAI.API.IntegrationTests;

[Collection("Integration Tests")]
public abstract class TestBase : IAsyncLifetime
{
    protected readonly CustomWebApplicationFactory _factory;
    protected readonly HttpClient _client;
    protected IServiceScope _scope;
    protected ApplicationDbContext _dbContext;

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
        // For in-memory SQLite, the database is recreated for each test run,
        // so explicit clearing via Respawn is not needed.
        // We just ensure the schema is created.
        await _dbContext.Database.EnsureCreatedAsync();
    }

    protected virtual async Task SeedDataAsync()
    {
        // Example: Seed a test user
        var faker = new Faker();
        var testUser = new User
        {
            Username = faker.Internet.UserName(),
            Email = faker.Internet.Email(),
            PasswordHash = "hashedpassword", // In a real scenario, hash this
            Role = "User"
        };

        if (!await _dbContext.Users.AnyAsync(u => u.Username == testUser.Username))
        {
            _dbContext.Users.Add(testUser);
            await _dbContext.SaveChangesAsync();
        }
    }
}
