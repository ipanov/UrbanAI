using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UrbanAI.Infrastructure.Data.Models
{
    public class RegulationDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Title { get; set; }
        public string Content { get; set; }
        public string SourceUrl { get; set; }
        public string Jurisdiction { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Location { get; set; }
        public List<string> Keywords { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
