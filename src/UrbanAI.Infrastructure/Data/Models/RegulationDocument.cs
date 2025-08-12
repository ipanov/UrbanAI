using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UrbanAI.Infrastructure.Data.Models
{
    public class RegulationDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public required string Id { get; set; }

        public required string Title { get; set; }
        public required string Content { get; set; }
        public required string SourceUrl { get; set; }
        public required string Jurisdiction { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public required string Location { get; set; }
        public required List<string> Keywords { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
