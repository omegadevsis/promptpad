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
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Permission> Permissions { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Project -> Templates (One-to-Many)
            modelBuilder.Entity<Project>()
                .HasMany(p => p.Templates)
                .WithOne(t => t.Project)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.SetNull); // Keep templates even if project is deleted (or could be Cascade)

            modelBuilder.Entity<Project>()
                .HasOne(p => p.CreatedBy)
                .WithMany()
                .HasForeignKey(p => p.CreatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure Role <-> Permission (Many-to-Many)
            modelBuilder.Entity<Role>()
                .HasMany(r => r.Permissions)
                .WithMany(p => p.Roles)
                .UsingEntity(j => j.ToTable("RolePermissions"));

            // Configure Role -> User (One-to-Many)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.SetNull);

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

            // Seed initial Roles and Permissions
            var p1 = new Permission { Id = 1, Key = "template:create", Name = "Criar Template" };
            var p2 = new Permission { Id = 2, Key = "template:edit", Name = "Editar Template" };
            var p3 = new Permission { Id = 3, Key = "template:delete", Name = "Excluir Template" };
            var p4 = new Permission { Id = 4, Key = "user:admin", Name = "Gerenciar Usuários/Perfis" };
            
            modelBuilder.Entity<Permission>().HasData(p1, p2, p3, p4);

            var adminRole = new Role { Id = 1, Name = "Admin", Description = "Administrador do Sistema" };
            var editorRole = new Role { Id = 2, Name = "Editor", Description = "Usuário com permissão de edição" };
            
            modelBuilder.Entity<Role>().HasData(adminRole, editorRole);

            // Seed initial user for demo
            // PasswordHash for "password123" (using BCrypt for more realism in the seed, though manually hashed for this example)
            modelBuilder.Entity<User>().HasData(
                new User { 
                    Id = 1, 
                    Name = "Igor", 
                    Email = "igor@exemplo.com", 
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), 
                    RoleId = 1 
                }
            );

            modelBuilder.Entity<Project>().HasData(
                new Project { Id = 1, Name = "Projeto Padrão", Description = "Projeto inicial criado automaticamente", CreatedByUserId = 1 }
            );
        }
    }
}
