namespace UrbanAI.Application.DTOs
{
    public class IssueDto
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public required string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public required string Status { get; set; }
        public string? PhotoUrl { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public Guid UserId { get; set; }
    }
}
