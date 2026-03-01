using Microsoft.EntityFrameworkCore;
using App.Data;
using App.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IBikeService, BikeService>();
builder.Services.AddScoped<IWearPartService, WearPartService>();
builder.Services.AddScoped<ITeilVorlageService, TeilVorlageService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStravaService, StravaService>();
builder.Services.AddScoped<IStravaWebhookService, StravaWebhookService>();

// Cookie-based authentication (HttpOnly, SameSite=Lax)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "bikewear_session";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.ExpireTimeSpan = TimeSpan.FromDays(30);
        options.SlidingExpiration = true;
        // Return 401/403 instead of redirecting to a login page (API context)
        options.Events.OnRedirectToLogin = ctx =>
        {
            ctx.Response.StatusCode = 401;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = ctx =>
        {
            ctx.Response.StatusCode = 403;
            return Task.CompletedTask;
        };
    });

builder.Services.AddCors(options =>
{
    var allowedOrigins = builder.Configuration
        .GetSection("AllowedOrigins")
        .Get<string[]>() ?? ["http://localhost:4200"];

    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required for cookie auth with cross-origin frontend
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
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/api/health", () => Results.Ok());
app.Run();