using UrbanAI.Domain.Common;

namespace UrbanAI.Domain.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; } = string.Empty; // Anonymous identifier like "google_12345"
        public string Role { get; set; } = "User"; // Default role

        // Navigation property for external logins (OAuth providers)
        public ICollection<ExternalLogin> ExternalLogins { get; set; } = new List<ExternalLogin>();

        // Id and CreatedAt are inherited from BaseEntity
        // PRIVACY NOTE: Email and PasswordHash removed for OAuth-only, zero-PII architecture
        // Personal data (name, email, avatar) stays client-side via OAuth claims
    }
}
