using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using UrbanAI.API.IntegrationTests;
using UrbanAI.Application.DTOs;
using Xunit;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace UrbanAI.API.IntegrationTests.Controllers;

[Collection("Integration Tests")]
public class AuthControllerTests : TestBase
{
    public AuthControllerTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    #region Register Tests

    [Fact]
    public async Task Register_ValidUser_ReturnsSuccess()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = "testuser",
            Email = "test@example.com",
            Password = "Password123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var authResponse = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
        authResponse.Should().NotBeNull();
        authResponse.Token.Should().NotBeNullOrEmpty();        // Verify JWT token structure
        var tokenHandler = new JwtSecurityTokenHandler();
        var jsonToken = tokenHandler.ReadJwtToken(authResponse.Token);
        jsonToken.Claims.Should().Contain(c => c.Type == "unique_name" && c.Value == "testuser");
        jsonToken.Claims.Should().Contain(c => c.Type == "role" && c.Value == "User");
    }

    [Fact]
    public async Task Register_ExistingUser_ReturnsConflict()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = "existinguser",
            Email = "existing@example.com",
            Password = "Password123!"
        };

        // Register the user first
        await _client.PostAsJsonAsync("/api/auth/register", request);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Username already exists");
    }

    [Fact]
    public async Task Register_WeakPassword_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = "weakpassworduser",
            Email = "weak@example.com",
            Password = "weak"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Password must be at least 8 characters long");
    }

    [Fact]
    public async Task Register_MissingUsername_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = null,
            Email = "test@example.com",
            Password = "Password123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Username and Password are required");
    }

    [Fact]
    public async Task Register_MissingPassword_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = "testuser",
            Email = "test@example.com",
            Password = null
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Username and Password are required");
    }

    [Fact]
    public async Task Register_EmptyUsername_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = "",
            Email = "test@example.com",
            Password = "Password123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Username and Password are required");
    }

    [Fact]
    public async Task Register_EmptyPassword_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = "testuser",
            Email = "test@example.com",
            Password = ""
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Username and Password are required");
    }

    #endregion

    #region Login Tests

    [Fact]
    public async Task Login_ValidCredentials_ReturnsSuccess()
    {
        // Arrange
        var registerRequest = new AuthRequestDto
        {
            Username = "loginuser",
            Email = "login@example.com",
            Password = "Password123!"
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new AuthRequestDto
        {
            Username = "loginuser",
            Password = "Password123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var authResponse = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
        authResponse.Should().NotBeNull();
        authResponse.Token.Should().NotBeNullOrEmpty();        // Verify JWT token structure
        var tokenHandler = new JwtSecurityTokenHandler();
        var jsonToken = tokenHandler.ReadJwtToken(authResponse.Token);
        jsonToken.Claims.Should().Contain(c => c.Type == "unique_name" && c.Value == "loginuser");
        jsonToken.Claims.Should().Contain(c => c.Type == "role" && c.Value == "User");
    }

    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var loginRequest = new AuthRequestDto
        {
            Username = "nonexistentuser",
            Password = "WrongPassword!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Invalid credentials");
    }

    [Fact]
    public async Task Login_ValidUserWrongPassword_ReturnsUnauthorized()
    {
        // Arrange
        var registerRequest = new AuthRequestDto
        {
            Username = "validuser",
            Email = "valid@example.com",
            Password = "Password123!"
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new AuthRequestDto
        {
            Username = "validuser",
            Password = "WrongPassword!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Invalid credentials");
    }

    [Fact]
    public async Task Login_MissingUsername_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = null,
            Password = "Password123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Username and Password are required");
    }

    [Fact]
    public async Task Login_MissingPassword_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = "testuser",
            Password = null
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Username and Password are required");
    }

    [Fact]
    public async Task Login_EmptyUsername_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = "",
            Password = "Password123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Username and Password are required");
    }

    [Fact]
    public async Task Login_EmptyPassword_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Username = "testuser",
            Password = ""
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Username and Password are required");
    }

    #endregion

    #region ExchangeToken Tests

    [Fact]
    public async Task ExchangeToken_MissingProvider_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Provider = null,
            Token = "valid_token"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Provider and token are required");
    }

    [Fact]
    public async Task ExchangeToken_MissingToken_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Provider = "google",
            Token = null
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Provider and token are required");
    }

    [Fact]
    public async Task ExchangeToken_EmptyProvider_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Provider = "",
            Token = "valid_token"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Provider and token are required");
    }

    [Fact]
    public async Task ExchangeToken_EmptyToken_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Provider = "google",
            Token = ""
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Provider and token are required");
    }

    [Fact]
    public async Task ExchangeToken_UnsupportedProvider_ReturnsBadRequest()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Provider = "twitter",
            Token = "valid_token"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Unsupported provider");
    }

    [Fact]
    public async Task ExchangeToken_GoogleInvalidToken_ReturnsUnauthorized()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Provider = "google",
            Token = "invalid_google_token"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Invalid Google token");
    }

    [Fact]
    public async Task ExchangeToken_MicrosoftInvalidToken_ReturnsUnauthorized()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Provider = "microsoft",
            Token = "invalid_microsoft_token"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Invalid Microsoft token");
    }

    [Fact]
    public async Task ExchangeToken_FacebookInvalidToken_ReturnsUnauthorized()
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Provider = "facebook",
            Token = "invalid_facebook_token"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Invalid Facebook token");
    }

    [Theory]
    [InlineData("google")]
    [InlineData("Google")]
    [InlineData("GOOGLE")]
    [InlineData("microsoft")]
    [InlineData("Microsoft")]
    [InlineData("MICROSOFT")]
    [InlineData("facebook")]
    [InlineData("Facebook")]
    [InlineData("FACEBOOK")]
    public async Task ExchangeToken_SupportedProviders_CaseInsensitive_ReturnsUnauthorized(string provider)
    {
        // Arrange
        var request = new AuthRequestDto
        {
            Provider = provider,
            Token = "invalid_token_but_valid_format"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/exchange-token", request);

        // Assert
        // Should attempt to validate the token and return unauthorized (not bad request)
        // This tests that the provider case-insensitive logic works
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    #endregion
}
