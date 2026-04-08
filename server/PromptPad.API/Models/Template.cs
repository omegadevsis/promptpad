using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class Template
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationship to Owner
        public int OwnerId { get; set; }
        public User? Owner { get; set; }

        // Relationship to active Prompt
        public Prompt? ActivePrompt { get; set; }

        // Relationship to Project
        public int? ProjectId { get; set; }
        public virtual Project? Project { get; set; }
    }
}
