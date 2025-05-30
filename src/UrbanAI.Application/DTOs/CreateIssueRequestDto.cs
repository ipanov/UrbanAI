namespace UrbanAI.Application.DTOs
{
    public class CreateIssueRequestDto
    {
        public required string Description { get; set; }
        public string PhotoUrl { get; set; } // Assuming photo is stored and a URL is provided
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public required string Title { get; set; }
    }
}
