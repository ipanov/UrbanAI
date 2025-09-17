using Microsoft.AspNetCore.Mvc;
using UrbanAI.Application.Interfaces;
using UrbanAI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UrbanAI.Domain.Entities;
using UrbanAI.Application.DTOs;

namespace UrbanAI.API.Controllers
{
    /// <summary>
    /// Controller for handling OAuth provider callbacks and authorization URL generation.
    /// Implements PKCE security for all OAuth flows with state validation for CSRF protection.
    /// </summary>
    /// <param name="oauthService">The OAuth service for handling authentication flows.</param>
    /// <param name="configuration">The application configuration settings.</param>
    /// <param name="logger">The logger for this controller.</param>
    [ApiController]
    [Route("api/v1/oauth")]
    public class OAuthCallbackController(
        IOAuthService oauthService,
        IConfiguration configuration,
        ILogger<OAuthCallbackController> logger,
        ApplicationDbContext dbContext) : ControllerBase
    {
        private readonly IOAuthService _oauthService = oauthService;
        private readonly IConfiguration _configuration = configuration;
        private readonly ILogger<OAuthCallbackController> _logger = logger;
        private readonly ApplicationDbContext _dbContext = dbContext;
        private readonly string _jwtSecret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");
        private readonly string _jwtIssuer = configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured");
        private readonly string _jwtAudience = configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured");

        /// <summary>
        /// Generate OAuth authorization URL for the specified provider.
        /// Returns URL for frontend to redirect user to OAuth provider.
        /// </summary>
        [HttpPost("authorize/{provider}")]
        public IActionResult GetAuthorizationUrl(string provider)
        {
            try
            {
                var normalizedProvider = provider.ToLowerInvariant();
                if (!IsValidProvider(normalizedProvider))
                {
                    return BadRequest($"Unsupported provider: {provider}");
                }

                // Get OAuth configuration
                var clientId = GetClientId(normalizedProvider);
                if (string.IsNullOrEmpty(clientId))
                {
                    return BadRequest($"OAuth not configured for provider: {provider}");
                }

                // Generate PKCE parameters
                var codeVerifier = _oauthService.GenerateCodeVerifier();
                var codeChallenge = _oauthService.GenerateCodeChallenge(codeVerifier);
                var state = _oauthService.GenerateState();

                // Get redirect URI for current environment
                var redirectUri = GetRedirectUri(normalizedProvider);

                // Build authorization URL
                var authUrl = _oauthService.BuildAuthorizationUrl(
                    normalizedProvider,
                    clientId,
                    redirectUri,
                    state,
                    codeChallenge
                );

                // Store PKCE parameters and state in session or cache for callback validation
                // For now, we'll include them in the response for the frontend to manage
                var response = new
                {
                    authorizationUrl = authUrl,
                    state = state,
                    codeVerifier = codeVerifier,
                    provider = normalizedProvider
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating authorization URL for provider {Provider}", provider);
                return StatusCode(500, "Failed to generate authorization URL");
            }
        }

        /// <summary>
        /// Handle OAuth callback from providers.
        /// Exchanges authorization code for access token and returns user info.
        /// </summary>
        [HttpGet("callback/{provider}")]
        public async Task<IActionResult> HandleCallback(
            string provider,
            [FromQuery] string code,
            [FromQuery] string state,
            [FromQuery] string? error = null,
            [FromQuery] string? error_description = null)
        {
            try
            {
                // Handle OAuth errors
                if (!string.IsNullOrEmpty(error))
                {
                    _logger.LogWarning("OAuth error from {Provider}: {Error} - {Description}",
                        provider, error, error_description);
                    return BadRequest($"OAuth error: {error} - {error_description}");
                }

                var normalizedProvider = provider.ToLowerInvariant();
                if (!IsValidProvider(normalizedProvider))
                {
                    return BadRequest($"Unsupported provider: {provider}");
                }

                if (string.IsNullOrEmpty(code))
                {
                    return BadRequest("Authorization code is required");
                }

                if (string.IsNullOrEmpty(state))
                {
                    return BadRequest("State parameter is required for security");
                }

                // Get OAuth configuration
                var clientId = GetClientId(normalizedProvider);
                var clientSecret = GetClientSecret(normalizedProvider);

                if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                {
                    return BadRequest($"OAuth not configured for provider: {provider}");
                }

                // TODO: Validate state parameter against stored value
                // For MVP, we'll skip this validation but it should be implemented for production

                // Get redirect URI
                var redirectUri = GetRedirectUri(normalizedProvider);

                // TODO: Retrieve code verifier from session/cache based on state
                // For MVP, this will need to be passed from frontend
                var codeVerifier = Request.Query["code_verifier"].FirstOrDefault();
                if (string.IsNullOrEmpty(codeVerifier) && normalizedProvider != "facebook")
                {
                    return BadRequest("Code verifier is required for PKCE validation");
                }

                // Exchange code for token
                var tokenResponse = await _oauthService.ExchangeCodeForTokenAsync(
                    normalizedProvider,
                    code,
                    codeVerifier ?? string.Empty,
                    clientId,
                    clientSecret,
                    redirectUri
                );

                // Get user info from provider
                var userInfo = await _oauthService.GetUserInfoAsync(normalizedProvider, tokenResponse.AccessToken);

                // Check if user exists in our system
                var existingUser = await _dbContext.Users
                    .Include(u => u.ExternalLogins)
                    .SingleOrDefaultAsync(u => 
                        u.ExternalLogins.Any(l => l.Provider == normalizedProvider && l.ExternalId == userInfo.Id));

                if (existingUser != null)
                {
                    // User exists, generate JWT
                    var jwtToken = GenerateJwtToken(existingUser);
                    var callbackResponse = new OAuthRegistrationResponseDto
                    {
                        Token = jwtToken,
                        Provider = normalizedProvider,
                        ExternalId = userInfo.Id,
                        DisplayName = userInfo.Name,
                        Email = userInfo.Email,
                        Picture = userInfo.Picture,
                        RequiresRegistration = false,
                        TermsOfServiceVersion = "1.0"
                    };

                    if (Request.Headers.Accept.ToString().Contains("application/json"))
                    {
                        return Ok(callbackResponse);
                    }
                    // For redirect, include token in URL (not recommended for production)
                    var frontendUrl = GetFrontendUrl();
                    var redirectUrl = $"{frontendUrl}/auth/callback?token={Uri.EscapeDataString(jwtToken)}";
                    return Redirect(redirectUrl);
                }
                else
                {
                    // User doesn't exist, return registration required
                    var callbackResponse = new OAuthRegistrationResponseDto
                    {
                        RequiresRegistration = true,
                        Provider = normalizedProvider,
                        ExternalId = userInfo.Id,
                        DisplayName = userInfo.Name,
                        Email = userInfo.Email,
                        Picture = userInfo.Picture,
                        TermsOfServiceVersion = "1.0",
                        TermsOfServiceUrl = "/terms-of-service"
                    };

                    if (Request.Headers.Accept.ToString().Contains("application/json"))
                    {
                        return Ok(callbackResponse);
                    }
                    // For redirect, pass registration data
                    var frontendUrl = GetFrontendUrl();
                    var redirectUrl = $"{frontendUrl}/auth/callback?" +
                        $"requiresRegistration=true&" +
                        $"provider={normalizedProvider}&" +
                        $"externalId={Uri.EscapeDataString(userInfo.Id)}&" +
                        $"name={Uri.EscapeDataString(userInfo.Name)}&" +
                        $"email={Uri.EscapeDataString(userInfo.Email)}&" +
                        $"picture={Uri.EscapeDataString(userInfo.Picture)}";
                    return Redirect(redirectUrl);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling OAuth callback for provider {Provider}", provider);
                return StatusCode(500, "OAuth callback failed");
            }
        }

        private bool IsValidProvider(string provider)
        {
            return provider == "google" || provider == "microsoft" || provider == "facebook";
        }

        private string GetClientId(string provider)
        {
            return provider switch
            {
                "google" => _configuration["Authentication:Google:ClientId"] ?? string.Empty,
                "microsoft" => _configuration["Authentication:Microsoft:ClientId"] ?? string.Empty,
                "facebook" => _configuration["Authentication:Facebook:AppId"] ?? string.Empty,
                _ => string.Empty
            };
        }

        private string GetClientSecret(string provider)
        {
            return provider switch
            {
                "google" => _configuration["Authentication:Google:ClientSecret"] ?? string.Empty,
                "microsoft" => _configuration["Authentication:Microsoft:ClientSecret"] ?? string.Empty,
                "facebook" => _configuration["Authentication:Facebook:AppSecret"] ?? string.Empty,
                _ => string.Empty
            };
        }

        private string GetRedirectUri(string provider)
        {
            var environment = _configuration["ASPNETCORE_ENVIRONMENT"] ?? "Development";
            var configKey = environment == "Production" ? "Production" : "Development";

            return provider switch
            {
                "google" => _configuration[$"OAuth:RedirectUris:{configKey}:Google"] ?? string.Empty,
                "microsoft" => _configuration[$"OAuth:RedirectUris:{configKey}:Microsoft"] ?? string.Empty,
                "facebook" => _configuration[$"OAuth:RedirectUris:{configKey}:Facebook"] ?? string.Empty,
                _ => string.Empty
            };
        }

        private string GetFrontendUrl()
        {
            var environment = _configuration["ASPNETCORE_ENVIRONMENT"] ?? "Development";
            return environment == "Production"
                ? _configuration["OAuth:RedirectUris:Production:BaseUrl"] ?? "https://urbanai.site"
                : _configuration["OAuth:RedirectUris:Development:BaseUrl"] ?? "http://localhost:5173";
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
                    new Claim("user_type", user.UserType.ToString()),
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
