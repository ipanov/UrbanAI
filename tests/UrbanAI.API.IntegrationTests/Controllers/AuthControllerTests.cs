using Xunit;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using UrbanAI.Application.DTOs;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Text;

namespace UrbanAI.API.IntegrationTests.Controllers
{
    [Collection("Integration Tests")]
    public class AuthControllerTests : TestBase
    {
        public AuthControllerTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task RegisterExternal_ShouldReturnOk_WhenValidDataProvided()
        {
            // Arrange
            var request = new
            {
                Provider = "google",
                ExternalId = "test123"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/register-external", request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task ExchangeToken_ShouldReturnBadRequest_WhenProviderIsInvalid()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Provider = "InvalidProvider",
                Token = "InvalidToken"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task ExchangeToken_WithMockToken_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Provider = "google",
                Token = "mock:test123"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}
