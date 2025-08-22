using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using UrbanAI.Application.Interfaces;
using UrbanAI.Application.DTOs;

namespace UrbanAI.Functions.Functions
{
    public class OAuthCallbackFunction
    {
        private readonly ILogger _logger;
        private readonly IOAuthService _oauthService;

        public OAuthCallbackFunction(ILoggerFactory loggerFactory, IOAuthService oauthService)
        {
            _logger = loggerFactory.CreateLogger<OAuthCallbackFunction>();
            _oauthService = oauthService;
        }

        [Function("OAuthAuthorize")]
        public async Task<HttpResponseData> Authorize(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "v1/oauth/authorize/{provider}")] HttpRequestData req,
            string provider)
        {
            _logger.LogInformation($"OAuth authorization request for provider: {provider}");

            try
            {
                var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var dto = JsonSerializer.Deserialize<OAuthAuthorizationDto>(requestBody, new JsonSerializerOptions 
                { 
                    PropertyNameCaseInsensitive = true 
                });

                if (dto == null || string.IsNullOrEmpty(dto.RedirectUri))
                {
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequest.WriteStringAsync("RedirectUri is required");
                    return badRequest;
                }

                var authorizationUrl = await _oauthService.GetAuthorizationUrlAsync(provider, dto.RedirectUri);

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteStringAsync(JsonSerializer.Serialize(new { authorizationUrl }));
                return response;
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, $"Invalid OAuth provider: {provider}");
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync($"Unsupported OAuth provider: {provider}");
                return badRequest;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error processing OAuth authorization for provider: {provider}");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }

        [Function("OAuthCallback")]
        public async Task<HttpResponseData> Callback(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/oauth/callback/{provider}")] HttpRequestData req,
            string provider)
        {
            _logger.LogInformation($"OAuth callback for provider: {provider}");

            try
            {
                var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
                var code = query["code"];
                var state = query["state"];
                var error = query["error"];

                if (!string.IsNullOrEmpty(error))
                {
                    _logger.LogWarning($"OAuth error for provider {provider}: {error}");
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequest.WriteStringAsync($"OAuth error: {error}");
                    return badRequest;
                }

                if (string.IsNullOrEmpty(code))
                {
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequest.WriteStringAsync("Authorization code is required");
                    return badRequest;
                }

                var result = await _oauthService.HandleCallbackAsync(provider, code, state);

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteStringAsync(JsonSerializer.Serialize(result));
                return response;
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, $"Invalid OAuth provider: {provider}");
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync($"Unsupported OAuth provider: {provider}");
                return badRequest;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error processing OAuth callback for provider: {provider}");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }
    }
}