using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using UrbanAI.API.IntegrationTests;
using UrbanAI.Application.DTOs;
using UrbanAI.Domain.Entities;
using Xunit;

namespace UrbanAI.API.IntegrationTests.Controllers;

public class IssuesControllerTests : TestBase
{
    public IssuesControllerTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    private async Task<string> GetAuthTokenAsync(string username, string password)
    {
        var registerRequest = new AuthRequestDto
        {
            Username = username,
            Email = $"{username}@example.com",
            Password = password
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new AuthRequestDto
        {
            Username = username,
            Password = password
        };
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        loginResponse.EnsureSuccessStatusCode();
        var authResponse = await loginResponse.Content.ReadFromJsonAsync<AuthResponseDto>();
        return authResponse!.Token!;
    }

    [Fact]
    public async Task CreateIssue_AuthenticatedUser_ReturnsCreated()
    {
        // Arrange
        var token = await GetAuthTokenAsync("issuecreator", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var request = new CreateIssueRequestDto
        {
            Title = "Test Issue",
            Description = "This is a test issue description.",
            Status = "Open",
            Priority = "High"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/issues", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var issueResponse = await response.Content.ReadFromJsonAsync<CreateIssueResponseDto>();
        issueResponse.Should().NotBeNull();
        issueResponse.Id.Should().NotBeEmpty();
        issueResponse.Title.Should().Be(request.Title);
    }

    [Fact]
    public async Task CreateIssue_UnauthenticatedUser_ReturnsUnauthorized()
    {
        // Arrange
        var request = new CreateIssueRequestDto
        {
            Title = "Unauthorized Issue",
            Description = "This issue should not be created.",
            Status = "Open",
            Priority = "Low"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/issues", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetIssueById_ExistingIssue_ReturnsIssue()
    {
        // Arrange
        var token = await GetAuthTokenAsync("issueviewer", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createRequest = new CreateIssueRequestDto
        {
            Title = "Issue to Retrieve",
            Description = "Description for issue to retrieve.",
            Status = "Open",
            Priority = "Medium"
        };
        var createResponse = await _client.PostAsJsonAsync("/api/issues", createRequest);
        createResponse.EnsureSuccessStatusCode();
        var createdIssue = await createResponse.Content.ReadFromJsonAsync<CreateIssueResponseDto>();
        var issueId = createdIssue!.Id;

        // Act
        var getResponse = await _client.GetAsync($"/api/issues/{issueId}");

        // Assert
        getResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var issueDto = await getResponse.Content.ReadFromJsonAsync<IssueDto>();
        issueDto.Should().NotBeNull();
        issueDto.Id.Should().Be(issueId);
        issueDto.Title.Should().Be(createRequest.Title);
    }

    [Fact]
    public async Task GetIssueById_NonExistentIssue_ReturnsNotFound()
    {
        // Arrange
        var token = await GetAuthTokenAsync("nonexistentissueviewer", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/issues/{nonExistentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateIssue_ExistingIssue_ReturnsNoContent()
    {
        // Arrange
        var token = await GetAuthTokenAsync("issueupdater", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createRequest = new CreateIssueRequestDto
        {
            Title = "Issue to Update",
            Description = "Original description.",
            Status = "Open",
            Priority = "Low"
        };
        var createResponse = await _client.PostAsJsonAsync("/api/issues", createRequest);
        createResponse.EnsureSuccessStatusCode();
        var createdIssue = await createResponse.Content.ReadFromJsonAsync<CreateIssueResponseDto>();
        var issueId = createdIssue!.Id;

        var updateRequest = new UpdateIssueRequestDto
        {
            Title = "Updated Issue Title",
            Description = "Updated description.",
            Status = "Closed",
            Priority = "High"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/issues/{issueId}", updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify update
        var getResponse = await _client.GetAsync($"/api/issues/{issueId}");
        getResponse.EnsureSuccessStatusCode();
        var updatedIssue = await getResponse.Content.ReadFromJsonAsync<IssueDto>();
        updatedIssue.Should().NotBeNull();
        updatedIssue.Title.Should().Be(updateRequest.Title);
        updatedIssue.Status.Should().Be(updateRequest.Status);
    }

    [Fact]
    public async Task UpdateIssue_NonExistentIssue_ReturnsNotFound()
    {
        // Arrange
        var token = await GetAuthTokenAsync("nonexistentissueupdater", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var nonExistentId = Guid.NewGuid();
        var updateRequest = new UpdateIssueRequestDto
        {
            Title = "Non-existent Issue",
            Description = "Should not update.",
            Status = "Open",
            Priority = "Low"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/issues/{nonExistentId}", updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteIssue_ExistingIssue_ReturnsNoContent()
    {
        // Arrange
        var token = await GetAuthTokenAsync("issuedeleter", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createRequest = new CreateIssueRequestDto
        {
            Title = "Issue to Delete",
            Description = "Description for issue to delete.",
            Status = "Open",
            Priority = "Low"
        };
        var createResponse = await _client.PostAsJsonAsync("/api/issues", createRequest);
        createResponse.EnsureSuccessStatusCode();
        var createdIssue = await createResponse.Content.ReadFromJsonAsync<CreateIssueResponseDto>();
        var issueId = createdIssue!.Id;

        // Act
        var deleteResponse = await _client.DeleteAsync($"/api/issues/{issueId}");

        // Assert
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify deletion
        var getResponse = await _client.GetAsync($"/api/issues/{issueId}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteIssue_NonExistentIssue_ReturnsNotFound()
    {
        // Arrange
        var token = await GetAuthTokenAsync("nonexistentissuedeleter", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await _client.DeleteAsync($"/api/issues/{nonExistentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
