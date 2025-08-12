namespace UrbanAI.Application.DTOs
{
    public class CreateIssueResponseDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? PhotoUrl { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DateTime CreatedAt { get; set; }
        public required string Message { get; set; }
    }
}
