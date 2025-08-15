namespace UrbanAI.Application.DTOs
{
    public class OAuthAuthorizationDto
    {
        public string AuthorizationUrl { get; set; } = string.Empty;
        public string CodeVerifier { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
    }
}
