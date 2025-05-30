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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the Regulation entity
            modelBuilder.Entity<Regulation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.SourceUrl).IsRequired();
                entity.Property(e => e.EffectiveDate).IsRequired();
                // TODO: Add configuration for other properties as they are added to the Regulation entity
            });

            // Configure the Issue entity using the separate configuration class
            modelBuilder.ApplyConfiguration(new Configurations.IssueConfiguration());

            // TODO: Add configuration for other entities
        }
    }
}
