using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace UrbanAI.API.Tests
{
    /// <summary>
    /// Test authentication handler for mocking OAuth authentication in tests
    /// </summary>
    public class TestAuthenticationHandler : AuthenticationHandler<TestAuthenticationSchemeOptions>
    {
        public const string AuthenticationScheme = "Test";
        public const string TestUserId = "test-user-123";
        public const string TestUserName = "Test User";
        public const string TestProvider = "TestProvider";

        public TestAuthenticationHandler(IOptionsMonitor<TestAuthenticationSchemeOptions> options,
            ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // Check if we should authenticate or not based on test configuration
            if (!Options.ShouldAuthenticate)
            {
                return Task.FromResult(AuthenticateResult.NoResult());
            }

            // Create test claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, Options.UserId ?? TestUserId),
                new Claim(ClaimTypes.Name, Options.UserName ?? TestUserName),
                new Claim("provider", Options.Provider ?? TestProvider),
                new Claim("external_id", Options.ExternalId ?? "test-external-123"),
                new Claim("email", Options.Email ?? "test@example.com"),
                new Claim("isAnonymous", Options.IsAnonymous.ToString().ToLower())
            };

            // Add custom claims if provided
            if (Options.CustomClaims != null)
            {
                claims.AddRange(Options.CustomClaims);
            }

            var identity = new ClaimsIdentity(claims, AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, AuthenticationScheme);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }

    /// <summary>
    /// Configuration options for test authentication
    /// </summary>
    public class TestAuthenticationSchemeOptions : AuthenticationSchemeOptions
    {
        public bool ShouldAuthenticate { get; set; } = true;
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? Provider { get; set; }
        public string? ExternalId { get; set; }
        public string? Email { get; set; }
        public bool IsAnonymous { get; set; } = true;
        public List<Claim>? CustomClaims { get; set; }
    }
}