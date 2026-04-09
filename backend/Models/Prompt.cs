using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class Prompt
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationship to Template
        public int TemplateId { get; set; }
        public Template? Template { get; set; }

        // History of versions
        public ICollection<PromptVersion> VersionHistory { get; set; } = new List<PromptVersion>();
    }
}
