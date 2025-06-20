using Microsoft.AspNetCore.Mvc;
using UrbanAI.Application.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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

namespace UrbanAI.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private const string JwtSecret = "c97b177d-55c8-4c02-a258-30b6e1f92301"; // Replace with a strong secret
        private const string JwtIssuer = "UrbanAI";

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;

        public AuthController(IHttpClientFactory httpClientFactory, IConfiguration configuration, ApplicationDbContext dbContext)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Username, Email, and Password are required.");
            }

            if (await _dbContext.Users.AnyAsync(u => u.Username == request.Username || u.Email == request.Email))
            {
                return Conflict("User with this username or email already exists.");
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "User" // Default role
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
            if (request.Provider == "google")
            {
                var googleToken = request.Token;
                if (string.IsNullOrEmpty(googleToken))
                {
                    return BadRequest("Google token is required.");
                }

                // Check if Google token validation is disabled
                var disableGoogleTokenValidation = _configuration.GetValue<bool>("Authentication:DisableGoogleTokenValidation");

                if (!disableGoogleTokenValidation)
                {
                    // Validate the Google token
                    var httpClient = _httpClientFactory.CreateClient();
                    var googleValidationUrl = $"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={googleToken}";
                    var googleResponse = await httpClient.GetAsync(googleValidationUrl);

                    if (!googleResponse.IsSuccessStatusCode)
                    {
                        return Unauthorized("Invalid Google token.");
                    }
                }

                // Token is valid (or validation is disabled), generate anonymous JWT
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(JwtSecret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, "anonymous"), // No PII
                        new Claim("isAuthenticated", "true"),
                        new Claim(ClaimTypes.Role, "reporter")
                    }),
                    Issuer = JwtIssuer,
                    Audience = JwtIssuer,
                    Expires = DateTime.UtcNow.AddHours(1), // Short-lived token
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var accessToken = tokenHandler.WriteToken(token);

                var response = new AuthResponseDto
                {
                    Token = accessToken
                };

                return Ok(response);
            }
            else
            {
                return BadRequest("Unsupported provider.");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(JwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username!),
                    new Claim(ClaimTypes.Email, user.Email!),
                    new Claim(ClaimTypes.Role, user.Role!)
                }),
                Issuer = JwtIssuer,
                Audience = JwtIssuer,
                Expires = DateTime.UtcNow.AddDays(7), // Token valid for 7 days
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
