using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using System.Net;
using System.Text;
using System.Text.Json;
using UrbanAI.Application.Services;
using Xunit;

namespace UrbanAI.Application.Tests;

public class OAuthServiceTests
{
    private readonly Mock<IHttpClientFactory> _httpClientFactoryMock;
    private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
    private readonly HttpClient _httpClient;
    private readonly OAuthService _oauthService;

    public OAuthServiceTests()
    {
        _httpClientFactoryMock = new Mock<IHttpClientFactory>();
        _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
        
        _httpClient = new HttpClient(_httpMessageHandlerMock.Object);
        _httpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<string>())).Returns(_httpClient);
        
        _oauthService = new OAuthService(_httpClientFactoryMock.Object);
    }

    [Fact]
    public void GenerateCodeVerifier_ShouldReturnValidCodeVerifier()
    {
        // Act
        var codeVerifier = _oauthService.GenerateCodeVerifier();

        // Assert
        Assert.NotNull(codeVerifier);
        Assert.True(codeVerifier.Length >= 43 && codeVerifier.Length <= 128);
        Assert.Matches(@"^[A-Za-z0-9\-._~]+$", codeVerifier);
    }

    [Fact]
    public void GenerateCodeChallenge_ShouldReturnValidCodeChallenge()
    {
        // Arrange
        var codeVerifier = "test-code-verifier-123";

        // Act
        var codeChallenge = _oauthService.GenerateCodeChallenge(codeVerifier);

        // Assert
        Assert.NotNull(codeChallenge);
        Assert.NotEmpty(codeChallenge);
        Assert.DoesNotContain("=", codeChallenge); // Base64URL should not have padding
    }

    [Fact]
    public void GenerateState_ShouldReturnValidState()
    {
        // Act
        var state = _oauthService.GenerateState();

        // Assert
        Assert.NotNull(state);
        Assert.True(state.Length >= 32);
        Assert.Matches(@"^[A-Za-z0-9\-._~]+$", state);
    }

    [Theory]
    [InlineData("google")]
    [InlineData("microsoft")]
    [InlineData("facebook")]
    public void BuildAuthorizationUrl_ShouldReturnValidUrl(string provider)
    {
        // Arrange
        var clientId = "test-client-id";
        var redirectUri = "https://localhost:5001/api/v1/oauth/callback/" + provider;
        var state = "test-state";
        var codeChallenge = "test-code-challenge";

        // Act
        var authUrl = _oauthService.BuildAuthorizationUrl(provider, clientId, redirectUri, state, codeChallenge);

        // Assert
        Assert.NotNull(authUrl);
        Assert.Contains(clientId, authUrl);
        Assert.Contains(Uri.EscapeDataString(redirectUri), authUrl);
        Assert.Contains(state, authUrl);
        if (provider != "facebook")
        {
            Assert.Contains(codeChallenge, authUrl);
            Assert.Contains("code_challenge_method=S256", authUrl);
        }
    }

    [Fact]
    public async Task ExchangeCodeForTokenAsync_Google_ShouldReturnTokenResponse()
    {
        // Arrange
        var tokenResponse = new
        {
            access_token = "test-access-token",
            token_type = "Bearer",
            expires_in = 3600,
            refresh_token = "test-refresh-token"
        };

        var responseContent = JsonSerializer.Serialize(tokenResponse);
        var httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(responseContent, Encoding.UTF8, "application/json")
        };

        _httpMessageHandlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(httpResponse);

        // Act
        var result = await _oauthService.ExchangeCodeForTokenAsync(
            "google",
            "test-code",
            "test-code-verifier",
            "test-client-id",
            "test-client-secret",
            "https://localhost:5001/api/v1/oauth/callback/google");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("test-access-token", result.AccessToken);
        Assert.Equal("Bearer", result.TokenType);
        Assert.Equal(3600, result.ExpiresIn);
        Assert.Equal("test-refresh-token", result.RefreshToken);
    }

        [Fact]
        public async Task GetUserInfoAsync_Google_ShouldReturnUserInfo()
        {
            // Arrange
            var userInfo = new
            {
                id = "123456789",
                name = "Test User",
                email = "test@example.com",
                picture = "https://example.com/avatar.jpg"
            };

            var responseContent = JsonSerializer.Serialize(userInfo);
            var httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(responseContent, Encoding.UTF8, "application/json")
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(httpResponse);

            // Act
            var result = await _oauthService.GetUserInfoAsync("google", "test-access-token");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("123456789", result.Id);
            Assert.Equal("Test User", result.Name);
            Assert.Equal("test@example.com", result.Email);
            Assert.Equal("https://example.com/avatar.jpg", result.Picture);
        }

    [Fact]
    public async Task ExchangeCodeForTokenAsync_InvalidProvider_ShouldThrowException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _oauthService.ExchangeCodeForTokenAsync(
                "invalid-provider",
                "test-code",
                "test-code-verifier",
                "test-client-id",
                "test-client-secret",
                "https://localhost:5001/api/v1/oauth/callback/invalid"));
    }

    [Fact]
    public async Task GetUserInfoAsync_InvalidProvider_ShouldThrowException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _oauthService.GetUserInfoAsync("invalid-provider", "test-access-token"));
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void GenerateCodeChallenge_InvalidCodeVerifier_ShouldThrowException(string codeVerifier)
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => _oauthService.GenerateCodeChallenge(codeVerifier));
    }
}
