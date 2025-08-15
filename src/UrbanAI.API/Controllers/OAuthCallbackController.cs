using Microsoft.AspNetCore.Mvc;
using UrbanAI.Application.DTOs;
using UrbanAI.Application.Interfaces;

namespace UrbanAI.API.Controllers;

/// <summary>
/// Controller for handling OAuth provider callbacks and token exchange.
/// Implements production OAuth flows with PKCE security for Google, Microsoft, and Facebook.
/// </summary>
[ApiController]
[Route("api/v1/oauth")]
public class OAuthCallbackController : ControllerBase
{
    private readonly IOAuthService _oauthService;
    private readonly IUserService _userService;
    private readonly ILogger<OAuthCallbackController> _logger;

    public OAuthCallbackController(
        IOAuthService oauthService,
        IUserService userService,
        ILogger<OAuthCallbackController> logger)
    {
        _oauthService = oauthService;
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Handle OAuth callback from providers (Google, Microsoft, Facebook).
    /// Exchanges authorization code for access token and retrieves user info.
    /// </summary>
    /// <param name="provider">OAuth provider (google, microsoft, facebook)</param>
    /// <param name="code">Authorization code from provider</param>
    /// <param name="state">State parameter for CSRF protection</param>
    /// <param name="codeVerifier">PKCE code verifier</param>
    /// <returns>JWT token and user information</returns>
    [HttpGet("callback/{provider}")]
    public async Task<ActionResult<AuthResponseDto>> HandleCallback(
        string provider,
        [FromQuery] string code,
        [FromQuery] string state,
        [FromQuery] string codeVerifier)
    {
        try
        {
            if (string.IsNullOrEmpty(code))
            {
                return BadRequest(new { error = "Authorization code is required" });
            }

            if (string.IsNullOrEmpty(codeVerifier))
            {
                return BadRequest(new { error = "Code verifier is required for PKCE" });
            }

            // Validate provider
            var validProviders = new[] { "google", "microsoft", "facebook" };
            if (!validProviders.Contains(provider.ToLower()))
            {
                return BadRequest(new { error = "Invalid OAuth provider" });
            }

            // Get OAuth configuration from app settings
            var clientId = GetClientId(provider);
            var clientSecret = GetClientSecret(provider);
            var redirectUri = GetRedirectUri(provider);

            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
            {
                _logger.LogError("OAuth configuration missing for provider {Provider}", provider);
                return StatusCode(500, new { error = "OAuth configuration error" });
            }

            // Exchange code for token
            var tokenResponse = await _oauthService.ExchangeCodeForTokenAsync(
                provider.ToLower(),
                code,
                codeVerifier,
                clientId,
                clientSecret,
                redirectUri);

            // Get user info from provider
            var userInfo = await _oauthService.GetUserInfoAsync(
                provider.ToLower(),
                tokenResponse.AccessToken);

            // Create or get existing user
            var user = await _userService.GetOrCreateExternalUserAsync(
                provider.ToLower(),
                userInfo.Id,
                userInfo.Name ?? $"{provider}_{userInfo.Id}");

            // Generate JWT token
            var jwtToken = await _userService.GenerateJwtTokenAsync(user);

            return Ok(new AuthResponseDto
            {
                Token = jwtToken,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Role = user.Role
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OAuth callback failed for provider {Provider}", provider);
            return StatusCode(500, new { error = "Authentication failed" });
        }
    }

    /// <summary>
    /// Generate OAuth authorization URL with PKCE parameters.
    /// </summary>
    /// <param name="provider">OAuth provider (google, microsoft, facebook)</param>
    /// <returns>Authorization URL and PKCE parameters</returns>
    [HttpPost("authorize/{provider}")]
    public ActionResult<OAuthAuthorizationDto> GetAuthorizationUrl(string provider)
    {
        try
        {
            // Validate provider
            var validProviders = new[] { "google", "microsoft", "facebook" };
            if (!validProviders.Contains(provider.ToLower()))
            {
                return BadRequest(new { error = "Invalid OAuth provider" });
            }

            var clientId = GetClientId(provider);
            var redirectUri = GetRedirectUri(provider);

            if (string.IsNullOrEmpty(clientId))
            {
                _logger.LogError("OAuth client ID missing for provider {Provider}", provider);
                return StatusCode(500, new { error = "OAuth configuration error" });
            }

            // Generate PKCE parameters
            var codeVerifier = _oauthService.GenerateCodeVerifier();
            var codeChallenge = _oauthService.GenerateCodeChallenge(codeVerifier);
            var state = _oauthService.GenerateState();

            // Build authorization URL
            var authUrl = _oauthService.BuildAuthorizationUrl(
                provider.ToLower(),
                clientId,
                redirectUri,
                state,
                codeChallenge);

            return Ok(new OAuthAuthorizationDto
            {
                AuthorizationUrl = authUrl,
                CodeVerifier = codeVerifier,
                State = state
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate authorization URL for provider {Provider}", provider);
            return StatusCode(500, new { error = "Authorization URL generation failed" });
        }
    }

    private string GetClientId(string provider) => provider.ToLower() switch
    {
        "google" => Configuration[$"OAuth:Google:ClientId"] ?? string.Empty,
        "microsoft" => Configuration[$"OAuth:Microsoft:ClientId"] ?? string.Empty,
        "facebook" => Configuration[$"OAuth:Facebook:ClientId"] ?? string.Empty,
        _ => string.Empty
    };

    private string GetClientSecret(string provider) => provider.ToLower() switch
    {
        "google" => Configuration[$"OAuth:Google:ClientSecret"] ?? string.Empty,
        "microsoft" => Configuration[$"OAuth:Microsoft:ClientSecret"] ?? string.Empty,
        "facebook" => Configuration[$"OAuth:Facebook:ClientSecret"] ?? string.Empty,
        _ => string.Empty
    };

    private string GetRedirectUri(string provider) => provider.ToLower() switch
    {
        "google" => Configuration[$"OAuth:Google:RedirectUri"] ?? $"{Request.Scheme}://{Request.Host}/api/v1/oauth/callback/google",
        "microsoft" => Configuration[$"OAuth:Microsoft:RedirectUri"] ?? $"{Request.Scheme}://{Request.Host}/api/v1/oauth/callback/microsoft",
        "facebook" => Configuration[$"OAuth:Facebook:RedirectUri"] ?? $"{Request.Scheme}://{Request.Host}/api/v1/oauth/callback/facebook",
        _ => string.Empty
    };

    private IConfiguration Configuration => HttpContext.RequestServices.GetRequiredService<IConfiguration>();
}
