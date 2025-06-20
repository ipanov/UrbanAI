using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;
using Respawn;
using System.Data.Common;
using Npgsql;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UrbanAI.Infrastructure.Data;
using System.Linq;

namespace UrbanAI.API.IntegrationTests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
            .WithImage("postgres:latest")
            .WithDatabase("urbanai_test_db")
            .WithUsername("admin")
            .WithPassword("admin")
            .Build();

        private DbConnection _dbConnection = null!;
        private Respawner _respawner = null!;

        public HttpClient HttpClient { get; private set; } = null!;

        public async Task InitializeAsync()
        {
            await _dbContainer.StartAsync();

            _dbConnection = new NpgsqlConnection(_dbContainer.GetConnectionString());

            HttpClient = CreateClient();

            await _dbConnection.OpenAsync();
            await InitializeRespawnerAsync();
        }

        public new async Task DisposeAsync()
        {
            await _dbContainer.DisposeAsync();
            await _dbConnection.DisposeAsync();
        }

        public async Task ResetDatabaseAsync()
        {
            await _respawner.ResetAsync(_dbConnection);
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            Environment.SetEnvironmentVariable("ConnectionStrings:DefaultConnection", _dbContainer.GetConnectionString());

            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string>
                {
                    {"ConnectionStrings:DefaultConnection", _dbContainer.GetConnectionString()}
                });
            });

            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseNpgsql(_dbContainer.GetConnectionString());
                });

                var sp = services.BuildServiceProvider();
                using (var scope = sp.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    dbContext.Database.Migrate();
                }
            });

            builder.UseEnvironment("Development");
        }

        private async Task InitializeRespawnerAsync()
        {
            _respawner = await Respawner.CreateAsync(_dbConnection, new RespawnerOptions
            {
                TablesToIgnore = new Respawn.Graph.Table[] { "__EFMigrationsHistory" },
                DbAdapter = DbAdapter.Postgres
            });
        }
    }
}
