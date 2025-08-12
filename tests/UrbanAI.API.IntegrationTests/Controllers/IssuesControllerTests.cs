using Xunit;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using UrbanAI.Application.DTOs;
using UrbanAI.Domain.Entities;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace UrbanAI.API.IntegrationTests.Controllers
{
    [Collection("Integration Tests")]
    public class IssuesControllerTests : TestBase
    {
        public IssuesControllerTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task GetAllIssues_ShouldReturnOkResult_WithListOfIssues()
        {
            // Act
            var response = await _client.GetAsync("/api/Issues");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var issues = await response.Content.ReadFromJsonAsync<List<IssueDto>>();
            Assert.NotNull(issues);
        }

        [Fact]
        public async Task GetIssueById_ShouldReturnOkResult_WhenIssueExists()
        {
            // Arrange - First create an issue
            var createRequest = new CreateIssueRequestDto
            {
                Description = "Test Description for Get",
                PhotoUrl = "test-get.jpg",
                Latitude = 1.0,
                Longitude = 1.0,
                Title = "Test Title for Get",
                Location = "Test Location"
            };

            var createResponse = await _client.PostAsJsonAsync("/api/Issues", createRequest);
            createResponse.EnsureSuccessStatusCode();
            var createContent = await createResponse.Content.ReadAsStringAsync();
            var createdIssue = Newtonsoft.Json.JsonConvert.DeserializeObject<CreateIssueResponseDto>(createContent);

            // Act
            var response = await _client.GetAsync($"/api/Issues/{createdIssue.Id}");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var issue = await response.Content.ReadFromJsonAsync<IssueDto>();
            Assert.NotNull(issue);
            Assert.Equal(createdIssue.Id, issue.Id);
        }

        [Fact]
        public async Task GetIssueById_ShouldReturnNotFound_WhenIssueDoesNotExist()
        {
            // Arrange
            var issueId = Guid.NewGuid();

            // Act
            var response = await _client.GetAsync($"/api/Issues/{issueId}");

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task CreateIssue_ShouldReturnCreatedResult_WithValidRequest()
        {
            // Arrange
            var request = new CreateIssueRequestDto
            {
                Description = "Test Description",
                PhotoUrl = "test.jpg",
                Latitude = 1.0,
                Longitude = 1.0,
                Title = "Test Title",
                Location = "Test Location"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/Issues", request);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var content = await response.Content.ReadAsStringAsync();
            var issue = Newtonsoft.Json.JsonConvert.DeserializeObject<CreateIssueResponseDto>(content);
            Assert.NotNull(issue);
            Assert.NotEqual(Guid.Empty, issue.Id);
        }

        [Fact]
        public async Task UpdateIssue_ShouldReturnNoContent_WhenUpdateSuccessful()
        {
            // Arrange - First create an issue
            var createRequest = new CreateIssueRequestDto
            {
                Description = "Test Description for Update",
                PhotoUrl = "test-update.jpg",
                Latitude = 1.0,
                Longitude = 1.0,
                Title = "Test Title for Update",
                Location = "Test Location"
            };

            var createResponse = await _client.PostAsJsonAsync("/api/Issues", createRequest);
            createResponse.EnsureSuccessStatusCode();
            var createContent = await createResponse.Content.ReadAsStringAsync();
            var createdIssue = Newtonsoft.Json.JsonConvert.DeserializeObject<CreateIssueResponseDto>(createContent);

            var updateRequest = new UpdateIssueRequestDto
            {
                Id = createdIssue.Id,
                Title = "Updated Title",
                Description = "Updated Description",
                PhotoUrl = "updated.jpg",
                Latitude = 2.0,
                Longitude = 2.0,
                Status = "Closed",
                Location = "Test Location"
            };

            // Act
            var response = await _client.PutAsJsonAsync($"/api/Issues/{createdIssue.Id}", updateRequest);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        [Fact]
        public async Task DeleteIssue_ShouldReturnNoContent_WhenDeletionSuccessful()
        {
            // Arrange - First create an issue
            var createRequest = new CreateIssueRequestDto
            {
                Description = "Test Description for Delete",
                PhotoUrl = "test-delete.jpg",
                Latitude = 1.0,
                Longitude = 1.0,
                Title = "Test Title for Delete",
                Location = "Test Location"
            };

            var createResponse = await _client.PostAsJsonAsync("/api/Issues", createRequest);
            createResponse.EnsureSuccessStatusCode();
            var createContent = await createResponse.Content.ReadAsStringAsync();
            var createdIssue = Newtonsoft.Json.JsonConvert.DeserializeObject<CreateIssueResponseDto>(createContent);

            // Act
            var response = await _client.DeleteAsync($"/api/Issues/{createdIssue.Id}");

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        [Fact]
        public async Task GetRegulationsByLocation_ShouldReturnOkResult_WithRegulations()
        {
            // Arrange
            var location = "TestLocation";

            // Act
            var response = await _client.GetAsync($"/api/Issues/regulations/{location}");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var regulations = await response.Content.ReadFromJsonAsync<List<Regulation>>();
            Assert.NotNull(regulations);
        }
    }
}
