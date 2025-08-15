using UrbanAI.Application.Services;

namespace UrbanAI.Application.Interfaces
{
    public interface IOAuthService
    {
        string GenerateCodeVerifier();
        string GenerateCodeChallenge(string codeVerifier);
        string GenerateState();
        string BuildAuthorizationUrl(string provider, string clientId, string redirectUri, string state, string codeChallenge);
        Task<OAuthTokenResponse> ExchangeCodeForTokenAsync(string provider, string code, string codeVerifier, string clientId, string clientSecret, string redirectUri);
        Task<OAuthUserInfo> GetUserInfoAsync(string provider, string accessToken);
    }
}
