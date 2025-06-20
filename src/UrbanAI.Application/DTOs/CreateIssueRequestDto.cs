namespace UrbanAI.Application.DTOs
{
    public class CreateIssueRequestDto
    {
        public required string Description { get; set; }
        public string? PhotoUrl { get; set; } // Optional
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public required string Title { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
    }
}
