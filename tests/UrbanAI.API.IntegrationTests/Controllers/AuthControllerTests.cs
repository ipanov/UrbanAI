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
        public async Task Register_ShouldReturnBadRequest_WhenModelIsInvalid()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Username = "TestUser",
                Email = "invalid-email",
                Password = ""
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/register", request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenCredentialsAreInvalid()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Username = "InvalidUser",
                Password = "InvalidPassword"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/login", request);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
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
    }
}
