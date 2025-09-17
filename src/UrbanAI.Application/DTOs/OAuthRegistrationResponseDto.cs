namespace UrbanAI.Application.DTOs
{
    /// <summary>
    /// DTO for OAuth callback response when registration is required.
    /// </summary>
    public class OAuthRegistrationResponseDto
    {
        /// <summary>
        /// Indicates that registration is required.
        /// </summary>
        public bool RequiresRegistration { get; set; }

        /// <summary>
        /// OAuth provider name.
        /// </summary>
        public string Provider { get; set; } = string.Empty;

        /// <summary>
        /// External user ID from OAuth provider.
        /// </summary>
        public string ExternalId { get; set; } = string.Empty;

        /// <summary>
        /// User's display name from OAuth provider.
        /// </summary>
        public string? DisplayName { get; set; }

        /// <summary>
        /// User's email from OAuth provider.
        /// </summary>
        public string? Email { get; set; }

        /// <summary>
        /// User's profile picture URL from OAuth provider.
        /// </summary>
        public string? Picture { get; set; }

        /// <summary>
        /// JWT token if user already exists.
        /// </summary>
        public string? Token { get; set; }

        /// <summary>
        /// Current terms of service version that must be accepted.
        /// </summary>
        public string TermsOfServiceVersion { get; set; } = "1.0";

        /// <summary>
        /// Terms of service URL for user to review.
        /// </summary>
        public string TermsOfServiceUrl { get; set; } = "/terms-of-service";
    }
}