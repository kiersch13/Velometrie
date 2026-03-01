using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace App.Services
{
    public class StravaWebhookService : IStravaWebhookService
    {
        private readonly AppDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IAuthService _authService;
        private readonly ILogger<StravaWebhookService> _logger;

        public StravaWebhookService(
            AppDbContext context,
            IHttpClientFactory httpClientFactory,
            IAuthService authService,
            ILogger<StravaWebhookService> logger)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _authService = authService;
            _logger = logger;
        }

        public async Task HandleEventAsync(StravaWebhookEvent webhookEvent)
        {
            // Athlete deauthorization — clear stored tokens
            if (webhookEvent.ObjectType == "athlete"
                && webhookEvent.AspectType == "update"
                && webhookEvent.Updates != null
                && webhookEvent.Updates.TryGetValue("authorized", out var authorized)
                && authorized == "false")
            {
                var ownerIdStr = webhookEvent.OwnerId.ToString();
                var user = await _context.Benutzer
                    .FirstOrDefaultAsync(u => u.StravaId == ownerIdStr);

                if (user != null)
                {
                    user.StravaId = null;
                    user.AccessToken = null;
                    user.RefreshToken = null;
                    user.TokenExpiresAt = null;
                    await _context.SaveChangesAsync();
                }

                return;
            }

            // New activity created — update Kilometerstand of matching bike
            if (webhookEvent.ObjectType == "activity" && webhookEvent.AspectType == "create")
            {
                var ownerIdStr = webhookEvent.OwnerId.ToString();
                var user = await _context.Benutzer
                    .FirstOrDefaultAsync(u => u.StravaId == ownerIdStr);

                if (user == null)
                    return;

                string accessToken;
                try
                {
                    accessToken = await _authService.GetFreshAccessTokenAsync(user.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Fehler beim Abrufen des Zugriffstokens fuer Benutzer {UserId}.", user.Id);
                    return;
                }

                string? gearId = null;
                double distanceMeters = 0;

                try
                {
                    var client = _httpClientFactory.CreateClient();
                    client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", accessToken);

                    var response = await client.GetAsync(
                        $"https://www.strava.com/api/v3/activities/{webhookEvent.ObjectId}");

                    response.EnsureSuccessStatusCode();

                    var json = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(json);
                    var root = doc.RootElement;

                    if (root.TryGetProperty("gear_id", out var gearIdElement)
                        && gearIdElement.ValueKind != JsonValueKind.Null)
                    {
                        gearId = gearIdElement.GetString();
                    }

                    if (root.TryGetProperty("distance", out var distanceElement))
                    {
                        distanceMeters = distanceElement.GetDouble();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex,
                        "Fehler beim Abrufen der Strava-Aktivitaet {ActivityId}.", webhookEvent.ObjectId);
                    return;
                }

                if (string.IsNullOrEmpty(gearId))
                    return;

                var bike = await _context.Rads
                    .FirstOrDefaultAsync(r => r.StravaId == gearId);

                if (bike == null)
                    return;

                var distanceKm = (int)Math.Round(distanceMeters / 1000.0);
                bike.Kilometerstand += distanceKm;
                await _context.SaveChangesAsync();
            }
        }
    }
}
