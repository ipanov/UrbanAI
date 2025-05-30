using System;
using UrbanAI.Domain.Common;

namespace UrbanAI.Domain.Entities
{
    public class Regulation : BaseEntity
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime EffectiveDate { get; set; }
        public string Location { get; set; } // Assuming location is a string for now
        public List<string> Keywords { get; set; }
        public string SourceUrl { get; set; }
        public string Jurisdiction { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
