using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models;

public class PromptTemplateVersion
{
    public int Id { get; private set; }
    [Required]
    public int PromptTemplateId { get; private set; }
    [Required]
    public int VersionNumber { get; private set; }
    [Required]
    public string Content { get; private set; }
    [MaxLength(100)]
    public string? ChangeSummary { get; private set; }
    [Required]
    public DateTime CreatedAt { get; private set; }
    [Required]
    public int CreatedByUserId { get; private set; }
    
    public virtual User CreatedByUser { get; private set; }
    public virtual PromptTemplate PromptTemplate { get; private set; }
    
    private PromptTemplateVersion() {}

    internal static PromptTemplateVersion CreateFirstVersion(int promptTemplateId,
                                                           string content, 
                                                           int userId)
    {
        return new PromptTemplateVersion()
        {
            PromptTemplateId = promptTemplateId,
            VersionNumber = 1,
            Content = content,
            CreatedAt = DateTime.UtcNow,
            CreatedByUserId = userId
        };
    }
    
    internal static PromptTemplateVersion CreateNewVersion(int promptTemplateId,
                                                         int versionNumber,
                                                         string content,
                                                         int userId)
    {
        return new PromptTemplateVersion()
        {
            PromptTemplateId = promptTemplateId,
            VersionNumber = versionNumber,
            Content = content,
            CreatedAt = DateTime.UtcNow,
            CreatedByUserId = userId
        };
    }
}