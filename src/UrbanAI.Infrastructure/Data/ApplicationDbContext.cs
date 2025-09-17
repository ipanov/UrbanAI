using Microsoft.EntityFrameworkCore;
using UrbanAI.Domain.Entities;
using UrbanAI.Domain.Common;

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
        public DbSet<UserTermsOfService> UserTermsOfServices { get; set; }
        public DbSet<TermsOfService> TermsOfServices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);            // Configure the User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired();
                entity.Property(e => e.Role).IsRequired();
                entity.Property(e => e.UserType).IsRequired()
                      .HasDefaultValue(UserType.Citizen)
                      .HasConversion<int>(); // Store as integer in database
                entity.Property(e => e.RegistrationCompleted).IsRequired()
                      .HasDefaultValue(false);
                entity.Property(e => e.OnboardingStep).HasMaxLength(50);

                // Configure SQL Server-specific types
                if (Database.IsSqlServer())
                {
                    entity.Property(e => e.Id).HasColumnType("uniqueidentifier");
                }

                // Configure the relationship with ExternalLogins
                entity.HasMany(u => u.ExternalLogins)
                      .WithOne(el => el.User)
                      .HasForeignKey(el => el.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Configure the relationship with UserTermsOfServices
                entity.HasMany(u => u.TermsOfServiceAcceptances)
                      .WithOne(tos => tos.User)
                      .HasForeignKey(tos => tos.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure the ExternalLogin entity
            modelBuilder.Entity<ExternalLogin>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Provider).IsRequired();
                entity.Property(e => e.ExternalId).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                
                // Configure SQL Server-specific types
                if (Database.IsSqlServer())
                {
                    entity.Property(e => e.Id).HasColumnType("uniqueidentifier");
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
                
                // Configure SQL Server-specific types
                if (Database.IsSqlServer())
                {
                    entity.Property(e => e.Id).HasColumnType("uniqueidentifier");
                }
            });

            // Configure the new unified RegulationDocument entity with JSONB support
            modelBuilder.Entity<RegulationDocument>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                
                // Database-specific configurations
                if (Database.IsSqlServer())
                {
                    entity.Property(e => e.Id).HasColumnType("uniqueidentifier");
                    entity.Property(e => e.Content).HasColumnType("nvarchar(max)");
                    entity.Property(e => e.CreatedAt).HasColumnType("datetime2");
                    entity.Property(e => e.UpdatedAt).HasColumnType("datetime2");
                    entity.Ignore(e => e.Tags); // Array not natively supported in SQL Server
                    entity.Ignore(e => e.Embedding); // Vector not supported in SQL Server
                    entity.Ignore(e => e.Metadata); // JsonDocument not supported in SQL Server without converter
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
            // Configure the UserTermsOfService entity
            modelBuilder.Entity<UserTermsOfService>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Version).IsRequired().HasMaxLength(50);
                entity.Property(e => e.AcceptedAt).IsRequired();
                entity.Property(e => e.IpAddress).HasMaxLength(45);
                entity.Property(e => e.UserAgent);

                // Configure SQL Server-specific types
                if (Database.IsSqlServer())
                {
                    entity.Property(e => e.Id).HasColumnType("uniqueidentifier");
                    entity.Property(e => e.AcceptedAt).HasColumnType("datetime2");
                }

                // Configure the relationship with User
                entity.HasOne(tos => tos.User)
                      .WithMany(u => u.TermsOfServiceAcceptances)
                      .HasForeignKey(tos => tos.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Ensure Issue Id is also mapped to uniqueidentifier if not already handled in IssueConfiguration
            modelBuilder.Entity<Issue>(entity =>
            {
                // Configure SQL Server-specific types
                if (Database.IsSqlServer())
                {
                    entity.Property(e => e.Id).HasColumnType("uniqueidentifier");
                }
            });

            // Configure the TermsOfService entity
            modelBuilder.Entity<TermsOfService>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Version).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.EffectiveDate).IsRequired();
                entity.Property(e => e.IsActive).IsRequired().HasDefaultValue(true);
                entity.Property(e => e.Url).HasMaxLength(500);

                // Configure SQL Server-specific types
                if (Database.IsSqlServer())
                {
                    entity.Property(e => e.Id).HasColumnType("uniqueidentifier");
                    entity.Property(e => e.Content).HasColumnType("nvarchar(max)");
                    entity.Property(e => e.EffectiveDate).HasColumnType("datetime2");
                }
            });
        }
    }
}
