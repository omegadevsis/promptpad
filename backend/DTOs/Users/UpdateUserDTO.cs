namespace PromptPad.API.DTOs.Users;

public class UpdateUserDTO
{
    public int Id { get; set; }
    public string? Name { get; set; } = null;
    public string? Email { get; set; } = null;
    public string? Password { get; set; } = null;
    public int? RoleId { get; set; } = null;
    public bool? IsActive { get; set; } = null;
}