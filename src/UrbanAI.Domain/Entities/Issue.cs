using System;

namespace UrbanAI.Domain.Entities
{
    public class Issue
    {
        public Guid Id { get; set; }
        public required string Description { get; set; }
        public required string PhotoUrl { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public required string Title { get; set; }
        public required string Status { get; set; } // e.g., Open, In Progress, Closed
        public DateTime CreatedAt { get; set; }
        // TODO: Add other relevant properties like Category, etc.
    }
}
