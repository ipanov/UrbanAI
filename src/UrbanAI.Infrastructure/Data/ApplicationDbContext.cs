using Microsoft.EntityFrameworkCore;
using UrbanAI.Domain.Entities;

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);            // Configure the User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnType("uuid"); // Explicitly map Guid to uuid for PostgreSQL
                entity.Property(e => e.Username).IsRequired();
                entity.Property(e => e.Role).IsRequired();

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
                entity.Property(e => e.Id).HasColumnType("uuid");
                entity.Property(e => e.Provider).IsRequired();
                entity.Property(e => e.ExternalId).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            // Configure the Regulation entity
            modelBuilder.Entity<Regulation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnType("uuid"); // Explicitly map Guid to uuid for PostgreSQL
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.SourceUrl).IsRequired();
                entity.Property(e => e.EffectiveDate).IsRequired();
            });            // Configure the Issue entity using the separate configuration class
            modelBuilder.ApplyConfiguration(new Configurations.IssueConfiguration());
            // Ensure Issue Id is also mapped to uuid if not already handled in IssueConfiguration
            modelBuilder.Entity<Issue>(entity =>
            {
                entity.Property(e => e.Id).HasColumnType("uuid");
            });
        }
    }
}
