using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PromptPad.API.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// JWT Configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? "MinhaChaveSuperSecreta@2026!PromptPad";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "PromptPad.API";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddOpenApi();

// SQLite Database
builder.Services.AddDbContext<PromptPadContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=promptpad.db"));

// Allow React dev server (locallhost:5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure DB is created and seeded (Simplified for MVP)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PromptPadContext>();
    db.Database.EnsureCreated(); 
}

app.Run();
