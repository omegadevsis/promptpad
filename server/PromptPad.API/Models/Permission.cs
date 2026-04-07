using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class Permission
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Key { get; set; } = string.Empty; // Ex: template:create, user:admin

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // Ex: Criar Template

        // Navigation properties
        public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
    }
}
