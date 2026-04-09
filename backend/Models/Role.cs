using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class Role
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Description { get; set; }

        // Navigation properties
        public virtual ICollection<Permission> Permissions { get; set; } = new List<Permission>();
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}
