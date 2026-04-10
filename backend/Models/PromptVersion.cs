using System;
using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class PromptVersion
    {
        public int Id { get; private set; }
        [Required]
        public int PromptId { get; private set; }
        [Required]
        public int VersionNumber { get; private set; }
        [Required]
        public string Content { get; private set; }
        [Required]
        public DateTime CreatedAt { get; private set; }
        [MaxLength(100)]
        public string? ChangeSummary { get; private set; }
        [Required]
        public int CreatedByUserId { get; private set; }
        
        public virtual Prompt Prompt { get; private set; }
        public virtual User CreatedBy { get; private set; }

        private PromptVersion() { }

        internal static PromptVersion CreateFirstVersion(int promptId,
                                                       string content,
                                                       int userId,
                                                       string? changeSummary = null)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Content cannot be empty");

            return new PromptVersion
            {
                PromptId = promptId,
                VersionNumber = 1,
                Content = content,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = userId,
                ChangeSummary = changeSummary
            };
        }

        internal static PromptVersion CreateNewVersion(int promptId,
                                                     int versionNumber,
                                                     string content,
                                                     int userId,
                                                     string? changeSummary = null)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Conteúdo não pode estar em branco");

            return new PromptVersion
            {
                PromptId = promptId,
                VersionNumber = versionNumber,
                Content = content,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = userId,
                ChangeSummary = changeSummary
            };
        }
    }
}
