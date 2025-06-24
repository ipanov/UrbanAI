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
        public async Task Register_ShouldReturnOk_WhenUserRegistersSuccessfully()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Username = "testuser",
                Password = "TestPassword123!"
            };

            // Act
            var result = await _controller.Register(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.NotNull(response.Token);

            // Verify user was created in database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            Assert.NotNull(user);
            Assert.True(BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash));
        }

        [Fact]
        public async Task Register_ShouldReturnBadRequest_WhenUsernameIsEmpty()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Username = "",
                Password = "TestPassword123!"
            };

            // Act
            var result = await _controller.Register(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Username and Password are required.", badRequestResult.Value);
        }

        [Fact]
        public async Task Register_ShouldReturnBadRequest_WhenPasswordIsTooShort()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Username = "testuser",
                Password = "123"
            };

            // Act
            var result = await _controller.Register(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Password must be at least 8 characters long.", badRequestResult.Value);
        }

        [Fact]
        public async Task Register_ShouldReturnConflict_WhenUsernameAlreadyExists()
        {
            // Arrange
            var existingUser = new User
            {
                Id = Guid.NewGuid(),
                Username = "existinguser",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(existingUser);
            await _context.SaveChangesAsync();

            var request = new AuthRequestDto
            {
                Username = "existinguser",
                Password = "NewPassword123!"
            };

            // Act
            var result = await _controller.Register(request);

            // Assert
            var conflictResult = Assert.IsType<ConflictObjectResult>(result);
            Assert.Equal("Username already exists.", conflictResult.Value);
        }

        [Fact]
        public async Task Login_ShouldReturnOk_WhenCredentialsAreValid()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "testuser",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("TestPassword123!"),
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new AuthRequestDto
            {
                Username = "testuser",
                Password = "TestPassword123!"
            };

            // Act
            var result = await _controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.NotNull(response.Token);
        }

        [Fact]
        public async Task Login_ShouldReturnBadRequest_WhenUsernameIsEmpty()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Username = "",
                Password = "TestPassword123!"
            };

            // Act
            var result = await _controller.Login(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Username and Password are required.", badRequestResult.Value);
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenUserDoesNotExist()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Username = "nonexistentuser",
                Password = "TestPassword123!"
            };

            // Act
            var result = await _controller.Login(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid credentials.", unauthorizedResult.Value);
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenPasswordIsIncorrect()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "testuser",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword123!"),
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var request = new AuthRequestDto
            {
                Username = "testuser",
                Password = "WrongPassword123!"
            };

            // Act
            var result = await _controller.Login(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid credentials.", unauthorizedResult.Value);
        }

        [Fact]
        public async Task Register_ShouldHashPassword_WhenUserIsCreated()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Username = "testuser",
                Password = "TestPassword123!"
            };

            // Act
            await _controller.Register(request);

            // Assert
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            Assert.NotNull(user);
            Assert.NotEqual(request.Password, user.PasswordHash);
            Assert.True(BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash));
        }

        [Fact]
        public async Task Register_ShouldSetDefaultRole_WhenUserIsCreated()
        {
            // Arrange
            var request = new AuthRequestDto
            {
                Username = "testuser",
                Password = "TestPassword123!"
            };

            // Act
            await _controller.Register(request);

            // Assert
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            Assert.NotNull(user);
            Assert.Equal("User", user.Role);
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

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
