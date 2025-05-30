using Microsoft.AspNetCore.Mvc;
using UrbanAI.Application.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace UrbanAI.API.Controllers
{
    [ApiController]
    [Route("v1/auth")]
    public class AuthController : ControllerBase
    {
        private const string JwtSecret = "c97b177d-55c8-4c02-a258-30b6e1f92301"; // Replace with a strong secret
        private const string JwtIssuer = "UrbanAI";

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public AuthController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
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
                    AccessToken = accessToken
                };

                return Ok(response);
            }
            else
            {
                return BadRequest("Unsupported provider.");
            }
        }
    }
}
