using System.Security.Claims;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly AppDbContext _db;

        public AuthController(IAuthService authService, AppDbContext db)
        {
            _authService = authService;
            _db = db;
        }

        // ── App-level auth ──────────────────────────────────────────────────

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("E-Mail und Passwort sind erforderlich.");

            if (request.Password.Length < 8)
                return BadRequest("Das Passwort muss mindestens 8 Zeichen lang sein.");

            var user = await _authService.RegisterAsync(request.Email, request.Password, request.Anzeigename);
            if (user == null)
                return Conflict("Diese E-Mail-Adresse ist bereits registriert.");

            await SignInCookieAsync(user);
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("E-Mail und Passwort sind erforderlich.");

            var user = await _authService.LoginAsync(request.Email, request.Password);
            if (user == null)
                return Unauthorized("E-Mail oder Passwort falsch.");

            await SignInCookieAsync(user);
            return Ok(user);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok("Abgemeldet.");
        }

        /// <summary>Returns the current authenticated user (no tokens included).</summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<User>> Me()
        {
            var userId = GetCurrentUserId();
            var user = await _db.Benutzer.FindAsync(userId);
            if (user == null)
            {
                // Session cookie references a deleted user — clear it
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Unauthorized("Benutzer nicht gefunden.");
            }
            return Ok(user);
        }

        // ── Strava connect ──────────────────────────────────────────────────

        /// <summary>
        /// Returns the Strava OAuth redirect URL including an anti-forgery state token.
        /// The frontend must pass the returned <c>state</c> back in the callback.
        /// </summary>
        [HttpGet("strava/redirect-url")]
        [Authorize]
        public ActionResult<object> GetStravaRedirectUrl()
        {
            var userId = GetCurrentUserId();
            var url = _authService.GetStravaRedirectUrl(userId, out var state);
            return Ok(new { url, state });
        }

        [HttpPost("strava/callback")]
        [Authorize]
        public async Task<ActionResult<User>> StravaCallback([FromBody] StravaCallbackRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Code) || string.IsNullOrWhiteSpace(request.State))
                return BadRequest("Autorisierungscode und State sind erforderlich.");

            var userId = GetCurrentUserId();
            try
            {
                var user = await _authService.ConnectStravaAsync(request.Code, request.State, userId);
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch
            {
                return BadRequest("Strava-Verbindung fehlgeschlagen.");
            }
        }

        [HttpDelete("strava/disconnect")]
        [Authorize]
        public async Task<ActionResult> DisconnectStrava()
        {
            var userId = GetCurrentUserId();
            await _authService.DisconnectStravaAsync(userId);
            return Ok("Strava-Verbindung getrennt.");
        }

        // ── Helpers ─────────────────────────────────────────────────────────

        private int GetCurrentUserId()
            => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private async Task SignInCookieAsync(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, user.Anzeigename ?? user.Email ?? user.Id.ToString()),
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        }
    }

    // ── Request models ───────────────────────────────────────────────────────

    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Anzeigename { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class StravaCallbackRequest
    {
        public string Code { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
    }
}