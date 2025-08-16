using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using UrbanAI.Infrastructure.Data;
using UrbanAI.Domain.Interfaces;
using UrbanAI.Infrastructure.Repositories;
using UrbanAI.Application.Interfaces;
using UrbanAI.Application.Services;
using System.Reflection;
using Microsoft.Extensions.Http;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices((context, services) =>
    {
        // Configure database context based on environment
        var connectionString = context.Configuration.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrEmpty(connectionString))
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));
        }

        // Configure MongoDB settings
        services.Configure<MongoDbSettings>(
            context.Configuration.GetSection("MongoDbSettings"));

        // Register MongoDbContext and repositories
        services.AddSingleton<MongoDbContext>();
        services.AddScoped<IRegulationRepository, RegulationRepository>();
        services.AddScoped<IIssueRepository, IssueRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        // Register HTTP client factory
        services.AddHttpClient();

        // Register application services
        services.AddScoped<IIssueService, IssueService>();
        services.AddScoped<IOAuthService, OAuthService>();
        services.AddScoped<IUserService, UserService>();

        // Register configuration
        services.AddSingleton<IConfiguration>(context.Configuration);
    })
    .Build();

host.Run();
