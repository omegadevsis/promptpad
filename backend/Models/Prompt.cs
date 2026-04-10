using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class Prompt
    {
        public int Id { get; private set; }
        [Required]
        public int ProjectId { get; private set; }
        [Required]
        public int PromptVersionCurrentId { get; private set; }
        public int? PromptTemplateVersionId { get; private set; }
        [Required]
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public virtual Project Project { get; private set; }
        public virtual PromptVersion PromptVersionCurrent { get; private set; }
        public virtual PromptTemplateVersion? PromptTemplateVersion { get; private set; }

        public List<PromptVersion> PromptVersions { get; private set; } = new();

        private Prompt() { }

        public static Prompt Create(
            int projectId,
            string content,
            int userId)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Conteúdo não pode estar vazio");

            var prompt = new Prompt
            {
                ProjectId = projectId,
                CreatedAt = DateTime.UtcNow
            };

            var firstVersion = PromptVersion.CreateFirstVersion(
                0, // EF resolve depois
                content,
                userId,
                "Versão Inicial"
            );

            prompt.PromptVersions.Add(firstVersion);
            prompt.PromptVersionCurrent = firstVersion;

            return prompt;
        }

        public static Prompt CreateWithTemplate(
            int projectId,
            int promptTemplateVersionId,
            string content,
            int userId)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Conteúdo não pode estar vazio");

            var prompt = new Prompt
            {
                ProjectId = projectId,
                CreatedAt = DateTime.UtcNow,
                PromptTemplateVersionId = promptTemplateVersionId
            };

            var firstVersion = PromptVersion.CreateFirstVersion(
                0, // EF resolve depois
                content,
                userId,
                "Versão Inicial com Template"
            );

            prompt.PromptVersions.Add(firstVersion);
            prompt.PromptVersionCurrent = firstVersion;

            return prompt;
        }

        public void AddVersion(
            string content,
            int userId,
            string? changeSummary = null)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Conteúdo não pode estar vazio");

            var nextVersion = PromptVersions.Count == 0
                ? 1
                : PromptVersions.Max(v => v.VersionNumber) + 1;

            var version = PromptVersion.CreateNewVersion(
                Id,
                nextVersion,
                content,
                userId,
                changeSummary
            );

            PromptVersions.Add(version);

            PromptVersionCurrent = version;
            PromptVersionCurrentId = version.Id;

            UpdatedAt = DateTime.UtcNow;
        }
    }
}