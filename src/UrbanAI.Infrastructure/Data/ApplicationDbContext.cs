using Microsoft.EntityFrameworkCore;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Issue> Issues { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the Issue entity
            modelBuilder.Entity<Issue>(builder =>
            {
                builder.HasKey(i => i.Id);
                builder.Property(i => i.Title).IsRequired();
                // Other configurations can be added here later
            });

            // Configure the IssueStatus enum to be stored as a string
            modelBuilder.Entity<Issue>()
                .Property(i => i.Status)
                .HasConversion<string>();
        }
    }
}
