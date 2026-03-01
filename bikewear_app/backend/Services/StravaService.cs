using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public class StravaService : IStravaService
    {
        private readonly IAuthService _authService;
        private readonly IHttpClientFactory _httpClientFactory;

        public StravaService(IAuthService authService, IHttpClientFactory httpClientFactory)
        {
            _authService = authService;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<IEnumerable<StravaGear>> GetStravaGearAsync(int userId)
        {
            var accessToken = await _authService.GetFreshAccessTokenAsync(userId);

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
        /// Fetches all Strava activities recorded after <paramref name="fromDate"/> and
        /// returns the total distance in km for activities on the specified gear.
        /// Handles Strava API pagination automatically (200 activities per page).
        /// </summary>
        public async Task<double> GetActivityKmOnGearAfterDateAsync(int userId, string stravaGearId, DateTime fromDate)
        {
            var accessToken = await _authService.GetFreshAccessTokenAsync(userId);

            var httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", accessToken);

            // Convert start of the selected day (UTC) to Unix seconds
            var afterUnix = new DateTimeOffset(fromDate.Date, TimeSpan.Zero).ToUnixTimeSeconds();

            double totalMeters = 0;
            int page = 1;

            while (true)
            {
                var url = $"https://www.strava.com/api/v3/athlete/activities?after={afterUnix}&per_page=200&page={page}";
                var response = await httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var activities = JsonDocument.Parse(json).RootElement;

                if (activities.GetArrayLength() == 0) break;

                foreach (var activity in activities.EnumerateArray())
                {
                    var gearId = activity.TryGetProperty("gear_id", out var g) ? g.GetString() : null;
                    if (gearId == stravaGearId)
                    {
                        var distance = activity.TryGetProperty("distance", out var d) ? d.GetDouble() : 0;
                        totalMeters += distance;
                    }
                }

                page++;
            }

            return totalMeters / 1000.0;
        }
    }
}
