using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relationship to Templates
        public virtual ICollection<Template> Templates { get; set; } = new List<Template>();

        // Relationship to Owner
        public int? CreatedByUserId { get; set; }
        public User? CreatedBy { get; set; }
    }
}
