using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using UrbanAI.Application.Interfaces;
using UrbanAI.Application.DTOs;
using System.Security.Claims;

namespace UrbanAI.Functions.Functions
{
    public class IssuesFunction
    {
        private readonly ILogger _logger;
        private readonly IIssueService _issueService;

        public IssuesFunction(ILoggerFactory loggerFactory, IIssueService issueService)
        {
            _logger = loggerFactory.CreateLogger<IssuesFunction>();
            _issueService = issueService;
        }

        [Function("GetIssues")]
        public async Task<HttpResponseData> GetIssues(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "issues")] HttpRequestData req)
        {
            _logger.LogInformation("Getting all issues");

            try
            {
                var issues = await _issueService.GetAllIssuesAsync();
                
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteStringAsync(JsonSerializer.Serialize(issues));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting issues");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }

        [Function("GetIssue")]
        public async Task<HttpResponseData> GetIssue(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "issues/{id:int}")] HttpRequestData req,
            int id)
        {
            _logger.LogInformation($"Getting issue with ID: {id}");

            try
            {
                var issue = await _issueService.GetIssueByIdAsync(id);
                
                if (issue == null)
                {
                    var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                    await notFound.WriteStringAsync($"Issue with ID {id} not found");
                    return notFound;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteStringAsync(JsonSerializer.Serialize(issue));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting issue with ID: {id}");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }

        [Function("CreateIssue")]
        public async Task<HttpResponseData> CreateIssue(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "issues")] HttpRequestData req)
        {
            _logger.LogInformation("Creating new issue");

            try
            {
                var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var dto = JsonSerializer.Deserialize<CreateIssueRequestDto>(requestBody, new JsonSerializerOptions 
                { 
                    PropertyNameCaseInsensitive = true 
                });

                if (dto == null)
                {
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequest.WriteStringAsync("Invalid request body");
                    return badRequest;
                }

                // For now, we'll use a default user ID since we don't have authentication middleware in Functions
                // In a real implementation, you'd extract this from the JWT token in the Authorization header
                var userId = 1; // This should come from the authenticated user

                var result = await _issueService.CreateIssueAsync(dto, userId);

                var response = req.CreateResponse(HttpStatusCode.Created);
                await response.WriteStringAsync(JsonSerializer.Serialize(result));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating issue");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }

        [Function("UpdateIssue")]
        public async Task<HttpResponseData> UpdateIssue(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "issues/{id:int}")] HttpRequestData req,
            int id)
        {
            _logger.LogInformation($"Updating issue with ID: {id}");

            try
            {
                var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var dto = JsonSerializer.Deserialize<UpdateIssueRequestDto>(requestBody, new JsonSerializerOptions 
                { 
                    PropertyNameCaseInsensitive = true 
                });

                if (dto == null)
                {
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequest.WriteStringAsync("Invalid request body");
                    return badRequest;
                }

                var result = await _issueService.UpdateIssueAsync(id, dto);

                if (result == null)
                {
                    var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                    await notFound.WriteStringAsync($"Issue with ID {id} not found");
                    return notFound;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteStringAsync(JsonSerializer.Serialize(result));
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating issue with ID: {id}");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }
    }
}