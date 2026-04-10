using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models;

public class RoleClaim
{
    public int Id { get; private set; }
    [Required]
    public int RoleId { get; private set; }
    [Required]
    public int ClaimId { get; private set; }

    public virtual Role Role { get; private set; }
    public virtual Claim Claim { get; private set; }

    private RoleClaim() { }

    public static RoleClaim Create(int roleId, int claimId)
    {
        return new RoleClaim()
        {
            RoleId = roleId,
            ClaimId = claimId
        };
    }
}