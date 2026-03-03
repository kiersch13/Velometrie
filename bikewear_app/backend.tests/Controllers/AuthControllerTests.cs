using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Controllers;
using App.Data;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace BackendTests.Controllers;

/// <summary>
/// Integration tests for AuthController.
/// Each test wires a fake AuthService to an in-memory database and calls controller
/// methods directly, verifying both the HTTP result type and the returned data.
/// </summary>
public class AuthControllerTests
{
    /// <summary>
    /// Stub IAuthenticationService that accepts sign-in/sign-out calls without side effects.
    /// Used to isolate controller logic from the cookie authentication framework.
    /// </summary>
    private class StubAuthenticationService : IAuthenticationService
    {
        public Task<AuthenticateResult> AuthenticateAsync(HttpContext context, string? scheme)
            => Task.FromResult(AuthenticateResult.NoResult());

        public Task ChallengeAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
            => Task.CompletedTask;

        public Task ForbidAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
            => Task.CompletedTask;

        public Task SignInAsync(HttpContext context, string? scheme, ClaimsPrincipal principal, AuthenticationProperties? properties)
            => Task.CompletedTask;

        public Task SignOutAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
            => Task.CompletedTask;
    }

    /// <summary>
    /// Fake IAuthService that can be configured to return specific values or behaviors.
    /// </summary>
    private class FakeAuthService : IAuthService
    {
        private User? _registerResult;
        private User? _loginResult;
        private bool _shouldDisconnectStrava;

        /// <summary>Configure the result for RegisterAsync.</summary>
        public void SetRegisterResult(User? user) => _registerResult = user;

        /// <summary>Configure the result for LoginAsync.</summary>
        public void SetLoginResult(User? user) => _loginResult = user;

        /// <summary>Configure whether DisconnectStravaAsync should succeed.</summary>
        public void SetDisconnectStravaSuccess(bool success) => _shouldDisconnectStrava = success;

        public Task<User?> RegisterAsync(string email, string password, string? anzeigename)
            => Task.FromResult(_registerResult);

        public Task<User?> LoginAsync(string email, string password)
            => Task.FromResult(_loginResult);

        public Task LogoutAsync(int userId)
            => Task.CompletedTask;

        public string GetStravaRedirectUrl(int userId, out string state)
        {
            state = "test-state-token";
            return "https://www.strava.com/oauth/authorize?test";
        }

        public Task<User> ConnectStravaAsync(string code, string state, int userId)
            => throw new NotImplementedException();

        public Task DisconnectStravaAsync(int userId)
            => _shouldDisconnectStrava
                ? Task.CompletedTask
                : Task.FromException(new InvalidOperationException("Disconnect failed"));

        public Task<string> GetFreshAccessTokenAsync(int userId)
            => throw new NotImplementedException();
    }

    /// <summary>
    /// Creates an in-memory AppDbContext with a unique database name.
    /// </summary>
    private static AppDbContext CreateInMemoryContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    /// <summary>
    /// Creates an AuthController with a fake service and properly configured HttpContext
    /// (including mocked IAuthenticationService for SignInAsync/SignOutAsync calls).
    /// </summary>
    private static AuthController CreateController(AppDbContext context, FakeAuthService service, int userId = 1, bool isAuthenticated = false)
    {
        var controller = new AuthController(service, context);

        // Wire up the stub authentication service
        var services = new ServiceCollection();
        services.AddSingleton<IAuthenticationService>(new StubAuthenticationService());
        var serviceProvider = services.BuildServiceProvider();

        var httpContext = new DefaultHttpContext();
        httpContext.RequestServices = serviceProvider;

        // Set user claims if authenticated
        if (isAuthenticated)
        {
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(
                new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) }, "Test"));
        }

        controller.ControllerContext = new ControllerContext { HttpContext = httpContext };
        return controller;
    }

    // ── Register tests ──────────────────────────────────────────────────────

    [Fact]
    public async Task Register_ReturnsOk_WhenSuccessful()
    {
        using var context = CreateInMemoryContext("Auth_Register_Success");
        var service = new FakeAuthService();
        var newUser = new User { Id = 1, Email = "new@example.com", Anzeigename = "Max" };
        service.SetRegisterResult(newUser);
        var controller = CreateController(context, service);

        var request = new RegisterRequest { Email = "new@example.com", Password = "password123", Anzeigename = "Max" };
        var result = await controller.Register(request);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<User>(ok.Value);
        Assert.Equal("new@example.com", returned.Email);
        Assert.Equal("Max", returned.Anzeigename);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenEmailBlank()
    {
        using var context = CreateInMemoryContext("Auth_Register_BlankEmail");
        var service = new FakeAuthService();
        var controller = CreateController(context, service);

        var request = new RegisterRequest { Email = "", Password = "password123" };
        var result = await controller.Register(request);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenPasswordBlank()
    {
        using var context = CreateInMemoryContext("Auth_Register_BlankPassword");
        var service = new FakeAuthService();
        var controller = CreateController(context, service);

        var request = new RegisterRequest { Email = "test@example.com", Password = "" };
        var result = await controller.Register(request);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenPasswordTooShort()
    {
        using var context = CreateInMemoryContext("Auth_Register_ShortPassword");
        var service = new FakeAuthService();
        var controller = CreateController(context, service);

        var request = new RegisterRequest { Email = "test@example.com", Password = "short" };
        var result = await controller.Register(request);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task Register_ReturnsConflict_WhenEmailAlreadyTaken()
    {
        using var context = CreateInMemoryContext("Auth_Register_DuplicateEmail");
        var service = new FakeAuthService();
        service.SetRegisterResult(null); // Service returns null for duplicate
        var controller = CreateController(context, service);

        var request = new RegisterRequest { Email = "existing@example.com", Password = "password123" };
        var result = await controller.Register(request);

        var conflict = Assert.IsType<ConflictObjectResult>(result.Result);
        Assert.NotNull(conflict.Value);
    }

    // ── Login tests ─────────────────────────────────────────────────────────

    [Fact]
    public async Task Login_ReturnsOk_WhenSuccessful()
    {
        using var context = CreateInMemoryContext("Auth_Login_Success");
        var service = new FakeAuthService();
        var existingUser = new User { Id = 1, Email = "user@example.com" };
        service.SetLoginResult(existingUser);
        var controller = CreateController(context, service);

        var request = new LoginRequest { Email = "user@example.com", Password = "password123" };
        var result = await controller.Login(request);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<User>(ok.Value);
        Assert.Equal("user@example.com", returned.Email);
    }

    [Fact]
    public async Task Login_ReturnsBadRequest_WhenEmailBlank()
    {
        using var context = CreateInMemoryContext("Auth_Login_BlankEmail");
        var service = new FakeAuthService();
        var controller = CreateController(context, service);

        var request = new LoginRequest { Email = "", Password = "password123" };
        var result = await controller.Login(request);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task Login_ReturnsBadRequest_WhenPasswordBlank()
    {
        using var context = CreateInMemoryContext("Auth_Login_BlankPassword");
        var service = new FakeAuthService();
        var controller = CreateController(context, service);

        var request = new LoginRequest { Email = "test@example.com", Password = "" };
        var result = await controller.Login(request);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenCredentialsFail()
    {
        using var context = CreateInMemoryContext("Auth_Login_CredentialsFail");
        var service = new FakeAuthService();
        service.SetLoginResult(null); // Service returns null for failed login
        var controller = CreateController(context, service);

        var request = new LoginRequest { Email = "user@example.com", Password = "wrongpassword" };
        var result = await controller.Login(request);

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        Assert.NotNull(unauthorized.Value);
    }

    // ── Me tests ────────────────────────────────────────────────────────────

    [Fact]
    public async Task Me_ReturnsOk_WhenUserExists()
    {
        using var context = CreateInMemoryContext("Auth_Me_UserExists");
        var user = new User { Id = 1, Email = "user@example.com", Anzeigename = "Max" };
        context.Benutzer.Add(user);
        await context.SaveChangesAsync();

        var service = new FakeAuthService();
        var controller = CreateController(context, service, userId: 1, isAuthenticated: true);

        var result = await controller.Me();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<User>(ok.Value);
        Assert.Equal(1, returned.Id);
        Assert.Equal("user@example.com", returned.Email);
    }

    [Fact]
    public async Task Me_ReturnsUnauthorized_WhenUserNotFound()
    {
        using var context = CreateInMemoryContext("Auth_Me_UserNotFound");
        // Don't add any user to the database

        var service = new FakeAuthService();
        var controller = CreateController(context, service, userId: 9999, isAuthenticated: true);

        var result = await controller.Me();

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result.Result);
        Assert.NotNull(unauthorized.Value);
    }

    // ── Logout tests ────────────────────────────────────────────────────────

    [Fact]
    public async Task Logout_ReturnsOk_WhenAuthenticated()
    {
        using var context = CreateInMemoryContext("Auth_Logout");
        var service = new FakeAuthService();
        var controller = CreateController(context, service, userId: 1, isAuthenticated: true);

        var result = await controller.Logout();

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    // ── Strava tests ────────────────────────────────────────────────────────

    [Fact]
    public async Task DisconnectStrava_ReturnsOk_WhenSuccessful()
    {
        using var context = CreateInMemoryContext("Auth_DisconnectStrava");
        var service = new FakeAuthService();
        service.SetDisconnectStravaSuccess(true);
        var controller = CreateController(context, service, userId: 1, isAuthenticated: true);

        var result = await controller.DisconnectStrava();

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }
}
