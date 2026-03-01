using Microsoft.EntityFrameworkCore;
using App.Data;
using App.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.HttpOverrides;
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

// Cookie-based authentication.
// Production (cross-origin Railway deployment): SameSite=None + Secure so the
// HttpOnly cookie can be sent from the frontend domain to the backend domain.
// Development (localhost): SameSite=Lax is sufficient and avoids needing HTTPS.
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "bikewear_session";
        options.Cookie.HttpOnly = true;
        if (builder.Environment.IsDevelopment())
        {
            options.Cookie.SameSite = SameSiteMode.Lax;
            options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        }
        else
        {
            // SameSite=None is required for cross-origin cookie delivery.
            // Secure=Always is mandatory when SameSite=None is used.
            options.Cookie.SameSite = SameSiteMode.None;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        }
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

    // Also support a single ALLOWED_ORIGIN environment variable so that the
    // production frontend URL can be injected without changing appsettings.json.
    // In Railway, set: ALLOWED_ORIGIN=https://<your-frontend>.up.railway.app
    var singleOrigin = builder.Configuration["ALLOWED_ORIGIN"];
    if (!string.IsNullOrWhiteSpace(singleOrigin) && !allowedOrigins.Contains(singleOrigin))
        allowedOrigins = [.. allowedOrigins, singleOrigin];

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

// Trust the X-Forwarded-For and X-Forwarded-Proto headers set by Railway's
// reverse proxy so that Request.IsHttps is correct and the Secure cookie flag
// is applied. Clearing KnownIPNetworks/KnownProxies and setting ForwardLimit=1
// follows Microsoft's guidance for PaaS providers where proxy IPs are unknown.
var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
    ForwardLimit = 1,
};
forwardedHeadersOptions.KnownIPNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeadersOptions);
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();