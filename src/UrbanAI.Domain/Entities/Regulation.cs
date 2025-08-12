using UrbanAI.Domain.Common;

namespace UrbanAI.Domain.Entities
{
    public class Regulation : BaseEntity
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public DateTime EffectiveDate { get; set; }
        public required string Location { get; set; } // Assuming location is a string for now
        public required List<string> Keywords { get; set; }
        public required string SourceUrl { get; set; }
        public required string Jurisdiction { get; set; }
        public new DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
