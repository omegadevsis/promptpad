namespace PromptPad.API.DTOs.Users;

public class UserDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public int RoleId { get; set; }
    public string RoleName { get; set; }
    public bool IsActive { get; set; }
}