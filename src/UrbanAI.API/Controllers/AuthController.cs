using Microsoft.AspNetCore.Mvc;
using UrbanAI.Application.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UrbanAI.Domain.Entities;
using UrbanAI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace UrbanAI.API.Controllers
{
    /// <summary>
    /// Controller for OAuth authentication and user management.
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;
        private readonly string _jwtSecret;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;

        public AuthController(
            IConfiguration configuration,
            ApplicationDbContext dbContext)
        {
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

        /// <summary>
        /// Registers an anonymous user linked to an external provider identifier.
        /// </summary>
        [HttpPost("register-external")]
        public async Task<IActionResult> RegisterExternal([FromBody] ExternalRegisterDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Provider) || string.IsNullOrEmpty(dto.ExternalId))
            {
                return BadRequest("Provider and ExternalId are required.");
            }

            var provider = dto.Provider.ToLowerInvariant();
            var externalId = dto.ExternalId;

            var existing = await _dbContext.Users
                .Include(u => u.ExternalLogins)
                .SingleOrDefaultAsync(u => u.ExternalLogins.Any(l => l.Provider == provider && l.ExternalId == externalId));

            if (existing != null)
            {
                var existingToken = GenerateJwtToken(existing);
                return Ok(new AuthResponseDto { Token = existingToken });
            }

            var user = new User
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
