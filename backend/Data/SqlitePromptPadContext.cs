using Microsoft.EntityFrameworkCore;

namespace PromptPad.API.Data
{
    public class SqlitePromptPadContext : PromptPadContext
    {
        public SqlitePromptPadContext(DbContextOptions<SqlitePromptPadContext> options)
            : base(options)
        {
        }
    }
}
