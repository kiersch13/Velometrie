using Microsoft.EntityFrameworkCore;
using App.Data;
using App.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddHttpClient();
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IBikeService, BikeService>();
builder.Services.AddScoped<IWearPartService, WearPartService>();
builder.Services.AddScoped<ITeilVorlageService, TeilVorlageService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStravaService, StravaService>();
builder.Services.AddScoped<IStravaWebhookService, StravaWebhookService>();
builder.Services.AddCors(options =>
{
    // Read allowed origins from config so production deployments can override
    // via environment variable: AllowedOrigins=https://your-frontend.railway.app
    var allowedOrigins = builder.Configuration
        .GetSection("AllowedOrigins")
        .Get<string[]>() ?? ["http://localhost:4200"];

    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Apply pending EF Core migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await App.Data.TeilvorlagenSeeder.SeedAsync(db);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors("AllowAll");
app.MapControllers();
app.Run();