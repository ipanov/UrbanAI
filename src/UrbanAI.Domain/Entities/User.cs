using System;
using System.Collections.Generic;

using UrbanAI.Domain.Common;

namespace UrbanAI.Domain.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; // Default role

        // Navigation property for external logins
        public ICollection<ExternalLogin> ExternalLogins { get; set; } = new List<ExternalLogin>();

        // Id and CreatedAt are inherited from BaseEntity
        // Add other user properties as needed later
    }
}
