namespace UrbanAI.Application.DTOs
{
    public class AuthRequestDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Provider { get; set; }
        public string? Token { get; set; }
    }
}
