using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using UrbanAI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Bogus;
using UrbanAI.Domain.Entities;

namespace UrbanAI.API.IntegrationTests
{
    [Collection("Integration Tests")]
    public abstract class TestBase : IAsyncLifetime
    {
        protected readonly CustomWebApplicationFactory _factory;
        protected HttpClient _client;
        protected IServiceScope _scope;
        protected ApplicationDbContext _dbContext;

        public TestBase(CustomWebApplicationFactory factory)
        {
            _factory = factory;
        }

        public async Task InitializeAsync()
        {
            _client = _factory.CreateClient();
            _scope = _factory.Services.CreateScope();
            _dbContext = _scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            await ClearDatabaseAsync();
            await SeedDataAsync();
        }

        public async Task DisposeAsync()
        {
            _scope.Dispose();
            await Task.CompletedTask; // To satisfy IAsyncLifetime interface
        }

        protected virtual async Task ClearDatabaseAsync()
        {
            await _factory.ResetDatabaseAsync();
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

    [CollectionDefinition("Integration Tests")]
    public class IntegrationTestCollection : ICollectionFixture<CustomWebApplicationFactory>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture interfaces.
    }
}
