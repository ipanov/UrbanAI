using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using UrbanAI.Application.Interfaces;
using UrbanAI.Application.DTOs;
using UrbanAI.Domain.Entities;

namespace UrbanAI.API.Controllers
{
    /// <summary>
    /// Controller for managing issues.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class IssuesController : ControllerBase
    {
        private readonly IIssueService _issueService;

        /// <summary>
        /// Initializes a new instance of the <see cref="IssuesController"/> class.
        /// </summary>
        /// <param name="issueService">The issue service.</param>
        public IssuesController(IIssueService issueService)
        {
            _issueService = issueService;
        }

        /// <summary>
        /// Gets all issues.
        /// </summary>
        /// <returns>A list of all issues.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IssueDto>>> GetAllIssues()
        {
            var issues = await _issueService.GetAllIssuesAsync();
            return Ok(issues);
        }

        /// <summary>
        /// Gets an issue by its ID.
        /// </summary>
        /// <param name="id">The ID of the issue.</param>
        /// <returns>The issue with the specified ID, or NotFound if not found.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<IssueDto>> GetIssueById(Guid id)
        {
            var issue = await _issueService.GetIssueByIdAsync(id);
            if (issue == null)
            {
                return NotFound();
            }
            return Ok(issue);
        }

        /// <summary>
        /// Creates a new issue.
        /// </summary>
        /// <param name="request">The request containing issue details.</param>
        /// <returns>The created issue response.</returns>
        [HttpPost]
        public async Task<ActionResult<CreateIssueResponseDto>> CreateIssue([FromBody] CreateIssueRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Title))
            {
                return BadRequest("Title is required.");
            }
            var response = await _issueService.CreateIssueAsync(request);
            return CreatedAtAction(nameof(GetIssueById), new { id = response.Id }, response);
        }

        /// <summary>
        /// Updates an existing issue.
        /// </summary>
        /// <param name="id">The ID of the issue to update.</param>
        /// <param name="request">The request containing updated issue details.</param>
        /// <returns>No content if successful, or NotFound if the issue does not exist.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIssue(Guid id, [FromBody] UpdateIssueRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Title))
            {
                return BadRequest("Title is required.");
            }
            if (string.IsNullOrEmpty(request.Description))
            {
                return BadRequest("Description is required.");
            }
            if (string.IsNullOrEmpty(request.PhotoUrl))
            {
                return BadRequest("PhotoUrl is required.");
            }
            if (string.IsNullOrEmpty(request.Status))
            {
                return BadRequest("Status is required.");
            }

            request.Id = id;
            var updatedIssue = await _issueService.UpdateIssueAsync(request);
            if (updatedIssue == null)
            {
                return NotFound();
            }
            return NoContent();
        }

        /// <summary>
        /// Deletes an issue by its ID.
        /// </summary>
        /// <param name="id">The ID of the issue to delete.</param>
        /// <returns>No content if successful, or NotFound if the issue does not exist.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIssue(Guid id)
        {
            try
            {
                await _issueService.DeleteIssueAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }
        }

        /// <summary>
        /// Gets regulations by location.
        /// </summary>
        /// <param name="location">The location to search for regulations.</param>
        /// <returns>A list of regulations for the specified location, or NotFound if none are found.</returns>
        [HttpGet("regulations/{location}")]
        public async Task<ActionResult<IEnumerable<Regulation>>> GetRegulationsByLocation(string location)
        {
            var regulations = await _issueService.GetRegulationsByLocationAsync(location);
            if (regulations == null || !regulations.Any())
            {
                return NotFound($"No regulations found for location: {location}");
            }
            return Ok(regulations);
        }
    }
}
