using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace App.Models
{
    public class StravaWebhookEvent
    {
        [JsonPropertyName("object_type")]
        public string ObjectType { get; set; } = string.Empty;

        [JsonPropertyName("aspect_type")]
        public string AspectType { get; set; } = string.Empty;

        [JsonPropertyName("object_id")]
        public long ObjectId { get; set; }

        [JsonPropertyName("owner_id")]
        public long OwnerId { get; set; }

        [JsonPropertyName("updates")]
        public Dictionary<string, string>? Updates { get; set; }
    }
}
