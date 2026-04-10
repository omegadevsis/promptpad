using Microsoft.EntityFrameworkCore;
using PromptPad.API.Models;

namespace PromptPad.API.Data
{
    public class PromptPadContext : DbContext
    {
        public PromptPadContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Claim> Claims { get; set; } = null!;
        public DbSet<RoleClaim> RoleClaims { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<UserProject> UserProjects { get; set; } = null!;
        public DbSet<Prompt> Prompts { get; set; } = null!;
        public DbSet<PromptVersion> PromptVersions { get; set; } = null!;
        public DbSet<PromptTemplate> PromptTemplates { get; set; } = null!;
        public DbSet<PromptTemplateVersion> PromptTemplateVersions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoleClaim>()
                .HasOne(rc => rc.Role)
                .WithMany(r => r.RoleClaims)
                .HasForeignKey(rc => rc.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RoleClaim>()
                .HasOne(rc => rc.Claim)
                .WithMany(c => c.RoleClaims)
                .HasForeignKey(rc => rc.ClaimId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.CreatedByUser)
                .WithMany()
                .HasForeignKey(p => p.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserProject>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserProjects)
                .HasForeignKey(up => up.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserProject>()
                .HasOne(up => up.Project)
                .WithMany(p => p.UserProjects)
                .HasForeignKey(up => up.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Prompt>()
                .HasOne(p => p.Project)
                .WithMany(project => project.Prompts)
                .HasForeignKey(p => p.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Prompt>()
                .HasOne(p => p.PromptVersionCurrent)
                .WithMany()
                .HasForeignKey(p => p.PromptVersionCurrentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Prompt>()
                .HasOne(p => p.PromptTemplateVersion)
                .WithMany()
                .HasForeignKey(p => p.PromptTemplateVersionId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<PromptVersion>()
                .HasOne(pv => pv.Prompt)
                .WithMany(p => p.PromptVersions)
                .HasForeignKey(pv => pv.PromptId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PromptVersion>()
                .HasOne(pv => pv.CreatedBy)
                .WithMany()
                .HasForeignKey(pv => pv.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PromptTemplate>()
                .HasOne(pt => pt.Project)
                .WithMany()
                .HasForeignKey(pt => pt.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PromptTemplate>()
                .HasOne(pt => pt.PromptTemplateVersionCurrent)
                .WithMany()
                .HasForeignKey(pt => pt.PromptTemplateVersionCurrentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PromptTemplate>()
                .HasOne(pt => pt.UpdatedByUser)
                .WithMany()
                .HasForeignKey(pt => pt.UpdatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<PromptTemplateVersion>()
                .HasOne(ptv => ptv.PromptTemplate)
                .WithMany(pt => pt.Versions)
                .HasForeignKey(ptv => ptv.PromptTemplateId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PromptTemplateVersion>()
                .HasOne(ptv => ptv.CreatedByUser)
                .WithMany()
                .HasForeignKey(ptv => ptv.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Role>().HasData(
                new
                {
                    Id = 1,
                    Name = "Master",
                    Description = "Usuário com permissão total aos registros e parâmetros do sistema"
                },
                new
                {
                    Id = 2,
                    Name = "Administrador",
                    Description = "Usuário com permissão total aos registros do sistema"
                },
                new
                {
                    Id = 3,
                    Name = "Desenvolvedor",
                    Description = "Usuário com permissão de criação de edição de registros"
                }
            );

            //TODO: CRIAR AS CLAIMS PERTINENTES A MANIPULAÇÃO DE CADA UM DOS MODELS
            //INCLUIR UMA CLAIM DE USUÁRIOLOGADO E UMA CLAIM DE USUÁRIOMASTER
            
            modelBuilder.Entity<Claim>().HasData(
                new { Id = 1, Key = "template:create", Name = "Criar Template" },
                new { Id = 2, Key = "template:edit", Name = "Editar Template" },
                new { Id = 3, Key = "template:delete", Name = "Excluir Template" },
                new { Id = 4, Key = "user:admin", Name = "Gerenciar Usuários/Perfis" }
            );

            modelBuilder.Entity<RoleClaim>().HasData(
                new { Id = 1, RoleId = 1, ClaimId = 1 },
                new { Id = 2, RoleId = 1, ClaimId = 2 },
                new { Id = 3, RoleId = 1, ClaimId = 3 },
                new { Id = 4, RoleId = 1, ClaimId = 4 },
                new { Id = 5, RoleId = 2, ClaimId = 1 },
                new { Id = 6, RoleId = 2, ClaimId = 2 },
                new { Id = 7, RoleId = 2, ClaimId = 3 }
            );

            modelBuilder.Entity<User>().HasData(
                new
                {
                    Id = 1,
                    Name = "Igor",
                    Email = "igor@exemplo.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    RoleId = 1,
                    IsActive = true
                }
            );

            modelBuilder.Entity<Project>().HasData(
                new
                {
                    Id = 1,
                    Name = "Projeto Padrão",
                    Description = "Projeto inicial criado automaticamente",
                    CreatedAt = DateTime.UtcNow,
                    CreatedByUserId = 1,
                    IsActive = true
                }
            );

            modelBuilder.Entity<UserProject>().HasData(
                new
                {
                    Id = 1,
                    UserId = 1,
                    ProjectId = 1
                }
            );
        }
    }
}
