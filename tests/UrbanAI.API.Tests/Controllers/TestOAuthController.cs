using Microsoft.AspNetCore.Mvc;
using UrbanAI.Application.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace UrbanAI.API.Tests.Controllers
{
    /// <summary>
    /// Test controller for mocking OAuth functionality in tests
    /// This controller will ONLY be available in test environments
    /// </summary>
    [ApiController]
    [Route("api/test/oauth")]
    [AllowAnonymous]
    public class TestOAuthController : ControllerBase
    {
        /// <summary>
        /// Mock OAuth authorization endpoint for testing
        /// </summary>
        [HttpPost("authorize/{provider}")]
        public IActionResult MockAuthorize(string provider, [FromBody] OAuthAuthorizationDto request)
        {
            // Generate a mock authorization URL that redirects back to our test callback
            var mockAuthUrl = $"http://localhost:3000/auth/callback/{provider}?code=test-auth-code-123&state={request.State}";
            
            return Ok(new { authorizationUrl = mockAuthUrl });
        }

        /// <summary>
        /// Mock OAuth callback endpoint for testing
        /// </summary>
        [HttpGet("callback/{provider}")]
        public IActionResult MockCallback(string provider, string code, string state)
        {
            // Return a mock successful authentication response
            var mockResponse = new OAuthCallbackResponseDto
            {
                Success = true,
                Token = "mock-jwt-token-for-testing",
                User = new UserDto
                {
                    Id = Guid.Parse("550e8400-e29b-41d4-a716-446655440000"),
                    Username = "TestUser",
                    Email = "test@example.com"
                },
                RedirectUrl = "/dashboard"
            };

            return Ok(mockResponse);
        }

        /// <summary>
        /// Create a test user for testing scenarios
        /// </summary>
        [HttpPost("create-test-user")]
        public IActionResult CreateTestUser([FromBody] CreateTestUserDto request)
        {
            var mockUser = new UserDto
            {
                Id = Guid.NewGuid(),
                Username = request.Username ?? "TestUser",
                Email = request.Email ?? "test@example.com"
            };

            var token = "mock-jwt-token-" + mockUser.Id.ToString()[..8];

            return Ok(new { user = mockUser, token });
        }

        /// <summary>
        /// Mock user info endpoint for testing
        /// </summary>
        [HttpGet("userinfo")]
        public IActionResult MockUserInfo()
        {
            return Ok(new
            {
                id = "test-external-123",
                email = "test@example.com",
                name = "Test User",
                provider = "test"
            });
        }

        /// <summary>
        /// Reset test state endpoint
        /// </summary>
        [HttpPost("reset")]
        public IActionResult ResetTestState()
        {
            // This endpoint can be used to reset any test state
            // Useful for cleaning up between test runs
            return Ok(new { message = "Test state reset successfully" });
        }
    }

    /// <summary>
    /// DTO for creating test users
    /// </summary>
    public class CreateTestUserDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Provider { get; set; }
        public string? ExternalId { get; set; }
        public bool IsAnonymous { get; set; } = true;
    }
}