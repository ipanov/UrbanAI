using Microsoft.AspNetCore.Mvc;
using UrbanAI.Application.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UrbanAI.Domain.Entities;
using UrbanAI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using UrbanAI.Application.Interfaces;

namespace UrbanAI.API.Controllers
{
    /// <summary>
    /// Controller for OAuth-only authentication and user management.
    /// Implements: external token exchange (Google/Microsoft/Facebook) and a registration 
    /// endpoint for external providers that requires explicit legal acceptance on the frontend 
    /// before creating an anonymous, PII-free user record. Local username/password authentication 
    /// has been removed for security and privacy compliance.
    /// </summary>
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
            ApplicationDbContext dbContext,
            IOAuthService oauthService)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _dbContext = dbContext;
            _oauthService = oauthService;
            _jwtSecret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");
            _jwtIssuer = configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured");
            _jwtAudience = configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured");
        }

        private readonly IOAuthService _oauthService;


        // -------------------------
        // OAuth authorization endpoint
        // -------------------------
        /// <summary>
        /// Generates OAuth authorization URL with PKCE for the specified provider
        /// </summary>
        [HttpPost("authorize/{provider}")]
        public async Task<IActionResult> GetAuthorizationUrl([FromRoute] string provider)
        {
            var normalizedProvider = provider.ToLowerInvariant();
            
            // Validate provider
            if (normalizedProvider != "google" && normalizedProvider != "microsoft" && normalizedProvider != "facebook")
            {
                return BadRequest(new { error = "Unsupported provider. Supported providers: google, microsoft, facebook" });
            }

            var clientId = _configuration[$"Authentication:{char.ToUpper(normalizedProvider[0]) + normalizedProvider[1..]}:ClientId"];
            var clientSecret = _configuration[$"Authentication:{char.ToUpper(normalizedProvider[0]) + normalizedProvider[1..]}:ClientSecret"];
            
            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
            {
                return BadRequest(new { error = $"OAuth credentials not configured for {normalizedProvider}" });
            }

            // Get redirect URI from configuration
            var capitalizedProvider = char.ToUpper(normalizedProvider[0]) + normalizedProvider[1..];
            var redirectUri = _configuration[$"OAuth:RedirectUris:Development:{capitalizedProvider}"] ?? 
                            _configuration["OAuth:RedirectUris:Development:BaseUrl"] + "/auth/callback";

            // Generate PKCE values
            var codeVerifier = _oauthService.GenerateCodeVerifier();
            var codeChallenge = _oauthService.GenerateCodeChallenge(codeVerifier);
            var state = _oauthService.GenerateState();

            // Build authorization URL
            var authorizationUrl = _oauthService.BuildAuthorizationUrl(
                normalizedProvider, 
                clientId, 
                redirectUri, 
                state, 
                codeChallenge
            );

            // Store PKCE values in session for later use
            // In a real app, you'd use distributed session storage
            HttpContext.Session.SetString("oauth_code_verifier", codeVerifier);
            HttpContext.Session.SetString("oauth_state", state);
            HttpContext.Session.SetString("oauth_provider", normalizedProvider);

            return Ok(new 
            { 
                authorizationUrl,
                state,
                codeChallenge,
                codeVerifier // Return for testing/debugging
            });
        }

        // -------------------------
        // OAuth callback endpoint
        // -------------------------
        /// <summary>
        /// Handles OAuth callback after user authentication with provider
        /// </summary>
        [HttpGet("callback")]
        public async Task<IActionResult> OAuthCallback([FromQuery] string code, [FromQuery] string state, [FromQuery] string error = null)
        {
            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(new { error = $"OAuth error: {error}" });
            }

            if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
            {
                return BadRequest(new { error = "Authorization code and state are required" });
            }

            // Retrieve stored values from session
            var storedState = HttpContext.Session.GetString("oauth_state");
            var storedProvider = HttpContext.Session.GetString("oauth_provider");
            var codeVerifier = HttpContext.Session.GetString("oauth_code_verifier");

            if (string.IsNullOrEmpty(storedState) || storedState != state)
            {
                return BadRequest(new { error = "Invalid or missing state parameter" });
            }

            if (string.IsNullOrEmpty(storedProvider) || string.IsNullOrEmpty(codeVerifier))
            {
                return BadRequest(new { error = "OAuth session data missing" });
            }

            var capitalizedProvider = char.ToUpper(storedProvider[0]) + storedProvider[1..];
            var clientId = _configuration[$"Authentication:{capitalizedProvider}:ClientId"];
            var clientSecret = _configuration[$"Authentication:{capitalizedProvider}:ClientSecret"];
            
            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
            {
                return BadRequest(new { error = $"OAuth credentials not configured for {storedProvider}" });
            }

            // Get redirect URI from configuration
            var redirectUri = _configuration[$"OAuth:RedirectUris:Development:{capitalizedProvider}"] ?? 
                            _configuration["OAuth:RedirectUris:Development:BaseUrl"] + "/auth/callback";

            try
            {
                // Exchange authorization code for access token
                var tokenResponse = await _oauthService.ExchangeCodeForTokenAsync(
                    storedProvider, 
                    code, 
                    codeVerifier, 
                    clientId, 
                    clientSecret, 
                    redirectUri
                );

                // Get user info from provider
                var userInfo = await _oauthService.GetUserInfoAsync(storedProvider, tokenResponse.AccessToken);

                // Check if user exists in our system
                var existingUser = await _dbContext.Users
                    .Include(u => u.ExternalLogins)
                    .SingleOrDefaultAsync(u => 
                        u.ExternalLogins.Any(l => l.Provider == storedProvider && l.ExternalId == userInfo.Id));

                if (existingUser != null)
                {
                    // User exists, generate JWT
                    var jwtToken = GenerateJwtToken(existingUser);
                    return Ok(new { token = jwtToken, userInfo = new { userInfo.Id, userInfo.Name, userInfo.FirstName, userInfo.LastName, userInfo.Email } });
                }
                else
                {
                    // User doesn't exist, return registration required
                    return Ok(new { 
                        requiresRegistration = true, 
                        provider = storedProvider, 
                        externalId = userInfo.Id,
                        userInfo = new { userInfo.Id, userInfo.Name, userInfo.FirstName, userInfo.LastName, userInfo.Email }
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = $"OAuth callback failed: {ex.Message}" });
            }
        }

        // -------------------------
        // External provider exchange
        // -------------------------
        [HttpPost("exchange-token")]
        public async Task<IActionResult> ExchangeToken([FromBody] AuthRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Provider) || string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("Provider and token are required.");
            }

            // Developer convenience: support tokens like "mock:alice123" for local testing
            if (request.Token.StartsWith("mock:"))
            {
                var externalId = request.Token.Substring("mock:".Length);
                return await HandleExternalLogin(request.Provider.ToLowerInvariant(), externalId);
            }

            switch (request.Provider.ToLowerInvariant())
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

        /// <summary>
        /// Lookup an existing user by provider+externalId and return our internal JWT.
        /// If no user exists, return 404 with requiresRegistration = true so the frontend can
        /// present the legal agreement and then call register-external.
        /// </summary>
        private async Task<IActionResult> HandleExternalLogin(string provider, string externalId)
        {
            var user = await _dbContext.Users
                .Include(u => u.ExternalLogins)
                .SingleOrDefaultAsync(u =>
                    u.ExternalLogins.Any(l => l.Provider == provider && l.ExternalId == externalId));

            if (user == null)
            {
                // Inform frontend that registration (with explicit legal acceptance) is required
                return NotFound(new { requiresRegistration = true, provider, externalId });
            }

            var token = GenerateJwtToken(user);
            return Ok(new AuthResponseDto { Token = token });
        }

        // -------------------------
        // Registration for external providers (after legal acceptance)
        // -------------------------
        /// <summary>
        /// DTO for register-external
        /// </summary>
        public class ExternalRegisterDto
        {
            public string? Provider { get; set; }
            public string? ExternalId { get; set; }
        }

        /// <summary>
        /// Registers an anonymous user linked to an external provider identifier.
        /// Idempotent: if a user already exists for the provider+externalId returns existing token.
        /// IMPORTANT: This endpoint MUST only be called after the user has explicitly accepted
        /// the legal agreement in the frontend.
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

            // Check existing user
            var existing = await _dbContext.Users
                .Include(u => u.ExternalLogins)
                .SingleOrDefaultAsync(u => u.ExternalLogins.Any(l => l.Provider == provider && l.ExternalId == externalId));

            if (existing != null)
            {
                var existingToken = GenerateJwtToken(existing);
                return Ok(new AuthResponseDto { Token = existingToken });
            }

            // Create anonymous user linked only to provider+externalId (no PII)
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

        // -------------------------
        // JWT generation
        // -------------------------
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
