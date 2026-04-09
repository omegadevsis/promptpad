using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public int? RoleId { get; set; }
        public virtual Role? Role { get; set; }

        // Navigation properties
        public virtual ICollection<Template> OwnedTemplates { get; set; } = new List<Template>();
    }
}
