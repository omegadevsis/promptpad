using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PromptPad.API.Data;
using PromptPad.API.DTOs;
using PromptPad.API.Models;

namespace PromptPad.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly PromptPadContext _context;

        public UsersController(PromptPadContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserAdminDto>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Select(u => new UserAdminDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    RoleId = u.RoleId,
                    RoleName = u.Role != null ? u.Role.Name : null
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Usuário não encontrado");

            // If RoleId is provided, check if role exists
            if (dto.RoleId.HasValue)
            {
                var roleExists = await _context.Roles.AnyAsync(r => r.Id == dto.RoleId.Value);
                if (!roleExists)
                    return BadRequest("Perfil especificado não existe");
            }

            user.RoleId = dto.RoleId;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
