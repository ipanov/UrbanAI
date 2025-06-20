using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using UrbanAI.API.IntegrationTests;
using UrbanAI.Application.DTOs;
using Xunit;

namespace UrbanAI.API.IntegrationTests.Controllers;

public class AuthControllerTests : TestBase
{
    public AuthControllerTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

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
        authResponse.Token.Should().NotBeNullOrEmpty();
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
    }

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
        authResponse.Token.Should().NotBeNullOrEmpty();
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
    }
}
