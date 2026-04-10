using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class Project
    {
        public int Id { get; private set; }
        [Required] [MaxLength(100)] public string Name { get; private set; }
        public string? Description { get; private set; }
        [Required] public DateTime CreatedAt { get; private set; }
        [Required] public int CreatedByUserId { get; private set; }
        public bool IsActive { get; private set; }

        public virtual User CreatedByUser { get; private set; }
        public virtual List<UserProject> UserProjects { get; private set; } = new();
        public virtual List<Prompt> Prompts { get; private set; } = new();

        private Project()
        {
        }

        public static Project Create(
            string name,
            string? description,
            int createdByUserId)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Nome não pode estar vazio");

            return new Project
            {
                Name = name,
                Description = description,
                CreatedByUserId = createdByUserId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
        }

        public static Project CreateSeed(
            int id,
            string name,
            string? description,
            int createdByUserId,
            DateTime? createdAt = null,
            bool isActive = true)
        {
            var project = Create(name, description, createdByUserId);
            project.Id = id;
            project.CreatedAt = createdAt ?? DateTime.UtcNow;
            project.IsActive = isActive;

            return project;
        }

        public void UpdateName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Nome não pode estar vazio");

            Name = name;
        }
        public void UpdateDescription(string? description)
        {
            Description = description;
        }
        public void UpdateIsActive(bool isActive)
        {
            IsActive = isActive;
        }
        public void UpdateUsers(IEnumerable<int> userIds)
        {
            var newUsers = userIds.ToHashSet();

            UserProjects.RemoveAll(rp => !newUsers.Contains(rp.UserId));

            var existingUsersIds = UserProjects
                .Select(rp => rp.UserId)
                .ToHashSet();

            var usersToAdd = newUsers.Except(existingUsersIds);

            foreach (var userId in usersToAdd)
            {
                UserProjects.Add(UserProject.Create(userId, Id));
            }
        }
    }
}