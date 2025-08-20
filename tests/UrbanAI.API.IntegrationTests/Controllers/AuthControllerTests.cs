using Xunit;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

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
        public async Task RegisterExternal_ShouldReturnBadRequest_WhenProviderIsEmpty()
        {
            // Arrange
            var request = new
            {
                Provider = "",
                ExternalId = "test123"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/register-external", request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task RegisterExternal_ShouldReturnBadRequest_WhenExternalIdIsEmpty()
        {
            // Arrange
            var request = new
            {
                Provider = "google",
                ExternalId = ""
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/register-external", request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}