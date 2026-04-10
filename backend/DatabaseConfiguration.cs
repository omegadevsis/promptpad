using Microsoft.EntityFrameworkCore;
using PromptPad.API.Data;

namespace PromptPad.API;

public static class DatabaseConfiguration
{   
    public static void Configure(WebApplicationBuilder builder)
    {
        var databaseProvider = builder.Configuration["DatabaseProvider"] ?? "Sqlite";
        var sqliteConnection = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=promptpad.db";
        var mySqlConnection = builder.Configuration.GetConnectionString("MySqlConnection");

        if (databaseProvider.Equals("MySql", StringComparison.OrdinalIgnoreCase))
        {
            builder.Services.AddDbContext<PromptPadContext, MySqlPromptPadContext>(options =>
                options.UseMySQL(mySqlConnection ?? throw new InvalidOperationException(
                    "Connection string 'MySqlConnection' was not found.")));
        }
        else
        {
            builder.Services.AddDbContext<PromptPadContext, SqlitePromptPadContext>(options =>
                options.UseSqlite(sqliteConnection));
        }
    }
    
    public static void Migration(WebApplicationBuilder builder,
                                  WebApplication app)
    {
        var databaseProvider = builder.Configuration["DatabaseProvider"] ?? "Sqlite";
        
        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PromptPadContext>();

            if (databaseProvider.Equals("MySql", StringComparison.OrdinalIgnoreCase))
            {
                db.Database.Migrate();
            }
            else
            {
                db.Database.EnsureCreated();
            }
        }
    }
}