using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;
using UrbanAI.Application.Interfaces;
using UrbanAI.Application.DTOs;
using System.Collections.Generic;
using UrbanAI.Domain.Entities;

namespace UrbanAI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class IssuesController : ControllerBase
    {
        private readonly IIssueService _issueService;

        public IssuesController(IIssueService issueService)
        {
            _issueService = issueService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IssueDto>>> GetAllIssues()
        {
            var issues = await _issueService.GetAllIssuesAsync();
            return Ok(issues);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IssueDto>> GetIssueById(Guid id)
        {
            var issue = await _issueService.GetIssueByIdAsync(id);
            if (issue == null)
            {
                return NotFound();
            }
            return Ok(issue);
        }        [HttpPost]
        public async Task<ActionResult<CreateIssueResponseDto>> CreateIssue([FromBody] CreateIssueRequestDto request)
        {
            var response = await _issueService.CreateIssueAsync(request);
            return CreatedAtAction(nameof(GetIssueById), new { id = response.Id }, response);
        }        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIssue(Guid id, [FromBody] UpdateIssueRequestDto request)
        {
            request.Id = id;
            var updatedIssue = await _issueService.UpdateIssueAsync(request);
            if (updatedIssue == null)
            {
                return NotFound();
            }
            return NoContent();
        }[HttpDelete("{id}")]
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

        [HttpGet("regulations/{location}")]
        public async Task<ActionResult<IEnumerable<Regulation>>> GetRegulationsByLocation(string location)
        {
            var regulations = await _issueService.GetRegulationsByLocationAsync(location);
            if (regulations == null || !((List<Regulation>)regulations).Any())
            {
                return NotFound($"No regulations found for location: {location}");
            }
            return Ok(regulations);
        }
    }
}
