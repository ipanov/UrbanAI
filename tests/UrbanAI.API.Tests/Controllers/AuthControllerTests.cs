using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using UrbanAI.API.Controllers;
using UrbanAI.Infrastructure.Data;
using UrbanAI.Domain.Entities;
using UrbanAI.Application.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace UrbanAI.API.Tests.Controllers
{
    public class AuthControllerTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IHttpClientFactory> _mockHttpClientFactory;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            // Create in-memory database for testing
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _mockConfiguration = new Mock<IConfiguration>();
            _mockHttpClientFactory = new Mock<IHttpClientFactory>();

            // Setup JWT configuration
            _mockConfiguration.Setup(c => c["Jwt:Secret"]).Returns("ThisIsATestSecretKeyThatIsAtLeast32CharactersLongForJwtTokenGeneration");
            _mockConfiguration.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
            _mockConfiguration.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");

            _controller = new AuthController(_mockHttpClientFactory.Object, _mockConfiguration.Object, _context);
        }

        [Fact]
        public async Task ExchangeToken_ShouldReturnBadRequest_WhenProviderIsEmpty()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Provider = "",
                Token = "valid-token"
            };

            // Act
            var result = await _controller.ExchangeToken(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Provider and token are required.", badRequestResult.Value);
        }

        [Fact]
        public async Task ExchangeToken_ShouldReturnBadRequest_WhenProviderIsUnsupported()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Provider = "unsupported",
                Token = "valid-token"
            };

            // Act
            var result = await _controller.ExchangeToken(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Unsupported provider.", badRequestResult.Value);
        }

        [Fact]
        public async Task RegisterExternal_ShouldReturnBadRequest_WhenProviderIsEmpty()
        {
            // Arrange
            var dto = new AuthController.ExternalRegisterDto
            {
                Provider = "",
                ExternalId = "external123"
            };

            // Act
            var result = await _controller.RegisterExternal(dto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Provider and ExternalId are required.", badRequestResult.Value);
        }

        [Fact]
        public async Task RegisterExternal_ShouldCreateUser_WhenValidDataProvided()
        {
            // Arrange
            var dto = new AuthController.ExternalRegisterDto
            {
                Provider = "google",
                ExternalId = "google123"
            };

            // Act
            var result = await _controller.RegisterExternal(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.NotNull(response.Token);

            // Verify user was created in database
            var user = await _context.Users
                .Include(u => u.ExternalLogins)
                .FirstOrDefaultAsync(u => u.ExternalLogins.Any(l => l.Provider == "google" && l.ExternalId == "google123"));
            Assert.NotNull(user);
            Assert.Equal("google_google123", user.Username);
        }

        [Fact]
        public async Task RegisterExternal_ShouldReturnExistingToken_WhenUserAlreadyExists()
        {
            // Arrange
            var existingUser = new User
            {
                Id = Guid.NewGuid(),
                Username = "google_google123",
                Role = "User",
                ExternalLogins = new List<ExternalLogin>
                {
                    new ExternalLogin
                    {
                        Id = Guid.NewGuid(),
                        Provider = "google",
                        ExternalId = "google123",
                        UserId = Guid.NewGuid(),
                        CreatedAt = DateTime.UtcNow
                    }
                },
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(existingUser);
            await _context.SaveChangesAsync();

            var dto = new AuthController.ExternalRegisterDto
            {
                Provider = "google",
                ExternalId = "google123"
            };

            // Act
            var result = await _controller.RegisterExternal(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.NotNull(response.Token);
        }

        [Fact]
        public async Task ExchangeToken_WithMockToken_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Provider = "google",
                Token = "mock:google123"
            };

            // Act
            var result = await _controller.ExchangeToken(request);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = notFoundResult.Value;
            Assert.NotNull(response);
            
            // Convert to dictionary for easier access
            var responseDict = response.GetType().GetProperties()
                .ToDictionary(p => p.Name, p => p.GetValue(response));
                
            Assert.True((bool)responseDict["requiresRegistration"]);
            Assert.Equal("google", responseDict["provider"]);
            Assert.Equal("google123", responseDict["externalId"]);
        }

        [Fact]
        public async Task ExchangeToken_WithMockToken_ShouldReturnToken_WhenUserExists()
        {
            // Arrange
            var existingUser = new User
            {
                Id = Guid.NewGuid(),
                Username = "google_google123",
                Role = "User",
                ExternalLogins = new List<ExternalLogin>
                {
                    new ExternalLogin
                    {
                        Id = Guid.NewGuid(),
                        Provider = "google",
                        ExternalId = "google123",
                        UserId = Guid.NewGuid(),
                        CreatedAt = DateTime.UtcNow
                    }
                },
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(existingUser);
            await _context.SaveChangesAsync();

            var request = new AuthRequestDto
            {
                Provider = "google",
                Token = "mock:google123"
            };

            // Act
            var result = await _controller.ExchangeToken(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.NotNull(response.Token);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
