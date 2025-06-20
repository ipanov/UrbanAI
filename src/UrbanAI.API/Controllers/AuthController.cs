using Microsoft.AspNetCore.Mvc;
using UrbanAI.Application.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using UrbanAI.Domain.Entities;
using UrbanAI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Text.Json;

namespace UrbanAI.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;
        private readonly string _jwtSecret;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;

        public AuthController(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ApplicationDbContext dbContext)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _dbContext = dbContext;
            _jwtSecret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");
            _jwtIssuer = configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured");
            _jwtAudience = configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Username and Password are required.");
            }

            if (await _dbContext.Users.AnyAsync(u => u.Username == request.Username))
            {
                return Conflict("Username already exists.");
            }

            var user = new User
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "User"
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            return Ok(new AuthResponseDto { Token = token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Username and Password are required.");
            }

            var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid credentials.");
            }

            var token = GenerateJwtToken(user);
            return Ok(new AuthResponseDto { Token = token });
        }

        [HttpPost("exchange-token")]
        public async Task<IActionResult> ExchangeToken([FromBody] AuthRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Provider) || string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("Provider and token are required.");
            }

            switch (request.Provider.ToLower())
            {
                case "google":
                    return await HandleGoogleToken(request.Token);
                case "microsoft":
                    return await HandleMicrosoftToken(request.Token);
                case "facebook":
                    return await HandleFacebookToken(request.Token);
                default:
                    return BadRequest("Unsupported provider.");
            }
        }

        private async Task<IActionResult> HandleGoogleToken(string token)
        {
            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}");

            if (!response.IsSuccessStatusCode)
            {
                return Unauthorized("Invalid Google token.");
            }

            var content = await response.Content.ReadAsStringAsync();
            var payload = JsonSerializer.Deserialize<JsonDocument>(content);
            var sub = payload?.RootElement.GetProperty("sub").GetString();

            if (string.IsNullOrEmpty(sub))
            {
                return Unauthorized("Invalid token payload.");
            }

            return await HandleExternalLogin("google", sub);
        }

        private async Task<IActionResult> HandleMicrosoftToken(string token)
        {
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            var response = await httpClient.GetAsync("https://graph.microsoft.com/v1.0/me");

            if (!response.IsSuccessStatusCode)
            {
                return Unauthorized("Invalid Microsoft token.");
            }

            var content = await response.Content.ReadAsStringAsync();
            var payload = JsonSerializer.Deserialize<JsonDocument>(content);
            var id = payload?.RootElement.GetProperty("id").GetString();

            if (string.IsNullOrEmpty(id))
            {
                return Unauthorized("Invalid token payload.");
            }

            return await HandleExternalLogin("microsoft", id);
        }

        private async Task<IActionResult> HandleFacebookToken(string token)
        {
            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync($"https://graph.facebook.com/me?access_token={token}");

            if (!response.IsSuccessStatusCode)
            {
                return Unauthorized("Invalid Facebook token.");
            }

            var content = await response.Content.ReadAsStringAsync();
            var payload = JsonSerializer.Deserialize<JsonDocument>(content);
            var id = payload?.RootElement.GetProperty("id").GetString();

            if (string.IsNullOrEmpty(id))
            {
                return Unauthorized("Invalid token payload.");
            }

            return await HandleExternalLogin("facebook", id);
        }

        private async Task<IActionResult> HandleExternalLogin(string provider, string externalId)
        {
            var user = await _dbContext.Users.SingleOrDefaultAsync(u =>
                u.ExternalLogins.Any(l => l.Provider == provider && l.ExternalId == externalId));

            if (user == null)
            {
                // Create new user with external login
                user = new User
                {
                    Username = $"{provider}_{externalId}",
                    Role = "User",
                    ExternalLogins = new List<ExternalLogin>
                    {
                        new ExternalLogin
                        {
                            Provider = provider,
                            ExternalId = externalId
                        }
                    }
                };

                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();
            }

            var token = GenerateJwtToken(user);
            return Ok(new AuthResponseDto { Token = token });
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("auth_time", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
                    new Claim("iss", _jwtIssuer),
                    new Claim("aud", _jwtAudience)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
