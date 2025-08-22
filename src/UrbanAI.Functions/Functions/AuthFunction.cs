using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using UrbanAI.Application.DTOs;
using UrbanAI.Application.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UrbanAI.Domain.Entities;
using UrbanAI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace UrbanAI.Functions.Functions
{
    public class AuthFunction
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;
        private readonly string _jwtSecret;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;

        public AuthFunction(
            ILoggerFactory loggerFactory,
            IConfiguration configuration,
            ApplicationDbContext dbContext)
        {
            _logger = loggerFactory.CreateLogger<AuthFunction>();
            _configuration = configuration;
            _dbContext = dbContext;
            _jwtSecret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");
            _jwtIssuer = configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured");
            _jwtAudience = configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured");
        }

        public class ExternalRegisterDto
        {
            public string? Provider { get; set; }
            public string? ExternalId { get; set; }
        }

        [Function("RegisterExternal")]
        public async Task<HttpResponseData> RegisterExternal(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/register-external")] HttpRequestData req)
        {
            _logger.LogInformation("Processing external user registration");

            try
            {
                var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var dto = JsonSerializer.Deserialize<ExternalRegisterDto>(requestBody, new JsonSerializerOptions 
                { 
                    PropertyNameCaseInsensitive = true 
                });

                if (dto == null || string.IsNullOrEmpty(dto.Provider) || string.IsNullOrEmpty(dto.ExternalId))
                {
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequest.WriteStringAsync("Provider and ExternalId are required");
                    return badRequest;
                }

                // Check if user already exists
                var existingLogin = await _dbContext.ExternalLogins
                    .Include(el => el.User)
                    .FirstOrDefaultAsync(el => el.Provider == dto.Provider && el.ProviderKey == dto.ExternalId);

                if (existingLogin != null)
                {
                    // User already exists, return existing user token
                    var existingToken = GenerateJwtToken(existingLogin.User);
                    var existingResponse = req.CreateResponse(HttpStatusCode.OK);
                    await existingResponse.WriteStringAsync(JsonSerializer.Serialize(new AuthResponseDto
                    {
                        Token = existingToken,
                        Username = existingLogin.User.Username,
                        UserId = existingLogin.User.Id
                    }));
                    return existingResponse;
                }

                // Create new anonymous user
                var user = new User
                {
                    Username = $"user_{Guid.NewGuid():N}",
                    IsAnonymous = true,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();

                // Create external login record
                var externalLogin = new ExternalLogin
                {
                    UserId = user.Id,
                    Provider = dto.Provider,
                    ProviderKey = dto.ExternalId
                };

                _dbContext.ExternalLogins.Add(externalLogin);
                await _dbContext.SaveChangesAsync();

                // Generate JWT token
                var token = GenerateJwtToken(user);

                var response = req.CreateResponse(HttpStatusCode.Created);
                await response.WriteStringAsync(JsonSerializer.Serialize(new AuthResponseDto
                {
                    Token = token,
                    Username = user.Username,
                    UserId = user.Id
                }));

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during external user registration");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim("userId", user.Id.ToString()),
                    new Claim("username", user.Username),
                    new Claim("isAnonymous", user.IsAnonymous.ToString().ToLower())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _jwtIssuer,
                Audience = _jwtAudience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}