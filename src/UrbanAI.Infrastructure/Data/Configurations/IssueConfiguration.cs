using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Infrastructure.Data.Configurations
{
    public class IssueConfiguration : IEntityTypeConfiguration<Issue>
    {
        public void Configure(EntityTypeBuilder<Issue> builder)
        {
            builder.HasKey(i => i.Id);

            builder.Property(i => i.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(i => i.Description)
                .IsRequired();

            builder.Property(i => i.PhotoUrl)
                .IsRequired();

            builder.Property(i => i.Latitude)
                .IsRequired();

            builder.Property(i => i.Longitude)
                .IsRequired();

            builder.Property(i => i.Status)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(i => i.CreatedAt)
                .IsRequired();

            // TODO: Add configuration for other properties like Category when added to the entity
        }
    }
}
