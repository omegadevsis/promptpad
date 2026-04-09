using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PromptPad.API.Data;
using PromptPad.API.Models;
using PromptPad.API.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PromptPad.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly PromptPadContext _context;
        private readonly IConfiguration _config;

        public AuthController(PromptPadContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest("Email já cadastrado.");
            }

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = 2 // Default to 'Editor'
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(await GenerateAuthResponse(user));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized("Credenciais inválidas.");
            }

            return Ok(await GenerateAuthResponse(user));
        }

        private async Task<AuthResponseDto> GenerateAuthResponse(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "MinhaChaveSuperSecreta@2026!PromptPad");
            
            var role = user.Role?.Name ?? "User";

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _config["Jwt:Issuer"] ?? "PromptPad.API",
                Audience = _config["Jwt:Issuer"] ?? "PromptPad.API",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new AuthResponseDto
            {
                Token = tokenHandler.WriteToken(token),
                Name = user.Name,
                UserId = user.Id,
                Role = role
            };
        }
    }
}
