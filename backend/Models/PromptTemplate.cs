using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class PromptTemplate
{
    public int Id { get; private set; }
    [Required]
    public int ProjectId { get; private set; }
    [Required]
    public int PromptTemplateVersionCurrentId { get; private set; }
    [Required]
    [MaxLength(200)]
    public string Name { get; private set; }
    public string? Description { get; private set; }
    [Required]
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public int? UpdatedByUserId { get; private set; }
    [Required]
    public bool IsActive { get; private set; } = true;
    
    
    public virtual Project Project { get; private set; }
    public virtual PromptTemplateVersion PromptTemplateVersionCurrent { get; private set; }
    public virtual User? UpdatedByUser { get; private set; }

    public List<PromptTemplateVersion> Versions { get; private set; } = new();

    private PromptTemplate() { }
    public PromptTemplate(int projectId, string name, string content, int userId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Nome não pode estar vazio");

        ProjectId = projectId;
        Name = name;
        CreatedAt = DateTime.UtcNow;

        var firstVersion = PromptTemplateVersion.CreateFirstVersion(
            0, // será ajustado pelo EF após persistência
            content,
            userId
        );

        Versions.Add(firstVersion);
        PromptTemplateVersionCurrent = firstVersion;
    }
    public void AddVersion(string content, int userId)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ArgumentException("Conteúdo não pode ser vazio");

        var nextVersion = Versions.Count == 0
            ? 1
            : Versions.Max(v => v.VersionNumber) + 1;

        var version = PromptTemplateVersion.CreateNewVersion(
            Id,
            nextVersion,
            content,
            userId
        );

        Versions.Add(version);

        PromptTemplateVersionCurrent = version;
        PromptTemplateVersionCurrentId = version.Id;

        UpdatedAt = DateTime.UtcNow;
        UpdatedByUserId = userId;
    }
    public void Activate() => IsActive = true;
    public void Deactivate() => IsActive = false;
}
}
