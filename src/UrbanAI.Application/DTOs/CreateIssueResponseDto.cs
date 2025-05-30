namespace UrbanAI.Application.DTOs
{
    public class CreateIssueResponseDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public string PhotoUrl { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Message { get; set; }
    }
}
