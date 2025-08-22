using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using UrbanAI.Infrastructure.Data;
using UrbanAI.Domain.Interfaces;
using UrbanAI.Infrastructure.Repositories;
using UrbanAI.Domain.Entities;
using Npgsql;
using Npgsql.EntityFrameworkCore.PostgreSQL;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Configure database context based on environment
// - Development: Local PostgreSQL (Supabase) or Docker PostgreSQL
// - Staging/Production: Supabase PostgreSQL Database
// - Testing: InMemory provider (configured in CustomWebApplicationFactory)
if (!builder.Environment.IsEnvironment("Testing"))
{
    // Temporarily use InMemory database for development testing
    // TODO: Switch back to PostgreSQL once it's installed and configured
    if (builder.Environment.IsDevelopment())
    {
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseInMemoryDatabase("UrbanAITestDb"));
    }
    else
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("DefaultConnection connection string is not configured.");
        }

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));
    }
}

// Configure PostgreSQL settings
builder.Services.Configure<SupabaseSettings>(
    builder.Configuration.GetSection("SupabaseSettings"));

// Register repositories
builder.Services.AddScoped<IRegulationRepository, RegulationRepository>();

builder.Services.AddScoped<IIssueRepository, IssueRepository>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});
builder.Services.AddHttpClient();

// Add CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",      // Development frontend
                "https://www.urbanai.site",   // Production frontend
                "http://localhost:5173"       // Vite default dev server
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add session middleware for OAuth flow
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Add Authentication and JWT configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSecret = builder.Configuration["Jwt:Secret"] ??
        throw new InvalidOperationException("JWT Secret is not configured.");
    var key = Encoding.ASCII.GetBytes(jwtSecret);

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
})
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"] ??
        throw new InvalidOperationException("Google ClientId is not configured.");
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ??
        throw new InvalidOperationException("Google ClientSecret is not configured.");
})
.AddMicrosoftAccount(options =>
{
    options.ClientId = builder.Configuration["Authentication:Microsoft:ClientId"] ??
        throw new InvalidOperationException("Microsoft ClientId is not configured.");
    options.ClientSecret = builder.Configuration["Authentication:Microsoft:ClientSecret"] ??
        throw new InvalidOperationException("Microsoft ClientSecret is not configured.");
});

builder.Services.AddAuthorization();

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

builder.Services.AddScoped<UrbanAI.Application.Interfaces.IIssueService, UrbanAI.Application.Services.IssueService>();
builder.Services.AddScoped<UrbanAI.Application.Interfaces.IOAuthService, UrbanAI.Application.Services.OAuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseRouting(); // Add routing middleware
app.UseCors("AllowFrontend"); // Enable CORS
app.UseSession(); // Add session middleware
app.UseAuthentication(); // Add authentication middleware
app.UseAuthorization(); // Add authorization middleware

app.MapControllers(); // Map controller endpoints

app.Run();

/// <summary>
/// Main entry point for the application.
/// </summary>
public partial class Program { }
