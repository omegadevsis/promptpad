using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using MySql.EntityFrameworkCore.Extensions;

namespace PromptPad.API.Data
{
    public class MySqlPromptPadContextFactory : IDesignTimeDbContextFactory<MySqlPromptPadContext>
    {
        public MySqlPromptPadContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var configuration = BuildConfiguration(environment);
            var connectionString = configuration.GetConnectionString("MySqlConnection")
                ?? throw new InvalidOperationException("Connection string 'MySqlConnection' was not found.");

            var optionsBuilder = new DbContextOptionsBuilder<MySqlPromptPadContext>();
            optionsBuilder.UseMySQL(connectionString);

            return new MySqlPromptPadContext(optionsBuilder.Options);
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
