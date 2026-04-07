using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PromptPad.API.Data;
using PromptPad.API.Models;
using PromptPad.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PromptPad.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromptsController : ControllerBase
    {
        private readonly PromptPadContext _context;

        public PromptsController(PromptPadContext context)
        {
            _context = context;
        }

        // Save active content AND create a new version (The "Versionar" action)
        [HttpPost("{templateId}/save-version")]
        public async Task<IActionResult> SaveVersion(int templateId, [FromBody] string content, [FromQuery] string summary = "Manual Save")
        {
            var prompt = await _context.Prompts.FirstOrDefaultAsync(p => p.TemplateId == templateId);
            if (prompt == null) return NotFound();

            // 1. Update active prompt
            prompt.Content = content;
            prompt.UpdatedAt = DateTime.UtcNow;

            // 2. Create history record
            var version = new PromptVersion
            {
                PromptId = prompt.Id,
                Content = content,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = 1, // Mock user Id
                ChangeSummary = summary
            };

            _context.PromptVersions.Add(version);
            
            // Update the template state too
            var template = await _context.Templates.FindAsync(templateId);
            if (template != null) template.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new PromptVersionDto
            {
                Id = version.Id,
                Content = version.Content,
                CreatedAt = version.CreatedAt,
                UserName = "Igor",
                ChangeSummary = version.ChangeSummary
            });
        }

        [HttpGet("{templateId}/history")]
        public async Task<ActionResult<IEnumerable<PromptVersionDto>>> GetHistory(int templateId)
        {
            var prompt = await _context.Prompts.FirstOrDefaultAsync(p => p.TemplateId == templateId);
            if (prompt == null) return NotFound();

            return await _context.PromptVersions
                .Where(pv => pv.PromptId == prompt.Id)
                .OrderByDescending(pv => pv.CreatedAt)
                .Select(pv => new PromptVersionDto
                {
                    Id = pv.Id,
                    Content = pv.Content,
                    CreatedAt = pv.CreatedAt,
                    UserName = pv.CreatedBy!.Name,
                    ChangeSummary = pv.ChangeSummary
                })
                .ToListAsync();
        }

        [HttpPost("{templateId}/restore/{versionId}")]
        public async Task<IActionResult> RestoreVersion(int templateId, int versionId)
        {
            var prompt = await _context.Prompts.FirstOrDefaultAsync(p => p.TemplateId == templateId);
            var version = await _context.PromptVersions.FindAsync(versionId);

            if (prompt == null || version == null) return NotFound();

            // Set content back to old version
            prompt.Content = version.Content;
            prompt.UpdatedAt = DateTime.UtcNow;

            // Create a new version as well to mark the restoration
            var restorationRecord = new PromptVersion
            {
                PromptId = prompt.Id,
                Content = version.Content,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = 1,
                ChangeSummary = $"Restaurado para versão de {version.CreatedAt:dd/MM/yyyy HH:mm}"
            };
            
            _context.PromptVersions.Add(restorationRecord);
            await _context.SaveChangesAsync();

            return Ok(new { Content = prompt.Content });
        }
    }
}
