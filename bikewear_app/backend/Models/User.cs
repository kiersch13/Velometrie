using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace App.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        // App-level auth
        public string? Email { get; set; }

        [JsonIgnore]
        public string? PasswordHash { get; set; }

        public string? Anzeigename { get; set; }

        // Strava connection (optional — set after OAuth connect)
        public string? StravaId { get; set; }

        /// <summary>True if a Strava account is connected to this user.</summary>
        public bool StravaVerbunden => StravaId != null;

        [JsonIgnore]
        public string? AccessToken { get; set; }

        [JsonIgnore]
        public string? RefreshToken { get; set; }

        [JsonIgnore]
        public long? TokenExpiresAt { get; set; }

        /// <summary>Firstname from Strava profile, set on Strava connect.</summary>
        public string? Vorname { get; set; }
    }
}