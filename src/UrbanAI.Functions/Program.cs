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

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices((context, services) =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        // Configure database context
        var connectionString = context.Configuration.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrEmpty(connectionString))
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));
        }
        else
        {
            // Use InMemory database for development/testing
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("UrbanAIDb"));
        }

        // Configure Supabase settings for PostgreSQL
        services.Configure<SupabaseSettings>(
            context.Configuration.GetSection("SupabaseSettings"));

        // Register repositories
        services.AddScoped<IRegulationRepository, RegulationRepository>();
        services.AddScoped<IIssueRepository, IssueRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        // Register application services
        services.AddScoped<IIssueService, IssueService>();
        services.AddScoped<IOAuthService, OAuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRegulationService, RegulationService>();

        // Register HTTP client
        services.AddHttpClient();

        // Configure CORS
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });
        });
    })
    .Build();

host.Run();