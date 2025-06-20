using System;

namespace UrbanAI.Application.DTOs
{
    public class UpdateIssueRequestDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string PhotoUrl { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public required string Status { get; set; }
        public string? Priority { get; set; }
    }
}
