using UrbanAI.Domain.Common;

namespace UrbanAI.Application.DTOs
{
    /// <summary>
    /// DTO for user registration with OAuth provider and user type selection.
    /// </summary>
    public class UserRegistrationDto
    {
        /// <summary>
        /// OAuth provider name (google, microsoft, facebook).
        /// </summary>
        public string Provider { get; set; } = string.Empty;

        /// <summary>
        /// External user ID from OAuth provider.
        /// </summary>
        public string ExternalId { get; set; } = string.Empty;

        /// <summary>
        /// User type selected during registration.
        /// </summary>
        public UserType UserType { get; set; } = UserType.Citizen;

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
        /// Terms of Service version being accepted.
        /// </summary>
        public string TermsOfServiceVersion { get; set; } = "1.0";

        /// <summary>
        /// IP address of the client accepting terms.
        /// </summary>
        public string? ClientIpAddress { get; set; }

        /// <summary>
        /// User agent of the client accepting terms.
        /// </summary>
        public string? ClientUserAgent { get; set; }
    }
}