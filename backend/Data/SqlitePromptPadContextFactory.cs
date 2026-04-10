using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace PromptPad.API.Data
{
    public class SqlitePromptPadContextFactory : IDesignTimeDbContextFactory<SqlitePromptPadContext>
    {
        public SqlitePromptPadContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var configuration = BuildConfiguration(environment);
            var connectionString = configuration.GetConnectionString("DefaultConnection") ?? "Data Source=promptpad.db";

            var optionsBuilder = new DbContextOptionsBuilder<SqlitePromptPadContext>();
            optionsBuilder.UseSqlite(connectionString);

            return new SqlitePromptPadContext(optionsBuilder.Options);
        }

        private static IConfiguration BuildConfiguration(string? environment)
        {
            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .AddEnvironmentVariables()
                .Build();
        }
    }
}
