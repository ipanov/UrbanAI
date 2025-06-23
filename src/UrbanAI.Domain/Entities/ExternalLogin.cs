using System;

namespace UrbanAI.Domain.Entities
{
    public class ExternalLogin
    {
        public Guid Id { get; set; }
        public string Provider { get; set; } = null!;
        public string ExternalId { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
