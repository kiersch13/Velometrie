using System.Net.Http;
using System.Threading.Tasks;
using App.Data;
using App.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace BackendTests.Services;

// Minimal IHttpClientFactory stub — AuthService only uses it for Strava calls,
// not for Register/Login, so returning a plain HttpClient is sufficient here.
file class StubHttpClientFactory : IHttpClientFactory
{
    public HttpClient CreateClient(string name) => new();
}

/// <summary>
/// Tests for AuthService.RegisterAsync and AuthService.LoginAsync.
/// Each test uses its own in-memory database to avoid state leakage.
/// </summary>
public class AuthServiceTests
{
    private static AppDbContext CreateInMemoryContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    private static AuthService CreateService(AppDbContext context)
        => new(
            context,
            new StubHttpClientFactory(),
            new ConfigurationBuilder().Build(),
            new MemoryCache(new MemoryCacheOptions()));

    // ── RegisterAsync ──────────────────────────────────────────────────────

    [Fact]
    public async Task RegisterAsync_ReturnsUser_WhenEmailIsNew()
    {
        using var context = CreateInMemoryContext("Register_NewEmail");
        var service = CreateService(context);

        var user = await service.RegisterAsync("test@example.com", "password123", null);

        Assert.NotNull(user);
        Assert.Equal("test@example.com", user.Email);
    }

    [Fact]
    public async Task RegisterAsync_NormalizesEmail_ToLowercase()
    {
        using var context = CreateInMemoryContext("Register_Normalize");
        var service = CreateService(context);

        var user = await service.RegisterAsync("  Test@Example.COM  ", "password123", null);

        Assert.NotNull(user);
        Assert.Equal("test@example.com", user.Email);
    }

    [Fact]
    public async Task RegisterAsync_SetsAnzeigename_WhenProvided()
    {
        using var context = CreateInMemoryContext("Register_Anzeigename");
        var service = CreateService(context);

        var user = await service.RegisterAsync("user@example.com", "password123", "  Max Muster  ");

        Assert.NotNull(user);
        Assert.Equal("Max Muster", user.Anzeigename);
    }

    [Fact]
    public async Task RegisterAsync_SetsAnzeigenameNull_WhenBlank()
    {
        using var context = CreateInMemoryContext("Register_AnzeigenameBlank");
        var service = CreateService(context);

        var user = await service.RegisterAsync("user@example.com", "password123", "   ");

        Assert.NotNull(user);
        Assert.Null(user.Anzeigename);
    }

    [Fact]
    public async Task RegisterAsync_ReturnsNull_WhenEmailAlreadyTaken()
    {
        using var context = CreateInMemoryContext("Register_DuplicateEmail");
        var service = CreateService(context);

        await service.RegisterAsync("dup@example.com", "password123", null);
        var second = await service.RegisterAsync("dup@example.com", "different1", null);

        Assert.Null(second);
    }

    [Fact]
    public async Task RegisterAsync_HashesPassword()
    {
        using var context = CreateInMemoryContext("Register_HashesPassword");
        var service = CreateService(context);

        var user = await service.RegisterAsync("hash@example.com", "mypassword", null);

        Assert.NotNull(user);
        Assert.NotEqual("mypassword", user.PasswordHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("mypassword", user.PasswordHash!));
    }

    // ── LoginAsync ─────────────────────────────────────────────────────────

    [Fact]
    public async Task LoginAsync_ReturnsUser_WhenCredentialsAreCorrect()
    {
        using var context = CreateInMemoryContext("Login_Correct");
        var service = CreateService(context);
        await service.RegisterAsync("login@example.com", "correctpass", null);

        var user = await service.LoginAsync("login@example.com", "correctpass");

        Assert.NotNull(user);
        Assert.Equal("login@example.com", user.Email);
    }

    [Fact]
    public async Task LoginAsync_NormalizesEmail_BeforeLookup()
    {
        using var context = CreateInMemoryContext("Login_NormalizeEmail");
        var service = CreateService(context);
        await service.RegisterAsync("norm@example.com", "pass1234", null);

        var user = await service.LoginAsync("  NORM@EXAMPLE.COM  ", "pass1234");

        Assert.NotNull(user);
    }

    [Fact]
    public async Task LoginAsync_ReturnsNull_WhenPasswordIsWrong()
    {
        using var context = CreateInMemoryContext("Login_WrongPassword");
        var service = CreateService(context);
        await service.RegisterAsync("pw@example.com", "rightpassword", null);

        var user = await service.LoginAsync("pw@example.com", "wrongpassword");

        Assert.Null(user);
    }

    [Fact]
    public async Task LoginAsync_ReturnsNull_WhenUserDoesNotExist()
    {
        using var context = CreateInMemoryContext("Login_NoUser");
        var service = CreateService(context);

        var user = await service.LoginAsync("nobody@example.com", "anypassword");

        Assert.Null(user);
    }
}
