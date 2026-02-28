using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace App.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        public async Task<User> LoginAsync(string stravaId, string accessToken)
        {
            var user = await _context.Benutzer.FirstOrDefaultAsync(u => u.StravaId == stravaId);
            if (user == null)
            {
                user = new User { StravaId = stravaId, AccessToken = accessToken };
                _context.Benutzer.Add(user);
            }
            else
            {
                user.AccessToken = accessToken;
            }
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task LogoutAsync(int userId)
        {
            var user = await _context.Benutzer.FindAsync(userId);
            if (user != null)
            {
                _context.Benutzer.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public string GetStravaRedirectUrl()
        {
            var clientId = _config["Strava:ClientId"];
            var redirectUri = _config["Strava:RedirectUri"];
            return $"https://www.strava.com/oauth/authorize?client_id={clientId}&redirect_uri={Uri.EscapeDataString(redirectUri!)}&response_type=code&approval_prompt=force&scope=activity:read_all,profile:read_all";
        }

        public async Task<User> StravaCallbackAsync(string code)
        {
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

            var user = await _context.Benutzer.FirstOrDefaultAsync(u => u.StravaId == stravaId);
            if (user == null)
            {
                user = new User
                {
                    StravaId = stravaId,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    TokenExpiresAt = expiresAt,
                    Vorname = vorname
                };
                _context.Benutzer.Add(user);
            }
            else
            {
                user.AccessToken = accessToken;
                user.RefreshToken = refreshToken;
                user.TokenExpiresAt = expiresAt;
                user.Vorname = vorname;
            }
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<IEnumerable<StravaGear>> GetStravaGearAsync(int userId)
        {
            var user = await _context.Benutzer.FindAsync(userId)
                ?? throw new InvalidOperationException("Benutzer nicht gefunden.");

            var accessToken = await EnsureFreshTokenAsync(user);

            var httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await httpClient.GetAsync("https://www.strava.com/api/v3/athlete");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var root = JsonDocument.Parse(json).RootElement;

            if (!root.TryGetProperty("bikes", out var bikesElement))
                return Enumerable.Empty<StravaGear>();

            var result = new List<StravaGear>();
            foreach (var b in bikesElement.EnumerateArray())
            {
                result.Add(new StravaGear
                {
                    Id = b.TryGetProperty("id", out var id) ? id.GetString()! : string.Empty,
                    Name = b.TryGetProperty("name", out var name) ? name.GetString()! : string.Empty,
                    KilometerstandKm = b.TryGetProperty("distance", out var dist)
                        ? (int)(dist.GetDouble() / 1000)
                        : 0
                });
            }
            return result;
        }

        /// <summary>
        /// Returns a valid access token, refreshing it via Strava if it has expired or is about to expire.
        /// </summary>
        private async Task<string> EnsureFreshTokenAsync(User user)
        {
            var nowUnix = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            const int bufferSeconds = 300; // refresh 5 min before expiry

            if (user.TokenExpiresAt.HasValue && user.TokenExpiresAt.Value > nowUnix + bufferSeconds)
                return user.AccessToken;

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
            var tokenData = JsonDocument.Parse(json).RootElement;

            user.AccessToken = tokenData.GetProperty("access_token").GetString()!;
            user.RefreshToken = tokenData.GetProperty("refresh_token").GetString()!;
            user.TokenExpiresAt = tokenData.GetProperty("expires_at").GetInt64();
            await _context.SaveChangesAsync();

            return user.AccessToken;
        }
    }
}