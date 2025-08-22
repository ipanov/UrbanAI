using Microsoft.EntityFrameworkCore;
using UrbanAI.Domain.Entities;
using Npgsql.EntityFrameworkCore.PostgreSQL;

namespace UrbanAI.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<Issue> Issues { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Regulation> Regulations { get; set; }
        public DbSet<ExternalLogin> ExternalLogins { get; set; }
        public DbSet<RegulationDocument> RegulationDocuments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);            // Configure the User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired();
                entity.Property(e => e.Role).IsRequired();

                // Configure PostgreSQL-specific types
                if (Database.IsNpgsql())
                {
                    entity.Property(e => e.Id).HasColumnType("uuid"); // Explicitly map Guid to uuid for PostgreSQL
                }

                // Configure the relationship with ExternalLogins
                entity.HasMany(u => u.ExternalLogins)
                      .WithOne(el => el.User)
                      .HasForeignKey(el => el.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure the ExternalLogin entity
            modelBuilder.Entity<ExternalLogin>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Provider).IsRequired();
                entity.Property(e => e.ExternalId).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                
                // Configure PostgreSQL-specific types
                if (Database.IsNpgsql())
                {
                    entity.Property(e => e.Id).HasColumnType("uuid");
                }
            });

            // Configure the Regulation entity (keeping for backward compatibility)
            modelBuilder.Entity<Regulation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.SourceUrl).IsRequired();
                entity.Property(e => e.EffectiveDate).IsRequired();
                
                // Configure PostgreSQL-specific types
                if (Database.IsNpgsql())
                {
                    entity.Property(e => e.Id).HasColumnType("uuid"); // Explicitly map Guid to uuid for PostgreSQL
                }
            });

            // Configure the new unified RegulationDocument entity with JSONB support
            modelBuilder.Entity<RegulationDocument>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                
                // PostgreSQL-specific configurations
                if (Database.IsNpgsql())
                {
                    entity.Property(e => e.Id).HasColumnType("uuid");
                    entity.Property(e => e.Content).HasColumnType("text");
                    entity.Property(e => e.Metadata).HasColumnType("jsonb");
                    entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone");
                    entity.Property(e => e.UpdatedAt).HasColumnType("timestamp with time zone");
                    entity.Property(e => e.Tags).HasColumnType("text[]");
                    entity.Property(e => e.Embedding).HasColumnType("vector(1536)"); // For pgvector extension
                }
                else
                {
                    // InMemory database - use simple types
                    entity.Ignore(e => e.Embedding); // Vector not supported in InMemory
                    entity.Ignore(e => e.Tags); // Array not supported in InMemory
                    entity.Ignore(e => e.Metadata); // JSONB not supported in InMemory
                }
            });

            // Configure the Issue entity using the separate configuration class
            modelBuilder.ApplyConfiguration(new Configurations.IssueConfiguration());
            // Ensure Issue Id is also mapped to uuid if not already handled in IssueConfiguration
            modelBuilder.Entity<Issue>(entity =>
            {
                // Configure PostgreSQL-specific types
                if (Database.IsNpgsql())
                {
                    entity.Property(e => e.Id).HasColumnType("uuid");
                }
            });
        }
    }
}
