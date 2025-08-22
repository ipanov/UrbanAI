namespace UrbanAI.Application.DTOs
{
    public class OAuthCallbackResponseDto
    {
        public bool Success { get; set; }
        public string? Token { get; set; }
        public UserDto? User { get; set; }
        public string? RedirectUrl { get; set; }
    }
}