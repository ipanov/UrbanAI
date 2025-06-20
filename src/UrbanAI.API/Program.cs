using System.Reflection;
using Microsoft.EntityFrameworkCore;
using UrbanAI.Infrastructure.Data;
using UrbanAI.Domain.Interfaces;
using UrbanAI.Infrastructure.Repositories;
using UrbanAI.Application.Interfaces;
using UrbanAI.Application.Services;
using UrbanAI.Infrastructure.Data.Models; // Assuming MongoDbContext is here or in a related namespace
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure MongoDB settings
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

// Register MongoDbContext and repositories
builder.Services.AddSingleton<MongoDbContext>();
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

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

builder.Services.AddScoped<UrbanAI.Application.Features.Issues.IIssueService, UrbanAI.Application.Features.Issues.IssueService>();
builder.Services.AddScoped<UrbanAI.Application.Features.Users.IUserService, UrbanAI.Application.Features.Users.UserService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();

public partial class Program { }
