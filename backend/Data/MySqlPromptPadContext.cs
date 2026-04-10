using Microsoft.EntityFrameworkCore;

namespace PromptPad.API.Data
{
    public class MySqlPromptPadContext : PromptPadContext
    {
        public MySqlPromptPadContext(DbContextOptions<MySqlPromptPadContext> options)
            : base(options)
        {
        }
    }
}
