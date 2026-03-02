using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using App.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace App.Services
{
    public class NimEnrichmentService : INimEnrichmentService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<NimEnrichmentService> _logger;

        private const string SystemPrompt =
            "Du bist ein Fahrradkomponenten-Experte. Deine Aufgabe ist es, unvollständige Teilvorlagen für eine Fahrrad-Verschleißteil-Bibliothek zu vervollständigen.\n" +
            "Gib ausschließlich ein JSON-Objekt zurück – keinen erklärenden Text.\n\n" +
            "Das JSON muss folgende Felder enthalten:\n" +
            "- \"name\": string – produktgenauer Name, z. B. \"Shimano Ultegra 12s Kette\"\n" +
            "- \"hersteller\": string – Hersteller, z. B. \"Shimano\"\n" +
            "- \"kategorie\": string – eines von: \"Kette\", \"Kassette\", \"Kettenblatt\", \"Reifen\", \"Sonstiges\"\n" +
            "- \"gruppe\": string oder null – Produktgruppe/Schaltgruppe, z. B. \"Ultegra\", \"GRX\", \"Eagle\"\n" +
            "- \"geschwindigkeiten\": number oder null – Anzahl Gänge (z. B. 11, 12), null für Reifen\n" +
            "- \"fahrradKategorien\": string – kommagetrennte Liste, nur aus: \"Rennrad\", \"Gravel\", \"Mountainbike\"\n" +
            "- \"beschreibung\": string oder null – kurze deutsche Produktbeschreibung (1–2 Sätze)\n\n" +
            "Fülle fehlende oder leere Felder auf Basis deines Produktwissens. Existierende Werte dürfen nur korrigiert werden, wenn sie offensichtlich falsch sind.";

        public NimEnrichmentService(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<NimEnrichmentService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<TeilVorlage> EnrichAsync(TeilVorlage partial)
        {
            var apiKey = _configuration["NvidiaAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogWarning("NvidiaAI:ApiKey is not configured. Returning partial TeilVorlage unchanged.");
                return partial;
            }

            var model = _configuration["NvidiaAI:Model"] ?? "meta/llama-3.1-70b-instruct";
            var baseUrl = _configuration["NvidiaAI:BaseUrl"] ?? "https://integrate.api.nvidia.com/v1";

            var userPrompt =
                $"Vervollständige die folgende Teilvorlage:\n" +
                $"name: {partial.Name}\n" +
                $"hersteller: {partial.Hersteller}\n" +
                $"kategorie: {partial.Kategorie}\n" +
                $"gruppe: {partial.Gruppe ?? ""}\n" +
                $"geschwindigkeiten: {(partial.Geschwindigkeiten.HasValue ? partial.Geschwindigkeiten.Value.ToString() : "")}\n" +
                $"fahrradKategorien: {partial.FahrradKategorien}\n" +
                $"beschreibung: {partial.Beschreibung ?? ""}";

            var requestBody = new
            {
                model,
                messages = new[]
                {
                    new { role = "system", content = SystemPrompt },
                    new { role = "user",   content = userPrompt }
                },
                response_format = new { type = "json_object" },
                temperature = 0.2,
                max_tokens = 512
            };

            var json = JsonSerializer.Serialize(requestBody);

            using var client = _httpClientFactory.CreateClient();
            using var request = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/chat/completions");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response;
            try
            {
                response = await client.SendAsync(request);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "HTTP request to Nvidia NIM failed. Returning partial TeilVorlage unchanged.");
                return partial;
            }

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("Nvidia NIM returned {StatusCode}: {Body}. Returning partial TeilVorlage unchanged.", response.StatusCode, errorBody);
                return partial;
            }

            string responseJson;
            try
            {
                responseJson = await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to read Nvidia NIM response. Returning partial TeilVorlage unchanged.");
                return partial;
            }

            try
            {
                var responseNode = JsonNode.Parse(responseJson);
                var messageContent = responseNode?["choices"]?[0]?["message"]?["content"]?.GetValue<string>();
                if (string.IsNullOrWhiteSpace(messageContent))
                {
                    _logger.LogWarning("Nvidia NIM returned empty message content. Returning partial TeilVorlage unchanged.");
                    return partial;
                }

                var aiNode = JsonNode.Parse(messageContent);
                if (aiNode == null)
                {
                    _logger.LogWarning("Failed to parse AI JSON content. Returning partial TeilVorlage unchanged.");
                    return partial;
                }

                return MergeWithPartial(partial, aiNode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to parse Nvidia NIM response JSON. Returning partial TeilVorlage unchanged.");
                return partial;
            }
        }

        private static TeilVorlage MergeWithPartial(TeilVorlage partial, JsonNode aiNode)
        {
            return new TeilVorlage
            {
                Id = partial.Id,
                Name = GetString(aiNode, "name") ?? partial.Name,
                Hersteller = GetString(aiNode, "hersteller") ?? partial.Hersteller,
                Kategorie = ParseKategorie(GetString(aiNode, "kategorie")) ?? partial.Kategorie,
                Gruppe = GetString(aiNode, "gruppe") ?? partial.Gruppe,
                Geschwindigkeiten = GetInt(aiNode, "geschwindigkeiten") ?? partial.Geschwindigkeiten,
                FahrradKategorien = GetString(aiNode, "fahrradKategorien") ?? partial.FahrradKategorien,
                Beschreibung = GetString(aiNode, "beschreibung") ?? partial.Beschreibung,
            };
        }

        private static string? GetString(JsonNode node, string key)
        {
            var val = node[key];
            if (val == null) return null;
            if (val is JsonValue jv && jv.TryGetValue<string>(out var s))
                return string.IsNullOrWhiteSpace(s) ? null : s;
            return null;
        }

        private static int? GetInt(JsonNode node, string key)
        {
            var val = node[key];
            if (val == null) return null;
            if (val is JsonValue jv)
            {
                if (jv.TryGetValue<int>(out var i)) return i;
                if (jv.TryGetValue<long>(out var l)) return (int)l;
                if (jv.TryGetValue<double>(out var d)) return (int)d;
            }
            return null;
        }

        private static WearPartCategory? ParseKategorie(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return null;
            // Map German display names to enum values
            return value switch
            {
                "Kette" => WearPartCategory.Kette,
                "Kassette" => WearPartCategory.Kassette,
                "Kettenblatt" => WearPartCategory.Kettenblatt,
                "Reifen" => WearPartCategory.Reifen,
                "Sonstiges" => WearPartCategory.Sonstiges,
                _ => Enum.TryParse<WearPartCategory>(value, ignoreCase: true, out var parsed) ? parsed : null
            };
        }
    }
}
