using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using UrbanAI.Infrastructure.Data;
using Microsoft.Data.Sqlite;
using System.Data.Common;
using Microsoft.Extensions.Configuration;

namespace UrbanAI.API.IntegrationTests
{
    public class UnauthenticatedWebApplicationFactory : WebApplicationFactory<Program>
    {
        private readonly DbConnection _connection;

        public UnauthenticatedWebApplicationFactory()
        {
            _connection = new SqliteConnection("Data Source=:memory:");
            _connection.Open();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {
                var testConfig = new Dictionary<string, string>
                {
                    ["Jwt:Secret"] = "test-secret-key-for-integration-tests-must-be-long-enough-256-bits",
                    ["Jwt:Issuer"] = "test-issuer",
                    ["Jwt:Audience"] = "test-audience"
                };

                config.AddInMemoryCollection(testConfig!);
            });

            builder.ConfigureServices(services =>
            {
                // Remove existing DbContext
                var dbContextDescriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
                if (dbContextDescriptor != null)
                {
                    services.Remove(dbContextDescriptor);
                }

                // Add test DbContext
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseSqlite(_connection);
                });
            });

            builder.UseEnvironment("Testing");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _connection?.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
