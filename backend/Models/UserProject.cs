using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models;

public class UserProject
{
    public int Id { get; private set; }
    [Required]
    public int UserId { get; private set; }
    [Required]
    public int ProjectId { get; private set; }

    public virtual User User { get; private set; }
    public virtual Project Project { get; private set; }

    private UserProject() { }

    public static UserProject Create(int userId, int projectId)
    {
        return new UserProject()
        {
            UserId = userId,
            ProjectId = projectId
        };
    }
}
