using Microsoft.EntityFrameworkCore;
using PromptPad.API.Models;

namespace PromptPad.API.Data
{
    public class PromptPadContext : DbContext
    {
        public PromptPadContext(DbContextOptions<PromptPadContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Template> Templates { get; set; } = null!;
        public DbSet<Prompt> Prompts { get; set; } = null!;
        public DbSet<PromptVersion> PromptVersions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships
            modelBuilder.Entity<Template>()
                .HasOne(t => t.Owner)
                .WithMany(u => u.OwnedTemplates)
                .HasForeignKey(t => t.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Prompt>()
                .HasOne(p => p.Template)
                .WithOne(t => t.ActivePrompt)
                .HasForeignKey<Prompt>(p => p.TemplateId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PromptVersion>()
                .HasOne(pv => pv.Prompt)
                .WithMany(p => p.VersionHistory)
                .HasForeignKey(pv => pv.PromptId)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<PromptVersion>()
                .HasOne(pv => pv.CreatedBy)
                .WithMany()
                .HasForeignKey(pv => pv.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed initial user for demo
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Name = "Igor", Email = "igor@exemplo.com" }
            );
        }
    }
}
