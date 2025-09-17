using UrbanAI.Domain.Common;

namespace UrbanAI.Domain.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; } = string.Empty; // Anonymous identifier like "google_12345"
        public string Role { get; set; } = "User"; // Default role
        public UserType UserType { get; set; } = UserType.Citizen; // Default user type
        public bool RegistrationCompleted { get; set; } = false; // Track if registration is complete
        public string? OnboardingStep { get; set; } // Current onboarding step

        // Navigation property for external logins (OAuth providers)
        public ICollection<ExternalLogin> ExternalLogins { get; set; } = new List<ExternalLogin>();
        public ICollection<UserTermsOfService> TermsOfServiceAcceptances { get; set; } = new List<UserTermsOfService>();

        // Id and CreatedAt are inherited from BaseEntity
        // PRIVACY NOTE: Email and PasswordHash removed for OAuth-only, zero-PII architecture
        // Personal data (name, email, avatar) stays client-side via OAuth claims
    }
}
