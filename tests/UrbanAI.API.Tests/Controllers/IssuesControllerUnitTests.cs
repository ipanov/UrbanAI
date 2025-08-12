using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using UrbanAI.API.Controllers;
using UrbanAI.Application.Interfaces;
using UrbanAI.Application.DTOs;
using System;
using System.Threading.Tasks;

namespace UrbanAI.API.Tests.Controllers
{
    public class IssuesControllerUnitTests
    {
        private readonly Mock<IIssueService> _mockIssueService;
        private readonly IssuesController _controller;

        public IssuesControllerUnitTests()
        {
            _mockIssueService = new Mock<IIssueService>();
            _controller = new IssuesController(_mockIssueService.Object);
        }

        [Fact]
        public async Task GetAllIssues_ShouldReturnOkResult_WithListOfIssues()
        {
            // Arrange
            var issues = new List<IssueDto>
            {
                new IssueDto { Id = Guid.NewGuid(), Title = "Issue 1", Description = "Description 1", Status = "Open", PhotoUrl = "url1", Latitude = 1.0, Longitude = 1.0, CreatedAt = DateTime.UtcNow },
                new IssueDto { Id = Guid.NewGuid(), Title = "Issue 2", Description = "Description 2", Status = "Closed", PhotoUrl = "url2", Latitude = 2.0, Longitude = 2.0, CreatedAt = DateTime.UtcNow }
            };

            _mockIssueService.Setup(s => s.GetAllIssuesAsync())
                            .ReturnsAsync(issues);

            // Act
            var result = await _controller.GetAllIssues();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedIssues = Assert.IsAssignableFrom<IEnumerable<IssueDto>>(okResult.Value);
            Assert.Equal(2, returnedIssues.Count());
            _mockIssueService.Verify(s => s.GetAllIssuesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetIssueById_ShouldReturnOkResult_WhenIssueExists()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var issue = new IssueDto
            {
                Id = issueId,
                Title = "Test Issue",
                Description = "Test Description",
                Status = "Open",
                PhotoUrl = "test.jpg",
                Latitude = 1.0,
                Longitude = 1.0,
                CreatedAt = DateTime.UtcNow
            };

            _mockIssueService.Setup(s => s.GetIssueByIdAsync(issueId))
                            .ReturnsAsync(issue);

            // Act
            var result = await _controller.GetIssueById(issueId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedIssue = Assert.IsType<IssueDto>(okResult.Value);
            Assert.Equal(issueId, returnedIssue.Id);
            Assert.Equal("Test Issue", returnedIssue.Title);
            _mockIssueService.Verify(s => s.GetIssueByIdAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task GetIssueById_ShouldReturnNotFound_WhenIssueDoesNotExist()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            _mockIssueService.Setup(s => s.GetIssueByIdAsync(issueId))
                            .ReturnsAsync((IssueDto?)null);

            // Act
            var result = await _controller.GetIssueById(issueId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            _mockIssueService.Verify(s => s.GetIssueByIdAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task CreateIssue_ShouldReturnCreatedResult_WithValidRequest()
        {
            // Arrange
            var request = new CreateIssueRequestDto
            {
                Title = "New Issue",
                Description = "New Description",
                PhotoUrl = "new.jpg",
                Latitude = 10.0,
                Longitude = 20.0,
                Location = "Test Location"
            };

            var response = new CreateIssueResponseDto
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                PhotoUrl = request.PhotoUrl,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                CreatedAt = DateTime.UtcNow,
                Message = "Issue created successfully."
            };

            _mockIssueService.Setup(s => s.CreateIssueAsync(request))
                            .ReturnsAsync(response);

            // Act
            var result = await _controller.CreateIssue(request);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedResponse = Assert.IsType<CreateIssueResponseDto>(createdResult.Value);
            Assert.Equal(response.Id, returnedResponse.Id);
            Assert.Equal(request.Title, returnedResponse.Title);
            Assert.Equal("GetIssueById", createdResult.ActionName);
            Assert.Equal(response.Id, createdResult.RouteValues!["id"]);
            _mockIssueService.Verify(s => s.CreateIssueAsync(request), Times.Once);
        }

        [Fact]
        public async Task UpdateIssue_ShouldReturnNoContent_WhenUpdateSuccessful()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var request = new UpdateIssueRequestDto
            {
                Id = issueId,
                Title = "Updated Issue",
                Description = "Updated Description",
                PhotoUrl = "updated.jpg",
                Latitude = 15.0,
                Longitude = 25.0,
                Status = "In Progress",
                Location = "Test Location"
            };

            var updatedIssue = new IssueDto
            {
                Id = issueId,
                Title = request.Title,
                Description = request.Description,
                PhotoUrl = request.PhotoUrl,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                Status = request.Status,
                CreatedAt = DateTime.UtcNow
            };

            _mockIssueService.Setup(s => s.UpdateIssueAsync(request))
                            .ReturnsAsync(updatedIssue);

            // Act
            var result = await _controller.UpdateIssue(issueId, request);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockIssueService.Verify(s => s.UpdateIssueAsync(It.Is<UpdateIssueRequestDto>(r => r.Id == issueId)), Times.Once);
        }

        [Fact]
        public async Task UpdateIssue_ShouldReturnNotFound_WhenIssueDoesNotExist()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var request = new UpdateIssueRequestDto
            {
                Id = issueId,
                Title = "Updated Issue",
                Description = "Updated Description",
                PhotoUrl = "updated.jpg",
                Latitude = 15.0,
                Longitude = 25.0,
                Status = "In Progress",
                Location = "Test Location"
            };

            _mockIssueService.Setup(s => s.UpdateIssueAsync(request))
                            .ReturnsAsync((IssueDto?)null);

            // Act
            var result = await _controller.UpdateIssue(issueId, request);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            _mockIssueService.Verify(s => s.UpdateIssueAsync(request), Times.Once);
        }

        [Fact]
        public async Task DeleteIssue_ShouldReturnNoContent_WhenDeletionSuccessful()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            _mockIssueService.Setup(s => s.DeleteIssueAsync(issueId))
                            .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteIssue(issueId);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockIssueService.Verify(s => s.DeleteIssueAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task DeleteIssue_ShouldReturnNotFound_WhenIssueDoesNotExist()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            _mockIssueService.Setup(s => s.DeleteIssueAsync(issueId))
                            .ThrowsAsync(new InvalidOperationException("Issue not found"));

            // Act
            var result = await _controller.DeleteIssue(issueId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            _mockIssueService.Verify(s => s.DeleteIssueAsync(issueId), Times.Once);
        }
    }
}
