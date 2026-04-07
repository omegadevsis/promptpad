using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PromptPad.API.Data;
using PromptPad.API.Models;
using PromptPad.API.DTOs;

namespace PromptPad.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Apenas administradores podem gerenciar perfis
    public class RolesController : ControllerBase
    {
        private readonly PromptPadContext _context;

        public RolesController(PromptPadContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            return await _context.Roles
                .Include(r => r.Permissions)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Role>> CreateRole(Role role)
        {
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRoles), new { id = role.Id }, role);
        }

        [HttpPost("{roleId}/permissions/{permissionId}")]
        public async Task<IActionResult> AssignPermission(int roleId, int permissionId)
        {
            var role = await _context.Roles
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync(r => r.Id == roleId);

            var permission = await _context.Permissions.FindAsync(permissionId);

            if (role == null || permission == null) return NotFound();

            if (!role.Permissions.Any(p => p.Id == permissionId))
            {
                role.Permissions.Add(permission);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        [HttpGet("permissions")]
        public async Task<ActionResult<IEnumerable<Permission>>> GetPermissions()
        {
            return await _context.Permissions.ToListAsync();
        }
    }
}
