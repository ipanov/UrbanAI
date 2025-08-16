using Xunit;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using UrbanAI.Application.DTOs;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Text.Json;
using Moq;
using UrbanAI.Application.Interfaces;

namespace UrbanAI.API.IntegrationTests.Controllers
{
    [Collection("Integration Tests")]
    public class OAuthCallbackControllerTests : TestBase
    {
        private readonly Mock<IOAuthService> _mockOAuthService;
        private readonly Mock<IUserService> _mockUserService;

        public OAuthCallbackControllerTests(CustomWebApplicationFactory factory) : base(factory)
        {
            // Get the mocked services from the factory
            _mockOAuthService = factory.Services.GetService(typeof(IOAuthService)) as Mock<IOAuthService>;
            _mockUserService = factory.Services.GetService(typeof(IUserService)) as Mock<IUserService>;
        }

        [Fact]
        public async Task GetAuthorizationUrl_ShouldReturnOk_WhenValidProviderProvided()
        {
            // Arrange
            var provider = "google";

            // Act
            var response = await _client.PostAsync($"/api/v1/oauth/authorize/{provider}", null);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetAuthorizationUrl_ShouldReturnBadRequest_WhenInvalidProviderProvided()
        {
            // Arrange
            var provider = "invalid";

            // Act
            var response = await _client.PostAsync($"/api/v1/oauth/authorize/{provider}", null);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task HandleCallback_ShouldReturnBadRequest_WhenCodeIsMissing()
        {
            // Arrange
            var provider = "google";
            var queryParams = "?state=test123&codeVerifier=test456";

            // Act
            var response = await _client.GetAsync($"/api/v1/oauth/callback/{provider}{queryParams}");

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task HandleCallback_ShouldReturnBadRequest_WhenCodeVerifierIsMissing()
        {
            // Arrange
            var provider = "google";
            var queryParams = "?code=test123&state=test456";

            // Act
            var response = await _client.GetAsync($"/api/v1/oauth/callback/{provider}{queryParams}");

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task HandleCallback_ShouldReturnBadRequest_WhenInvalidProviderProvided()
        {
            // Arrange
            var provider = "invalid";
            var queryParams = "?code=test123&state=test456&codeVerifier=test789";

            // Act
            var response = await _client.GetAsync($"/api/v1/oauth/callback/{provider}{queryParams}");

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
