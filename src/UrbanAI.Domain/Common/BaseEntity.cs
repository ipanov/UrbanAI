using System;

namespace UrbanAI.Domain.Common
{
    public abstract class BaseEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // TODO: Add other common properties like LastModifiedAt, CreatedBy, LastModifiedBy if needed
    }
}
