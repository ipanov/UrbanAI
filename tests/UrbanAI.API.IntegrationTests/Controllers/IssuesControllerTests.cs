using System;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using UrbanAI.Application.DTOs;
using Xunit;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Collections.Generic;

namespace UrbanAI.API.IntegrationTests.Controllers;

[Collection("Integration Tests")]
public class IssuesControllerTests : TestBase
{
    public IssuesControllerTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task CreateIssue_ValidData_ReturnsCreated()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var request = new CreateIssueRequestDto
        {
            Title = "Test Issue",
            Description = "This is a test issue.",
            PhotoUrl = "http://example.com/photo.jpg",
            Latitude = 10.0,
            Longitude = 20.0,
            Status = "Open",
            Priority = "High"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/Issues", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var issueResponse = await response.Content.ReadFromJsonAsync<CreateIssueResponseDto>();
        issueResponse.Should().NotBeNull();
        issueResponse.Id.Should().NotBeEmpty();
        issueResponse.Title.Should().Be(request.Title);
    }

    [Fact]
    public async Task CreateIssue_InvalidData_ReturnsBadRequest()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var request = new CreateIssueRequestDto
        {
            Title = "", // Invalid data
            Description = "This is a test issue.",
            PhotoUrl = "http://example.com/photo.jpg",
            Latitude = 10.0,
            Longitude = 20.0,
            Status = "Open",
            Priority = "High"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/Issues", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetAllIssues_ReturnsSuccess()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/Issues");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var issues = await response.Content.ReadFromJsonAsync<IEnumerable<IssueDto>>();
        issues.Should().NotBeNull();
    }

    [Fact]
    public async Task GetIssueById_ExistingIssue_ReturnsSuccess()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createRequest = new CreateIssueRequestDto
        {
            Title = "Issue to Retrieve",
            Description = "Description for retrieval.",
            PhotoUrl = "http://example.com/retrieve.jpg",
            Latitude = 30.0,
            Longitude = 40.0,
            Status = "Open",
            Priority = "Medium"
        };
        var createResponse = await _client.PostAsJsonAsync("/api/Issues", createRequest);
        var createdIssue = await createResponse.Content.ReadFromJsonAsync<CreateIssueResponseDto>();

        // Act
        var response = await _client.GetAsync($"/api/Issues/{createdIssue.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var issue = await response.Content.ReadFromJsonAsync<IssueDto>();
        issue.Should().NotBeNull();
        issue.Id.Should().Be(createdIssue.Id);
    }

    [Fact]
    public async Task GetIssueById_NonExistentIssue_ReturnsNotFound()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/Issues/{nonExistentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateIssue_ValidData_ReturnsNoContent()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createRequest = new CreateIssueRequestDto
        {
            Title = "Issue to Update",
            Description = "Original description.",
            PhotoUrl = "http://example.com/update.jpg",
            Latitude = 50.0,
            Longitude = 60.0,
            Status = "Open",
            Priority = "Low"
        };
        var createResponse = await _client.PostAsJsonAsync("/api/Issues", createRequest);
        var createdIssue = await createResponse.Content.ReadFromJsonAsync<CreateIssueResponseDto>();

        var updateRequest = new UpdateIssueRequestDto
        {
            Id = createdIssue.Id,
            Title = "Updated Issue Title",
            Description = "Updated description.",
            PhotoUrl = "http://example.com/updated_photo.jpg",
            Latitude = 55.0,
            Longitude = 65.0,
            Status = "Closed",
            Priority = "High"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/Issues/{createdIssue.Id}", updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task UpdateIssue_NonExistentIssue_ReturnsNotFound()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var nonExistentId = Guid.NewGuid();

        var updateRequest = new UpdateIssueRequestDto
        {
            Id = nonExistentId,
            Title = "Non Existent",
            Description = "Description.",
            PhotoUrl = "http://example.com/photo.jpg",
            Latitude = 1.0,
            Longitude = 1.0,
            Status = "Open",
            Priority = "Low"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/Issues/{nonExistentId}", updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteIssue_ExistingIssue_ReturnsNoContent()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createRequest = new CreateIssueRequestDto
        {
            Title = "Issue to Delete",
            Description = "Description for deletion.",
            PhotoUrl = "http://example.com/delete.jpg",
            Latitude = 70.0,
            Longitude = 80.0,
            Status = "Open",
            Priority = "High"
        };
        var createResponse = await _client.PostAsJsonAsync("/api/Issues", createRequest);
        var createdIssue = await createResponse.Content.ReadFromJsonAsync<CreateIssueResponseDto>();

        // Act
        var response = await _client.DeleteAsync($"/api/Issues/{createdIssue.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task DeleteIssue_NonExistentIssue_ReturnsNotFound()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await _client.DeleteAsync($"/api/Issues/{nonExistentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetRegulationsByLocation_ExistingLocation_ReturnsRegulations()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var location = "TestLocation";

        // Act
        var response = await _client.GetAsync($"/api/Issues/regulations/{location}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var regulations = await response.Content.ReadFromJsonAsync<IEnumerable<object>>(); // Assuming object for now
        regulations.Should().NotBeNull();
        regulations.Should().NotBeEmpty();
    }

    [Fact]
    public async Task GetRegulationsByLocation_NonExistentLocation_ReturnsNotFound()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var location = "NonExistentLocation";

        // Act
        var response = await _client.GetAsync($"/api/Issues/regulations/{location}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateIssue_InvalidData_ReturnsBadRequest()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createRequest = new CreateIssueRequestDto
        {
            Title = "Issue to Update Invalid",
            Description = "Original description.",
            PhotoUrl = "http://example.com/update_invalid.jpg",
            Latitude = 50.0,
            Longitude = 60.0,
            Status = "Open",
            Priority = "Low"
        };
        var createResponse = await _client.PostAsJsonAsync("/api/Issues", createRequest);
        createResponse.EnsureSuccessStatusCode();
        var createdIssue = await createResponse.Content.ReadFromJsonAsync<CreateIssueResponseDto>();

        var updateRequest = new UpdateIssueRequestDto
        {
            Id = createdIssue.Id,
            Title = "", // Invalid data
            Description = "Updated description.",
            PhotoUrl = "http://example.com/updated_photo.jpg",
            Latitude = 55.0,
            Longitude = 65.0,
            Status = "Closed",
            Priority = "High"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/Issues/{createdIssue.Id}", updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task DeleteIssue_ServiceThrowsException_ReturnsNotFound()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Mock the issue service to throw an InvalidOperationException
        var mockIssueService = new Moq.Mock<UrbanAI.Application.Interfaces.IIssueService>();
        mockIssueService.Setup(service => service.DeleteIssueAsync(Moq.It.IsAny<Guid>()))
            .ThrowsAsync(new InvalidOperationException("Issue not found."));

        // Replace the real service with the mock in the test host
        _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.RemoveAll(typeof(UrbanAI.Application.Interfaces.IIssueService));
                services.AddSingleton(mockIssueService.Object);
            });
        });

        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await _client.DeleteAsync($"/api/Issues/{nonExistentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }    [Fact]
    public async Task GetAllIssues_NoIssuesFound_ReturnsOkWithEmptyList()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Clear any existing issues from the database
        await ClearDatabaseAsync();

        // Act
        var response = await _client.GetAsync("/api/Issues");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var issues = await response.Content.ReadFromJsonAsync<IEnumerable<UrbanAI.Application.DTOs.IssueDto>>();
        issues.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public async Task GetIssueById_ServiceReturnsNull_ReturnsNotFound()
    {
        // Arrange
        var token = await GetUserTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Mock the issue service to return null
        var mockIssueService = new Moq.Mock<UrbanAI.Application.Interfaces.IIssueService>();
        mockIssueService.Setup(service => service.GetIssueByIdAsync(Moq.It.IsAny<Guid>()))
            .ReturnsAsync((UrbanAI.Application.DTOs.IssueDto)null);

        // Replace the real service with the mock in the test host
        _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.RemoveAll(typeof(UrbanAI.Application.Interfaces.IIssueService));
                services.AddSingleton(mockIssueService.Object);
            });
        });

        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/Issues/{nonExistentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
