using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IAuthService
    {
        // ── App-level auth ──────────────────────────────────────────────────
        Task<User?> RegisterAsync(string email, string password, string? anzeigename);
        Task<User?> LoginAsync(string email, string password);
        Task LogoutAsync(int userId);

        // ── Strava connect (for authenticated users) ────────────────────────
        /// <summary>
        /// Returns the Strava OAuth redirect URL and records the anti-forgery
        /// <paramref name="state"/> value in the in-memory cache tied to
        /// <paramref name="userId"/>.
        /// </summary>
        string GetStravaRedirectUrl(int userId, out string state);

        Task<User> ConnectStravaAsync(string code, string state, int userId);
        Task DisconnectStravaAsync(int userId);

        // ── Strava token management ─────────────────────────────────────────
        Task<string> GetFreshAccessTokenAsync(int userId);
    }
}