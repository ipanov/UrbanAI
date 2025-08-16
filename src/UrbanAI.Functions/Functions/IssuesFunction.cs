using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using UrbanAI.Application.Interfaces;
using UrbanAI.Application.DTOs;
using UrbanAI.Domain.Entities;
using System.Net;

namespace UrbanAI.Functions.Functions
{
    /// <summary>
    /// Azure Function for managing issues.
    /// Migrated from IssuesController to provide the same functionality as HTTP triggers.
    /// </summary>
    public class IssuesFunction
    {
        private readonly IIssueService _issueService;
        private readonly ILogger<IssuesFunction> _logger;

        public IssuesFunction(IIssueService issueService, ILogger<IssuesFunction> logger)
        {
            _issueService = issueService;
            _logger = logger;
        }

        /// <summary>
        /// Gets all issues.
        /// </summary>
        [Function("GetAllIssues")]
        public async Task<HttpResponseData> GetAllIssues(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "issues")] HttpRequestData req)
        {
            try
            {
                _logger.LogInformation("Getting all issues");
                var issues = await _issueService.GetAllIssuesAsync();
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(issues);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all issues");
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteStringAsync("Internal server error");
                return response;
            }
        }

        /// <summary>
        /// Gets an issue by its ID.
        /// </summary>
        [Function("GetIssueById")]
        public async Task<HttpResponseData> GetIssueById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "issues/{id}")] HttpRequestData req,
            Guid id)
        {
            try
            {
                _logger.LogInformation("Getting issue by ID: {Id}", id);
                var issue = await _issueService.GetIssueByIdAsync(id);
                if (issue == null)
                {
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    return notFoundResponse;
                }

                var okResponse = req.CreateResponse(HttpStatusCode.OK);
                await okResponse.WriteAsJsonAsync(issue);
                return okResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting issue by ID: {Id}", id);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteStringAsync("Internal server error");
                return response;
            }
        }

        /// <summary>
        /// Creates a new issue.
        /// </summary>
        [Function("CreateIssue")]
        public async Task<HttpResponseData> CreateIssue(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "issues")] HttpRequestData req)
        {
            try
            {
                _logger.LogInformation("Creating new issue");
                var request = await req.ReadFromJsonAsync<CreateIssueRequestDto>();
                if (request == null)
                {
                    var response = req.CreateResponse(HttpStatusCode.BadRequest);
                    await response.WriteStringAsync("Invalid request body");
                    return response;
                }

                if (string.IsNullOrEmpty(request.Title))
                {
                    var titleErrorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await titleErrorResponse.WriteStringAsync("Title is required.");
                    return titleErrorResponse;
                }

                var responseDto = await _issueService.CreateIssueAsync(request);
                
                var createdResponse = req.CreateResponse(HttpStatusCode.Created);
                await createdResponse.WriteAsJsonAsync(responseDto);
                return createdResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating issue");
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteStringAsync("Internal server error");
                return response;
            }
        }

        /// <summary>
        /// Updates an existing issue.
        /// </summary>
        [Function("UpdateIssue")]
        public async Task<HttpResponseData> UpdateIssue(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "issues/{id}")] HttpRequestData req,
            Guid id)
        {
            try
            {
                _logger.LogInformation("Updating issue with ID: {Id}", id);
                var request = await req.ReadFromJsonAsync<UpdateIssueRequestDto>();
                if (request == null)
                {
                    var response = req.CreateResponse(HttpStatusCode.BadRequest);
                    await response.WriteStringAsync("Invalid request body");
                    return response;
                }

                if (string.IsNullOrEmpty(request.Title))
                {
                    var titleErrorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await titleErrorResponse.WriteStringAsync("Title is required.");
                    return titleErrorResponse;
                }
                if (string.IsNullOrEmpty(request.Description))
                {
                    var descriptionErrorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await descriptionErrorResponse.WriteStringAsync("Description is required.");
                    return descriptionErrorResponse;
                }
                if (string.IsNullOrEmpty(request.PhotoUrl))
                {
                    var photoUrlErrorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await photoUrlErrorResponse.WriteStringAsync("PhotoUrl is required.");
                    return photoUrlErrorResponse;
                }
                if (string.IsNullOrEmpty(request.Status))
                {
                    var statusErrorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await statusErrorResponse.WriteStringAsync("Status is required.");
                    return statusErrorResponse;
                }

                request.Id = id;
                var updatedIssue = await _issueService.UpdateIssueAsync(request);
                if (updatedIssue == null)
                {
                    var response = req.CreateResponse(HttpStatusCode.NotFound);
                    return response;
                }

                var noContentResponse = req.CreateResponse(HttpStatusCode.NoContent);
                return noContentResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating issue with ID: {Id}", id);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteStringAsync("Internal server error");
                return response;
            }
        }

        /// <summary>
        /// Deletes an issue by its ID.
        /// </summary>
        [Function("DeleteIssue")]
        public async Task<HttpResponseData> DeleteIssue(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "issues/{id}")] HttpRequestData req,
            Guid id)
        {
            try
            {
                _logger.LogInformation("Deleting issue with ID: {Id}", id);
                await _issueService.DeleteIssueAsync(id);
                var noContentResponse = req.CreateResponse(HttpStatusCode.NoContent);
                return noContentResponse;
            }
            catch (InvalidOperationException)
            {
                _logger.LogWarning("Issue with ID {Id} not found", id);
                var response = req.CreateResponse(HttpStatusCode.NotFound);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting issue with ID: {Id}", id);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteStringAsync("Internal server error");
                return response;
            }
        }

        /// <summary>
        /// Gets regulations by location.
        /// </summary>
        [Function("GetRegulationsByLocation")]
        public async Task<HttpResponseData> GetRegulationsByLocation(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "issues/regulations/{location}")] HttpRequestData req,
            string location)
        {
            try
            {
                _logger.LogInformation("Getting regulations by location: {Location}", location);
                var regulations = await _issueService.GetRegulationsByLocationAsync(location);
                if (regulations == null || !regulations.Any())
                {
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    await notFoundResponse.WriteStringAsync($"No regulations found for location: {location}");
                    return notFoundResponse;
                }

                var okResponse = req.CreateResponse(HttpStatusCode.OK);
                await okResponse.WriteAsJsonAsync(regulations);
                return okResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting regulations by location: {Location}", location);
                var response = req.CreateResponse(HttpStatusCode.InternalServerError);
                await response.WriteStringAsync("Internal server error");
                return response;
            }
        }
    }
}
