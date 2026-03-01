using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using App.Controllers;
using App.Data;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace BackendTests.Services;

// ---------------------------------------------------------------------------
// Manual fakes (no Moq dependency required)
// ---------------------------------------------------------------------------

/// <summary>Handler that returns a pre-configured response.</summary>
file class FakeHandler : HttpMessageHandler
{
    private readonly HttpResponseMessage _response;
    public FakeHandler(HttpResponseMessage response) => _response = response;
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage _, CancellationToken __)
        => Task.FromResult(_response);
}

/// <summary>IHttpClientFactory that always returns a client backed by FakeHandler.</summary>
file class FakeHttpClientFactory : IHttpClientFactory
{
    private readonly HttpMessageHandler _handler;
    public FakeHttpClientFactory(HttpMessageHandler handler) => _handler = handler;
    public HttpClient CreateClient(string name) => new(_handler);
}

/// <summary>
/// IAuthService fake — only GetFreshAccessTokenAsync is meaningful.
/// All other methods throw NotImplementedException.
/// </summary>
file class FakeAuthService : IAuthService
{
    private readonly string _token;
    private readonly Exception? _throw;

    public FakeAuthService(string token = "fake-token", Exception? @throw = null)
    {
        _token = token;
        _throw = @throw;
    }

    public Task<string> GetFreshAccessTokenAsync(int userId)
    {
        if (_throw != null) throw _throw;
        return Task.FromResult(_token);
    }

    public Task<User?> RegisterAsync(string email, string password, string? anzeigename) => throw new NotImplementedException();
    public Task<User?> LoginAsync(string email, string password) => throw new NotImplementedException();
    public Task LogoutAsync(int userId) => throw new NotImplementedException();
    public string GetStravaRedirectUrl(int userId, out string state) { state = string.Empty; throw new NotImplementedException(); }
    public Task<User> ConnectStravaAsync(string code, string state, int userId) => throw new NotImplementedException();
    public Task DisconnectStravaAsync(int userId) => throw new NotImplementedException();
}

// ---------------------------------------------------------------------------
// StravaWebhookService tests
// ---------------------------------------------------------------------------

public class StravaWebhookServiceTests
{
    private static AppDbContext CreateDb()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(opts);
    }

    private static StravaWebhookService BuildService(
        AppDbContext db,
        IHttpClientFactory factory,
        IAuthService? auth = null)
        => new(db, factory, auth ?? new FakeAuthService(), NullLogger<StravaWebhookService>.Instance);

    // ---- 1. Deauth event clears tokens ------------------------------------

    [Fact]
    public async Task HandleEventAsync_Deauth_ClearsTokens()
    {
        using var db = CreateDb();
        var user = new User
        {
            StravaId = "42",
            AccessToken = "old-access",
            RefreshToken = "old-refresh",
            TokenExpiresAt = DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds()
        };
        db.Benutzer.Add(user);
        await db.SaveChangesAsync();
        var userId = user.Id; // capture before deauth clears StravaId

        var svc = BuildService(db,
            new FakeHttpClientFactory(new FakeHandler(new HttpResponseMessage(HttpStatusCode.OK))));

        await svc.HandleEventAsync(new StravaWebhookEvent
        {
            ObjectType = "athlete",
            AspectType = "update",
            OwnerId = 42,
            Updates = new Dictionary<string, string> { { "authorized", "false" } }
        });

        // Reload by PK — StravaId has been cleared to null
        var updated = await db.Benutzer.FindAsync(userId);
        Assert.NotNull(updated);
        Assert.Null(updated!.StravaId);
        Assert.Null(updated.AccessToken);
        Assert.Null(updated.RefreshToken);
        Assert.Null(updated.TokenExpiresAt);
    }

    // ---- 2. Activity create updates Kilometerstand -----------------------

    [Fact]
    public async Task HandleEventAsync_ActivityCreate_UpdatesBikeKilometerstand()
    {
        using var db = CreateDb();
        var user = new User { StravaId = "99", AccessToken = "tok" };
        db.Benutzer.Add(user);
        await db.SaveChangesAsync();

        var bike = new Bike { Name = "Rennrad", Kategorie = BikeCategory.Rennrad, StravaId = "b123", Kilometerstand = 0 };
        db.Rads.Add(bike);
        await db.SaveChangesAsync();

        // Strava returns activity: 50 000 m with gear_id "b123"
        var activityJson = JsonSerializer.Serialize(new { gear_id = "b123", distance = 50_000.0 });
        var fakeResponse = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(activityJson, Encoding.UTF8, "application/json")
        };
        var svc = BuildService(db, new FakeHttpClientFactory(new FakeHandler(fakeResponse)));

        await svc.HandleEventAsync(new StravaWebhookEvent
        {
            ObjectType = "activity",
            AspectType = "create",
            OwnerId = 99,
            ObjectId = 1001
        });

        var updated = await db.Rads.FindAsync(bike.Id);
        Assert.Equal(50, updated!.Kilometerstand);
    }

    // ---- 3. Activity create — user not found, no HTTP call ----------------

    [Fact]
    public async Task HandleEventAsync_ActivityCreate_ReturnsEarly_WhenUserNotFound()
    {
        using var db = CreateDb(); // no user seeded

        var callCount = 0;
        var countingHandler = new CountingHandler(() => callCount++);
        var svc = BuildService(db, new FakeHttpClientFactory(countingHandler));

        await svc.HandleEventAsync(new StravaWebhookEvent
        {
            ObjectType = "activity",
            AspectType = "create",
            OwnerId = 1
        });

        Assert.Equal(0, callCount);
    }

    // ---- 4. Activity create — gear_id null, Kilometerstand unchanged ------

    [Fact]
    public async Task HandleEventAsync_ActivityCreate_ReturnsEarly_WhenGearIdIsNull()
    {
        using var db = CreateDb();
        var user = new User { StravaId = "7", AccessToken = "tok" };
        db.Benutzer.Add(user);
        var bike = new Bike { Name = "Gravel", Kategorie = BikeCategory.Gravel, StravaId = "b99", Kilometerstand = 100 };
        db.Rads.Add(bike);
        await db.SaveChangesAsync();

        var activityJson = JsonSerializer.Serialize(new { gear_id = (string?)null, distance = 20_000.0 });
        var fakeResponse = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(activityJson, Encoding.UTF8, "application/json")
        };
        var svc = BuildService(db, new FakeHttpClientFactory(new FakeHandler(fakeResponse)));

        await svc.HandleEventAsync(new StravaWebhookEvent
        {
            ObjectType = "activity",
            AspectType = "create",
            OwnerId = 7
        });

        var unchanged = await db.Rads.FindAsync(bike.Id);
        Assert.Equal(100, unchanged!.Kilometerstand);
    }

    // ---- 5. Activity create — no bike matches gear_id ---------------------

    [Fact]
    public async Task HandleEventAsync_ActivityCreate_ReturnsEarly_WhenNoMatchingBike()
    {
        using var db = CreateDb();
        var user = new User { StravaId = "55", AccessToken = "tok" };
        db.Benutzer.Add(user);
        var bike = new Bike { Name = "MTB", Kategorie = BikeCategory.Mountainbike, StravaId = "b_OTHER", Kilometerstand = 200 };
        db.Rads.Add(bike);
        await db.SaveChangesAsync();

        var activityJson = JsonSerializer.Serialize(new { gear_id = "b_UNKNOWN", distance = 30_000.0 });
        var fakeResponse = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(activityJson, Encoding.UTF8, "application/json")
        };
        var svc = BuildService(db, new FakeHttpClientFactory(new FakeHandler(fakeResponse)));

        await svc.HandleEventAsync(new StravaWebhookEvent
        {
            ObjectType = "activity",
            AspectType = "create",
            OwnerId = 55
        });

        var unchanged = await db.Rads.FindAsync(bike.Id);
        Assert.Equal(200, unchanged!.Kilometerstand);
    }
}

/// <summary>Counts HTTP calls without making real network requests.</summary>
file class CountingHandler : HttpMessageHandler
{
    private readonly Action _onSend;
    public CountingHandler(Action onSend) => _onSend = onSend;
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage _, CancellationToken __)
    {
        _onSend();
        return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent("{}", Encoding.UTF8, "application/json")
        });
    }
}

// ---------------------------------------------------------------------------
// WebhookController tests
// ---------------------------------------------------------------------------

public class WebhookControllerTests
{
    private static IConfiguration BuildConfig(string token) =>
        new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { { "Strava:WebhookVerifyToken", token } })
            .Build();

    private static WebhookController BuildController(string token)
    {
        var services = new ServiceCollection();
        services.AddScoped<IStravaWebhookService, NoOpWebhookService>();
        var provider = services.BuildServiceProvider();
        var scopeFactory = provider.GetRequiredService<IServiceScopeFactory>();
        return new WebhookController(scopeFactory, BuildConfig(token), NullLogger<WebhookController>.Instance);
    }

    private class NoOpWebhookService : IStravaWebhookService
    {
        public Task HandleEventAsync(StravaWebhookEvent e) => Task.CompletedTask;
    }

    // ---- 1. GET validation — correct token returns hub.challenge ----------

    [Fact]
    public void StravaValidation_ReturnsChallengeEcho_WhenTokenMatches()
    {
        var controller = BuildController("secret123");

        var result = controller.StravaValidation("subscribe", "abc-challenge", "secret123");

        var ok = Assert.IsAssignableFrom<ObjectResult>(result);
        Assert.Equal(200, ok.StatusCode);
        var json = JsonSerializer.Serialize(ok.Value);
        using var doc = JsonDocument.Parse(json);
        Assert.Equal("abc-challenge", doc.RootElement.GetProperty("hub.challenge").GetString());
    }

    // ---- 2. GET validation — wrong token returns 401 ----------------------

    [Fact]
    public void StravaValidation_ReturnsUnauthorized_WhenTokenDoesNotMatch()
    {
        var controller = BuildController("secret123");

        var result = controller.StravaValidation("subscribe", "abc-challenge", "WRONG");

        Assert.IsType<UnauthorizedResult>(result);
    }

    // ---- 3. POST event returns 200 OK immediately -------------------------

    [Fact]
    public void StravaEvent_Returns200Ok_Immediately()
    {
        var controller = BuildController("secret123");

        var result = controller.StravaEvent(new StravaWebhookEvent
        {
            ObjectType = "activity",
            AspectType = "create",
            OwnerId = 1
        });

        Assert.IsType<OkResult>(result);
    }
}
