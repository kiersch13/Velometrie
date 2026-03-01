using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

namespace App.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;
        private readonly IMemoryCache _cache;

        // Cache key prefix for Strava OAuth anti-forgery state tokens
        private const string StateKeyPrefix = "strava_oauth_state_";
        private static readonly TimeSpan StateTtl = TimeSpan.FromMinutes(10);

        public AuthService(
            AppDbContext context,
            IHttpClientFactory httpClientFactory,
            IConfiguration config,
            IMemoryCache cache)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _config = config;
            _cache = cache;
        }

        // ── App-level auth ──────────────────────────────────────────────────

        public async Task<User?> RegisterAsync(string email, string password, string? anzeigename)
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();

            var existing = await _context.Benutzer
                .FirstOrDefaultAsync(u => u.Email == normalizedEmail);
            if (existing != null)
                return null; // e-mail already taken

            var user = new User
            {
                Email = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Anzeigename = string.IsNullOrWhiteSpace(anzeigename) ? null : anzeigename.Trim()
            };
            _context.Benutzer.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> LoginAsync(string email, string password)
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();
            var user = await _context.Benutzer
                .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

            if (user == null || user.PasswordHash == null)
                return null;

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return null;

            return user;
        }

        public Task LogoutAsync(int userId)
        {
            // Logout is handled by the controller clearing the auth cookie.
            // No server-side session state to clean up.
            return Task.CompletedTask;
        }

        // ── Strava connect ──────────────────────────────────────────────────

        public string GetStravaRedirectUrl(int userId, out string state)
        {
            // Generate a one-time anti-forgery state token tied to this user
            state = Guid.NewGuid().ToString("N");
            _cache.Set(StateKeyPrefix + state, userId, StateTtl);

            var clientId = _config["Strava:ClientId"];
            var redirectUri = _config["Strava:RedirectUri"];
            return "https://www.strava.com/oauth/authorize"
                 + $"?client_id={clientId}"
                 + $"&redirect_uri={Uri.EscapeDataString(redirectUri!)}"
                 + "&response_type=code"
                 + "&approval_prompt=force"
                 + "&scope=activity:read_all,profile:read_all"
                 + $"&state={state}";
        }

        public async Task<User> ConnectStravaAsync(string code, string state, int userId)
        {
            // Validate anti-forgery state
            var cacheKey = StateKeyPrefix + state;
            if (!_cache.TryGetValue(cacheKey, out int cachedUserId) || cachedUserId != userId)
                throw new InvalidOperationException("Ungültiger oder abgelaufener OAuth-State. Bitte erneut verbinden.");
            _cache.Remove(cacheKey); // one-time use

            var clientId = _config["Strava:ClientId"];
            var clientSecret = _config["Strava:ClientSecret"];

            var httpClient = _httpClientFactory.CreateClient();
            var tokenResponse = await httpClient.PostAsync(
                "https://www.strava.com/oauth/token",
                new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("client_id", clientId!),
                    new KeyValuePair<string, string>("client_secret", clientSecret!),
                    new KeyValuePair<string, string>("code", code),
                    new KeyValuePair<string, string>("grant_type", "authorization_code"),
                })
            );

            tokenResponse.EnsureSuccessStatusCode();
            var json = await tokenResponse.Content.ReadAsStringAsync();
            var tokenData = JsonDocument.Parse(json).RootElement;

            var accessToken = tokenData.GetProperty("access_token").GetString()!;
            var refreshToken = tokenData.GetProperty("refresh_token").GetString()!;
            var expiresAt = tokenData.GetProperty("expires_at").GetInt64();
            var athlete = tokenData.GetProperty("athlete");
            var stravaId = athlete.GetProperty("id").GetInt64().ToString();
            var vorname = athlete.TryGetProperty("firstname", out var fn) ? fn.GetString() : null;

            // Prevent linking the same Strava account to multiple app users
            var duplicate = await _context.Benutzer
                .FirstOrDefaultAsync(u => u.StravaId == stravaId && u.Id != userId);
            if (duplicate != null)
                throw new InvalidOperationException("Dieses Strava-Konto ist bereits mit einem anderen Benutzer verbunden.");

            var user = await _context.Benutzer.FindAsync(userId)
                ?? throw new InvalidOperationException("Benutzer nicht gefunden.");

            user.StravaId = stravaId;
            user.AccessToken = accessToken;
            user.RefreshToken = refreshToken;
            user.TokenExpiresAt = expiresAt;
            user.Vorname = vorname;

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task DisconnectStravaAsync(int userId)
        {
            var user = await _context.Benutzer.FindAsync(userId)
                ?? throw new InvalidOperationException("Benutzer nicht gefunden.");

            user.StravaId = null;
            user.AccessToken = null;
            user.RefreshToken = null;
            user.TokenExpiresAt = null;
            user.Vorname = null;

            await _context.SaveChangesAsync();
        }

        // ── Strava token management ─────────────────────────────────────────

        public async Task<string> GetFreshAccessTokenAsync(int userId)
        {
            var user = await _context.Benutzer.FindAsync(userId)
                ?? throw new InvalidOperationException("Benutzer nicht gefunden.");

            if (string.IsNullOrEmpty(user.AccessToken))
                throw new InvalidOperationException("Kein Strava-Konto verbunden. Bitte erst Strava verbinden.");

            return await EnsureFreshTokenAsync(user);
        }

        /// <summary>
        /// Returns a valid Strava access token, refreshing via Strava if it is
        /// expired or within the 5-minute safety buffer.
        /// </summary>
        private async Task<string> EnsureFreshTokenAsync(User user)
        {
            var nowUnix = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            const int bufferSeconds = 300;

            if (user.TokenExpiresAt.HasValue && user.TokenExpiresAt.Value > nowUnix + bufferSeconds)
                return user.AccessToken!;

            if (string.IsNullOrEmpty(user.RefreshToken))
                throw new InvalidOperationException("Kein Refresh-Token vorhanden. Bitte erneut mit Strava verbinden.");

            var clientId = _config["Strava:ClientId"];
            var clientSecret = _config["Strava:ClientSecret"];

            var httpClient = _httpClientFactory.CreateClient();
            var refreshResponse = await httpClient.PostAsync(
                "https://www.strava.com/oauth/token",
                new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("client_id", clientId!),
                    new KeyValuePair<string, string>("client_secret", clientSecret!),
                    new KeyValuePair<string, string>("refresh_token", user.RefreshToken),
                    new KeyValuePair<string, string>("grant_type", "refresh_token"),
                })
            );

            refreshResponse.EnsureSuccessStatusCode();
            var json = await refreshResponse.Content.ReadAsStringAsync();
            var refreshData = JsonDocument.Parse(json).RootElement;

            user.AccessToken = refreshData.GetProperty("access_token").GetString()!;
            user.RefreshToken = refreshData.GetProperty("refresh_token").GetString()!;
            user.TokenExpiresAt = refreshData.GetProperty("expires_at").GetInt64();

            await _context.SaveChangesAsync();
            return user.AccessToken;
        }
    }
}