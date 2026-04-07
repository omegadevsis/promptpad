using System;
using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class PromptVersion
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(100)]
        public string? ChangeSummary { get; set; }

        // Relationship to Prompt
        public int PromptId { get; set; }
        public Prompt? Prompt { get; set; }

        // Author of this specific version
        public int CreatedByUserId { get; set; }
        public User? CreatedBy { get; set; }
    }
}
