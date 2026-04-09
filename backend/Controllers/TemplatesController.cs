using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PromptPad.API.Data;
using PromptPad.API.Models;
using PromptPad.API.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PromptPad.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplatesController : ControllerBase
    {
        private readonly PromptPadContext _context;

        public TemplatesController(PromptPadContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TemplateDto>>> GetTemplates()
        {
            return await _context.Templates
                .Select(t => new TemplateDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    UpdatedAt = t.UpdatedAt,
                    Content = t.ActivePrompt != null ? t.ActivePrompt.Content : string.Empty
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateDto>> GetTemplate(int id)
        {
            var template = await _context.Templates
                .Include(t => t.ActivePrompt)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (template == null)
            {
                return NotFound();
            }

            return new TemplateDto
            {
                Id = template.Id,
                Name = template.Name,
                Description = template.Description,
                UpdatedAt = template.UpdatedAt,
                Content = template.ActivePrompt?.Content ?? string.Empty
            };
        }

        [HttpPost]
        public async Task<ActionResult<TemplateDto>> CreateTemplate(CreateTemplateDto dto)
        {
            // Simple mock user for MVP (Igor Id=1)
            var template = new Template
            {
                Name = dto.Name,
                Description = dto.Description,
                OwnerId = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Templates.Add(template);
            await _context.SaveChangesAsync();

            // Create initial prompt for the template
            var prompt = new Prompt
            {
                TemplateId = template.Id,
                Content = dto.Content ?? string.Empty,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Prompts.Add(prompt);
            await _context.SaveChangesAsync();
            
            // Create first version
            var version = new PromptVersion
            {
                PromptId = prompt.Id,
                Content = prompt.Content,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = 1,
                ChangeSummary = "Versão Inicial"
            };
            
            _context.PromptVersions.Add(version);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTemplate), new { id = template.Id }, new TemplateDto
            {
                Id = template.Id,
                Name = template.Name,
                Description = template.Description,
                UpdatedAt = template.UpdatedAt,
                Content = prompt.Content
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTemplate(int id, CreateTemplateDto dto)
        {
            var template = await _context.Templates
                .Include(t => t.ActivePrompt)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (template == null) return NotFound();

            template.Name = dto.Name;
            template.Description = dto.Description;
            template.UpdatedAt = DateTime.UtcNow;

            if (template.ActivePrompt != null && dto.Content != null && template.ActivePrompt.Content != dto.Content)
            {
                // Logic for versioning on update (Auto-save/Manual)
                // For now, let's keep it simple: update active, caller decides if versioning is needed via separate endpoint or flag
                template.ActivePrompt.Content = dto.Content;
                template.ActivePrompt.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTemplate(int id)
        {
            var template = await _context.Templates.FindAsync(id);
            if (template == null) return NotFound();

            _context.Templates.Remove(template);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
