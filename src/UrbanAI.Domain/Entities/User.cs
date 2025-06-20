using System;

using UrbanAI.Domain.Common;

namespace UrbanAI.Domain.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; // Default role

        // Id and CreatedAt are inherited from BaseEntity
        // Add other user properties as needed later
    }
}
