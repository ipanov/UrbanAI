using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Http;
using UrbanAI.Application.Interfaces;

namespace UrbanAI.Application.Services
{

    public class OAuthTokenResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public string IdToken { get; set; } = string.Empty;
        public string TokenType { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class OAuthUserInfo
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
    }

    public class OAuthService : IOAuthService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public OAuthService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public string GenerateCodeVerifier()
        {
            // Generate a cryptographically secure random string for PKCE
            var bytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes)
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');
        }

        public string GenerateCodeChallenge(string codeVerifier)
        {
            // Create SHA256 hash of code verifier for PKCE
            if (string.IsNullOrEmpty(codeVerifier))
                throw new ArgumentException("Code verifier cannot be null or empty", nameof(codeVerifier));
                
            using var sha256 = SHA256.Create();
            var challengeBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(codeVerifier));
            return Convert.ToBase64String(challengeBytes)
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');
        }

        public string GenerateState()
        {
            // Generate secure random state for CSRF protection
            return Guid.NewGuid().ToString("N");
        }

        public string BuildAuthorizationUrl(string provider, string clientId, string redirectUri, string state, string codeChallenge)
        {
            var baseUrl = provider.ToLowerInvariant() switch
            {
                "google" => "https://accounts.google.com/o/oauth2/v2/auth",
                "microsoft" => "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
                "facebook" => "https://www.facebook.com/v18.0/dialog/oauth",
                _ => throw new ArgumentException($"Unsupported provider: {provider}")
            };

            var scope = provider.ToLowerInvariant() switch
            {
                "google" => "openid profile email",
                "microsoft" => "openid profile email User.Read",
                "facebook" => "email public_profile",
                _ => throw new ArgumentException($"Unsupported provider: {provider}")
            };

            var parameters = new Dictionary<string, string>
            {
                ["client_id"] = clientId,
                ["redirect_uri"] = redirectUri,
                ["response_type"] = "code",
                ["scope"] = scope,
                ["state"] = state
            };

            // Add PKCE parameters for Google and Microsoft (Facebook doesn't support PKCE)
            if (provider.ToLowerInvariant() != "facebook")
            {
                parameters["code_challenge"] = codeChallenge;
                parameters["code_challenge_method"] = "S256";
            }

            var queryString = string.Join("&", parameters.Select(p => $"{p.Key}={Uri.EscapeDataString(p.Value)}"));
            return $"{baseUrl}?{queryString}";
        }

        public async Task<OAuthTokenResponse> ExchangeCodeForTokenAsync(string provider, string code, string codeVerifier, string clientId, string clientSecret, string redirectUri)
        {
            var httpClient = _httpClientFactory.CreateClient();

            var tokenUrl = provider.ToLowerInvariant() switch
            {
                "google" => "https://oauth2.googleapis.com/token",
                "microsoft" => "https://login.microsoftonline.com/common/oauth2/v2.0/token",
                "facebook" => "https://graph.facebook.com/v18.0/oauth/access_token",
                _ => throw new ArgumentException($"Unsupported provider: {provider}")
            };

            var parameters = new Dictionary<string, string>
            {
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
                ["code"] = code,
                ["grant_type"] = "authorization_code",
                ["redirect_uri"] = redirectUri
            };

            // Add PKCE code verifier for Google and Microsoft
            if (provider.ToLowerInvariant() != "facebook")
            {
                parameters["code_verifier"] = codeVerifier;
            }

            var content = new FormUrlEncodedContent(parameters);
            var response = await httpClient.PostAsync(tokenUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new InvalidOperationException($"Token exchange failed: {errorContent}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenData = JsonSerializer.Deserialize<JsonElement>(responseContent);

            return new OAuthTokenResponse
            {
                AccessToken = tokenData.GetProperty("access_token").GetString() ?? string.Empty,
                IdToken = tokenData.TryGetProperty("id_token", out var idToken) ? idToken.GetString() ?? string.Empty : string.Empty,
                TokenType = tokenData.GetProperty("token_type").GetString() ?? "Bearer",
                ExpiresIn = tokenData.GetProperty("expires_in").GetInt32(),
                RefreshToken = tokenData.TryGetProperty("refresh_token", out var refreshToken) ? refreshToken.GetString() ?? string.Empty : string.Empty
            };
        }

        public async Task<OAuthUserInfo> GetUserInfoAsync(string provider, string accessToken)
        {
            Console.WriteLine($"[OAuth] Getting user info for provider: {provider}");
            
            var httpClient = _httpClientFactory.CreateClient();

            var userInfoUrl = provider.ToLowerInvariant() switch
            {
                "google" => "https://www.googleapis.com/oauth2/v2/userinfo",
                "microsoft" => "https://graph.microsoft.com/v1.0/me",
                "facebook" => "https://graph.facebook.com/v18.0/me?fields=id,name,first_name,last_name,email,picture",
                _ => throw new ArgumentException($"Unsupported provider: {provider}")
            };

            httpClient.DefaultRequestHeaders.Authorization = 
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var response = await httpClient.GetAsync(userInfoUrl);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[OAuth] User info request failed for {provider}: {response.StatusCode} - {errorContent}");
                throw new InvalidOperationException($"User info request failed: {errorContent}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"[OAuth] User info response for {provider}: {responseContent}");
            var userData = JsonSerializer.Deserialize<JsonElement>(responseContent);

            return provider.ToLowerInvariant() switch
            {
                "google" => new OAuthUserInfo
                {
                    Id = userData.GetProperty("id").GetString() ?? string.Empty,
                    Name = userData.GetProperty("name").GetString() ?? string.Empty,
                    FirstName = userData.TryGetProperty("given_name", out var googleFirstName) ? googleFirstName.GetString() ?? string.Empty : string.Empty,
                    LastName = userData.TryGetProperty("family_name", out var googleLastName) ? googleLastName.GetString() ?? string.Empty : string.Empty,
                    Email = userData.GetProperty("email").GetString() ?? string.Empty,
                    Picture = userData.GetProperty("picture").GetString() ?? string.Empty
                },
                "microsoft" => new OAuthUserInfo
                {
                    Id = userData.GetProperty("id").GetString() ?? string.Empty,
                    Name = userData.GetProperty("displayName").GetString() ?? string.Empty,
                    FirstName = userData.TryGetProperty("givenName", out var msFirstName) ? msFirstName.GetString() ?? string.Empty : string.Empty,
                    LastName = userData.TryGetProperty("surname", out var msLastName) ? msLastName.GetString() ?? string.Empty : string.Empty,
                    Email = userData.TryGetProperty("mail", out var mail) ? mail.GetString() ?? string.Empty :
                           userData.TryGetProperty("userPrincipalName", out var upn) ? upn.GetString() ?? string.Empty : string.Empty,
                    Picture = string.Empty // Microsoft Graph requires separate call for photo
                },
                "facebook" => new OAuthUserInfo
                {
                    Id = userData.GetProperty("id").GetString() ?? string.Empty,
                    Name = userData.GetProperty("name").GetString() ?? string.Empty,
                    FirstName = userData.TryGetProperty("first_name", out var fbFirstName) ? fbFirstName.GetString() ?? string.Empty : string.Empty,
                    LastName = userData.TryGetProperty("last_name", out var fbLastName) ? fbLastName.GetString() ?? string.Empty : string.Empty,
                    Email = userData.TryGetProperty("email", out var email) ? email.GetString() ?? string.Empty : string.Empty,
                    Picture = userData.TryGetProperty("picture", out var picture) && 
                             picture.TryGetProperty("data", out var data) && 
                             data.TryGetProperty("url", out var url) ? url.GetString() ?? string.Empty : string.Empty
                },
                _ => throw new ArgumentException($"Unsupported provider: {provider}")
            };
        }
    }
}
