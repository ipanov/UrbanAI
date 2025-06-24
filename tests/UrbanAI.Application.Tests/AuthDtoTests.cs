using UrbanAI.Application.DTOs;

namespace UrbanAI.Application.Tests
{
    public class AuthDtoTests
    {
        [Fact]
        public void AuthRequestDto_CanBeCreated()
        {
            // Arrange & Act
            var dto = new AuthRequestDto
            {
                Provider = "google",
                Token = "auth-token-123",
                Username = "testuser",
                Email = "test@example.com"
            };

            // Assert
            Assert.Equal("google", dto.Provider);
            Assert.Equal("auth-token-123", dto.Token);
            Assert.Equal("testuser", dto.Username);
            Assert.Equal("test@example.com", dto.Email);
        }

        [Fact]
        public void AuthResponseDto_CanBeCreated()
        {
            // Arrange & Act
            var dto = new AuthResponseDto
            {
                Token = "jwt-token-123"
            };

            // Assert
            Assert.Equal("jwt-token-123", dto.Token);
        }
    }
}
