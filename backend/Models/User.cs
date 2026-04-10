using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class User
    {
        public int Id { get; private set; }
        [Required]
        public int RoleId { get; private set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; private set; }
        [Required]
        [EmailAddress]
        public string Email { get; private set; }
        [Required]
        public string PasswordHash { get; private set; }
        [Required]
        public bool IsActive { get; private set; }
        
        // Navegação
        public virtual Role Role { get; private set; }
        public virtual List<UserProject> UserProjects { get; private set; }

        private User() { }

        public static User Create(string name,
                                  string email,
                                  string passwordHash,
                                  int roleId)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Nome não pode estar vazio");

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email não pode estar vazio");

            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new ArgumentException("Hash da senha não pode estar vazio");

            return new User
            {
                Name = name,
                Email = email,
                PasswordHash = passwordHash,
                RoleId = roleId,
                IsActive = true
            };
        }

        public static User CreateSeed(
            int id,
            string name,
            string email,
            string passwordHash,
            int roleId,
            bool isActive = true)
        {
            var user = Create(name, email, passwordHash, roleId);
            user.Id = id;

            return user;
        }

        public void UpdateRole(int roleId)
        {
            RoleId = roleId;
        }
        public void UpdateName(string name)
        {
            Name = name;
        }
        public void UpdateEmail(string email)
        {
            Email = email;
        }
        public void UpdatePasswordHash(string passwordHash)
        {
            PasswordHash = passwordHash;
        }
        public void UpdateProjects(IEnumerable<int> projectsIds)
        {
            var newProjects = projectsIds.ToHashSet();

            UserProjects.RemoveAll(rp => !newProjects.Contains(rp.ProjectId));

            var existingProjectsIds = UserProjects
                .Select(rp => rp.ProjectId)
                .ToHashSet();

            var projectsToAdd = newProjects.Except(existingProjectsIds);

            foreach (var projectId in projectsToAdd)
            {
                UserProjects.Add(UserProject.Create(Id, projectId));
            }
        }
        public void UpdateIsActive(bool isActive)
        {
            IsActive = isActive;
        }
    }
}
