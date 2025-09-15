using UrbanAI.Domain.Common;

namespace UrbanAI.Application.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public UserType UserType { get; set; } = UserType.Citizen;
    }
}
