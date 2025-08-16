using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using UrbanAI.Application.DTOs;
using UrbanAI.Application.Interfaces;
using UrbanAI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace UrbanAI.Functions.Functions
{
    /// <summary>
    /// Azure Function for OAuth-only authentication and user management.
    /// Migrated from AuthController to provide the same functionality as HTTP triggers.
    /// Implements: external token exchange (Google/Microsoft/Facebook) and a registration 
    /// endpoint for external providers that requires explicit legal acceptance on the frontend 
    /// before creating an anonymous, PII-free user record.
    /// </summary>
    public class AuthFunction
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;
        private readonly IUserService _userService;
        private readonly ILogger<AuthFunction> _logger;

        public AuthFunction(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ApplicationDbContext dbContext,
            IUserService userService,
            ILogger<AuthFunction> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _dbContext = dbContext;
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Exchange external provider token for internal JWT.
        /// </summary>
        [Function("ExchangeToken")]
        public async Task<HttpResponseData> ExchangeToken(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/exchange-token")] HttpRequestData req)
        {
            try
            {
                var request = await req.ReadFromJsonAsync<AuthRequestDto>();
                if (request == null || string.IsNullOrEmpty(request.Provider) || string.IsNullOrEmpty(request.Token))
                {
                    var response = req.CreateResponse(HttpStatusCode.BadRequest);
                    await response.WriteStringAsync("Provider and token are required.");
                    return response;
                }

                // Developer convenience: support tokens like "mock:alice123" for local testing
                if (request.Token.StartsWith("mock:"))
                {
                    var externalId = request.Token.Substring("mock:".Length);
                    return await HandleExternalLogin(req, request.Provider.ToLowerInvariant(), externalId);
                }

                switch (request.Provider.ToLowerInvariant())
                {
                    case "google":
                        return await HandleGoogleToken(req, request.Token);
                    case "microsoft":
                        return await HandleMicrosoftToken(req, request.Token);
                    case "facebook":
                        return await HandleFacebookToken(req, request.Token);
                    default:
                        var response = req.CreateResponse(HttpStatusCode.BadRequest);
                        await response.WriteStringAsync("Unsupported provider.");
                        return response;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exchanging token");
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteStringAsync("Internal server error");
                return response;
            }
        }

        private async Task<HttpResponseData> HandleGoogleToken(HttpRequestData req, string token)
        {
            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}");

            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                await errorResponse.WriteStringAsync("Invalid Google token.");
                return errorResponse;
            }

            var content = await response.Content.ReadAsStringAsync();
            var payload = JsonSerializer.Deserialize<JsonDocument>(content);
            var sub = payload?.RootElement.GetProperty("sub").GetString();

            if (string.IsNullOrEmpty(sub))
            {
                var errorResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                await errorResponse.WriteStringAsync("Invalid token payload.");
                return errorResponse;
            }

            return await HandleExternalLogin(req, "google", sub);
        }

        private async Task<HttpResponseData> HandleMicrosoftToken(HttpRequestData req, string token)
        {
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            var response = await httpClient.GetAsync("https://graph.microsoft.com/v1.0/me");

            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                await errorResponse.WriteStringAsync("Invalid Microsoft token.");
                return errorResponse;
            }

            var content = await response.Content.ReadAsStringAsync();
            var payload = JsonSerializer.Deserialize<JsonDocument>(content);
            var id = payload?.RootElement.GetProperty("id").GetString();

            if (string.IsNullOrEmpty(id))
            {
                var errorResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                await errorResponse.WriteStringAsync("Invalid token payload.");
                return errorResponse;
            }

            return await HandleExternalLogin(req, "microsoft", id);
        }

        private async Task<HttpResponseData> HandleFacebookToken(HttpRequestData req, string token)
        {
            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync($"https://graph.facebook.com/me?access_token={token}");

            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                await errorResponse.WriteStringAsync("Invalid Facebook token.");
                return errorResponse;
            }

            var content = await response.Content.ReadAsStringAsync();
            var payload = JsonSerializer.Deserialize<JsonDocument>(content);
            var id = payload?.RootElement.GetProperty("id").GetString();

            if (string.IsNullOrEmpty(id))
            {
                var errorResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                await errorResponse.WriteStringAsync("Invalid token payload.");
                return errorResponse;
            }

            return await HandleExternalLogin(req, "facebook", id);
        }

        /// <summary>
        /// Lookup an existing user by provider+externalId and return our internal JWT.
        /// If no user exists, return 404 with requiresRegistration = true so the frontend can
        /// present the legal agreement and then call register-external.
        /// </summary>
        private async Task<HttpResponseData> HandleExternalLogin(HttpRequestData req, string provider, string externalId)
        {
            var user = await _dbContext.Users
                .Include(u => u.ExternalLogins)
                .SingleOrDefaultAsync(u =>
                    u.ExternalLogins.Any(l => l.Provider == provider && l.ExternalId == externalId));

            if (user == null)
            {
                // Inform frontend that registration (with explicit legal acceptance) is required
                var response = req.CreateResponse(HttpStatusCode.NotFound);
                var errorResult = new { requiresRegistration = true, provider, externalId };
                await response.WriteAsJsonAsync(errorResult);
                return response;
            }

            var token = await _userService.GenerateJwtTokenAsync(new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            });

            var successResponse = req.CreateResponse(HttpStatusCode.OK);
            await successResponse.WriteAsJsonAsync(new AuthResponseDto { Token = token });
            return successResponse;
        }

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
        [Function("RegisterExternal")]
        public async Task<HttpResponseData> RegisterExternal(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/register-external")] HttpRequestData req)
        {
            try
            {
                var dto = await req.ReadFromJsonAsync<ExternalRegisterDto>();
                if (dto == null || string.IsNullOrEmpty(dto.Provider) || string.IsNullOrEmpty(dto.ExternalId))
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteStringAsync("Provider and ExternalId are required.");
                    return badRequestResponse;
                }

                var provider = dto.Provider.ToLowerInvariant();
                var externalId = dto.ExternalId;

                // Check existing user
                var existing = await _dbContext.Users
                    .Include(u => u.ExternalLogins)
                    .SingleOrDefaultAsync(u => u.ExternalLogins.Any(l => l.Provider == provider && l.ExternalId == externalId));

                if (existing != null)
                {
                    var existingToken = await _userService.GenerateJwtTokenAsync(new UserDto
                    {
                        Id = existing.Id,
                        Username = existing.Username,
                        Role = existing.Role
                    });

                var existingOkResponse = req.CreateResponse(HttpStatusCode.OK);
                await existingOkResponse.WriteAsJsonAsync(new AuthResponseDto { Token = existingToken });
                return existingOkResponse;
                }

                // Create anonymous user linked only to provider+externalId (no PII)
                var user = new UrbanAI.Domain.Entities.User
                {
                    Username = $"{provider}_{externalId}",
                    Role = "User",
                    ExternalLogins = new List<UrbanAI.Domain.Entities.ExternalLogin>
                    {
                        new UrbanAI.Domain.Entities.ExternalLogin
                        {
                            Provider = provider,
                            ExternalId = externalId
                        }
                    }
                };

                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();

                var token = await _userService.GenerateJwtTokenAsync(new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Role = user.Role
                });

                var okResponse = req.CreateResponse(HttpStatusCode.OK);
                await okResponse.WriteAsJsonAsync(new AuthResponseDto { Token = token });
                return okResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering external user");
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteStringAsync("Internal server error");
                return response;
            }
        }
    }
}
