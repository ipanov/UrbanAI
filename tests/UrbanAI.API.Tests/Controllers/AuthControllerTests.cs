using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using UrbanAI.API.Controllers;
using UrbanAI.Infrastructure.Data;
using UrbanAI.Domain.Entities;
using UrbanAI.Application.DTOs;
using Microsoft.EntityFrameworkCore;

namespace UrbanAI.API.Tests.Controllers
{
    public class AuthControllerTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            // Create in-memory database for testing
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _mockConfiguration = new Mock<IConfiguration>();

            // Setup JWT configuration
            _mockConfiguration.Setup(c => c["Jwt:Secret"]).Returns("ThisIsATestSecretKeyThatIsAtLeast32CharactersLongForJwtTokenGeneration");
            _mockConfiguration.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
            _mockConfiguration.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");

            _controller = new AuthController(_mockConfiguration.Object, _context);
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
                        ExternalId = "google123"
                    }
                }
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

            // Verify no duplicate user was created
            var userCount = await _context.Users.CountAsync();
            Assert.Equal(1, userCount);
        }

        [Fact]
        public async Task RegisterExternal_ShouldReturnBadRequest_WhenExternalIdIsEmpty()
        {
            // Arrange
            var dto = new AuthController.ExternalRegisterDto
            {
                Provider = "google",
                ExternalId = ""
            };

            // Act
            var result = await _controller.RegisterExternal(dto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Provider and ExternalId are required.", badRequestResult.Value);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}