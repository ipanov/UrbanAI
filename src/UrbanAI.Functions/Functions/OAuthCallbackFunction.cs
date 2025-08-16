using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using UrbanAI.Application.DTOs;
using UrbanAI.Application.Interfaces;
using System.Net;

namespace UrbanAI.Functions.Functions
{
    /// <summary>
    /// Azure Function for handling OAuth provider callbacks and token exchange.
    /// Migrated from OAuthCallbackController to provide the same functionality as HTTP triggers.
    /// Implements production OAuth flows with PKCE security for Google, Microsoft, and Facebook.
    /// </summary>
    public class OAuthCallbackFunction
    {
        private readonly IOAuthService _oauthService;
        private readonly IUserService _userService;
        private readonly ILogger<OAuthCallbackFunction> _logger;

        public OAuthCallbackFunction(
            IOAuthService oauthService,
            IUserService userService,
            ILogger<OAuthCallbackFunction> logger)
        {
            _oauthService = oauthService;
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Handle OAuth callback from providers (Google, Microsoft, Facebook).
        /// Exchanges authorization code for access token and retrieves user info.
        /// </summary>
        [Function("HandleOAuthCallback")]
        public async Task<HttpResponseData> HandleCallback(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/oauth/callback/{provider}")] HttpRequestData req,
            string provider,
            string code,
            string state,
            string codeVerifier)
        {
            try
            {
                if (string.IsNullOrEmpty(code))
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteAsJsonAsync(new { error = "Authorization code is required" });
                    return badRequestResponse;
                }

                if (string.IsNullOrEmpty(codeVerifier))
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteAsJsonAsync(new { error = "Code verifier is required for PKCE" });
                    return badRequestResponse;
                }

                // Validate provider
                var validProviders = new[] { "google", "microsoft", "facebook" };
                if (!validProviders.Contains(provider.ToLower()))
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteAsJsonAsync(new { error = "Invalid OAuth provider" });
                    return badRequestResponse;
                }

                // Get OAuth configuration from app settings
                var clientId = GetClientId(provider, req);
                var clientSecret = GetClientSecret(provider, req);
                var redirectUri = GetRedirectUri(provider, req);

                if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                {
                    _logger.LogError("OAuth configuration missing for provider {Provider}", provider);
                    var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                    await errorResponse.WriteAsJsonAsync(new { error = "OAuth configuration error" });
                    return errorResponse;
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

                var successResponse = req.CreateResponse(HttpStatusCode.OK);
                await successResponse.WriteAsJsonAsync(new AuthResponseDto
                {
                    Token = jwtToken,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Role = user.Role
                    }
                });

                return successResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "OAuth callback failed for provider {Provider}", provider);
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(new { error = "Authentication failed" });
                return errorResponse;
            }
        }

        /// <summary>
        /// Generate OAuth authorization URL with PKCE parameters.
        /// </summary>
        [Function("GetAuthorizationUrl")]
        public async Task<HttpResponseData> GetAuthorizationUrl(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "v1/oauth/authorize/{provider}")] HttpRequestData req,
            string provider)
        {
            try
            {
                // Validate provider
                var validProviders = new[] { "google", "microsoft", "facebook" };
                if (!validProviders.Contains(provider.ToLower()))
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteAsJsonAsync(new { error = "Invalid OAuth provider" });
                    return badRequestResponse;
                }

                var clientId = GetClientId(provider, req);
                var redirectUri = GetRedirectUri(provider, req);

                if (string.IsNullOrEmpty(clientId))
                {
                    _logger.LogError("OAuth client ID missing for provider {Provider}", provider);
                    var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                    await errorResponse.WriteAsJsonAsync(new { error = "OAuth configuration error" });
                    return errorResponse;
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

                var successResponse = req.CreateResponse(HttpStatusCode.OK);
                await successResponse.WriteAsJsonAsync(new OAuthAuthorizationDto
                {
                    AuthorizationUrl = authUrl,
                    CodeVerifier = codeVerifier,
                    State = state
                });

                return successResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate authorization URL for provider {Provider}", provider);
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(new { error = "Authorization URL generation failed" });
                return errorResponse;
            }
        }

        private string GetClientId(string provider, HttpRequestData req)
        {
            var configuration = req.FunctionContext.InstanceServices.GetRequiredService<IConfiguration>();
            return provider.ToLower() switch
            {
                "google" => configuration[$"OAuth:Google:ClientId"] ?? string.Empty,
                "microsoft" => configuration[$"OAuth:Microsoft:ClientId"] ?? string.Empty,
                "facebook" => configuration[$"OAuth:Facebook:ClientId"] ?? string.Empty,
                _ => string.Empty
            };
        }

        private string GetClientSecret(string provider, HttpRequestData req)
        {
            var configuration = req.FunctionContext.InstanceServices.GetRequiredService<IConfiguration>();
            return provider.ToLower() switch
            {
                "google" => configuration[$"OAuth:Google:ClientSecret"] ?? string.Empty,
                "microsoft" => configuration[$"OAuth:Microsoft:ClientSecret"] ?? string.Empty,
                "facebook" => configuration[$"OAuth:Facebook:ClientSecret"] ?? string.Empty,
                _ => string.Empty
            };
        }

        private string GetRedirectUri(string provider, HttpRequestData req)
        {
            var configuration = req.FunctionContext.InstanceServices.GetRequiredService<IConfiguration>();
            return provider.ToLower() switch
            {
                "google" => configuration[$"OAuth:Google:RedirectUri"] ?? $"{req.Url.Scheme}://{req.Url.Host}/api/v1/oauth/callback/google",
                "microsoft" => configuration[$"OAuth:Microsoft:RedirectUri"] ?? $"{req.Url.Scheme}://{req.Url.Host}/api/v1/oauth/callback/microsoft",
                "facebook" => configuration[$"OAuth:Facebook:RedirectUri"] ?? $"{req.Url.Scheme}://{req.Url.Host}/api/v1/oauth/callback/facebook",
                _ => string.Empty
            };
        }
    }
}
