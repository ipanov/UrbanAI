using UrbanAI.Domain.Common;

namespace UrbanAI.Domain.Entities
{
    /// <summary>
    /// Represents a user's acceptance of the Terms of Service.
    /// Tracks legal agreement acceptance for compliance and audit purposes.
    /// </summary>
    public class UserTermsOfService : BaseEntity
    {
        /// <summary>
        /// The user who accepted the terms.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Version of the Terms of Service that was accepted.
        /// </summary>
        public string Version { get; set; } = string.Empty;

        /// <summary>
        /// When the terms were accepted.
        /// </summary>
        public DateTime AcceptedAt { get; set; }

        /// <summary>
        /// IP address from which the terms were accepted.
        /// Optional for privacy but recommended for audit purposes.
        /// </summary>
        public string? IpAddress { get; set; }

        /// <summary>
        /// User agent string of the browser/client used to accept terms.
        /// Optional for privacy but helps with debugging and audit.
        /// </summary>
        public string? UserAgent { get; set; }

        /// <summary>
        /// Navigation property to the user who accepted these terms.
        /// </summary>
        public User User { get; set; } = null!;

        // Id and CreatedAt are inherited from BaseEntity
    }
}