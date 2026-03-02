using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using App.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace App.Services
{
    public class NimEnrichmentService : INimEnrichmentService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string? _apiKey;
        private readonly string _baseUrl;
        private readonly string _model;
        private readonly ILogger<NimEnrichmentService> _logger;

        public NimEnrichmentService(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<NimEnrichmentService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _apiKey  = configuration["Nim:ApiKey"];
            _baseUrl = configuration["Nim:BaseUrl"] ?? "https://integrate.api.nvidia.com/v1";
            _model   = configuration["Nim:Model"]   ?? "meta/llama-3.1-8b-instruct";
            _logger  = logger;
        }

        public async Task<TeilVorlage> EnrichAsync(TeilVorlage teilVorlage)
        {
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                _logger.LogWarning("Nim:ApiKey is not configured; skipping AI enrichment.");
                return teilVorlage;
            }

            try
            {
                var prompt = BuildPrompt(teilVorlage);

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");

                var requestBody = new
                {
                    model = _model,
                    messages = new[]
                    {
                        new { role = "system", content = "You are an expert on bicycle wear parts. Respond only with valid JSON, no markdown fences." },
                        new { role = "user", content = prompt }
                    },
                    response_format = new { type = "json_object" },
                    temperature = 0.2
                };

                var response = await client.PostAsJsonAsync($"{_baseUrl}/chat/completions", requestBody);
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadFromJsonAsync<JsonElement>();
                var content = responseJson
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                if (!string.IsNullOrWhiteSpace(content))
                    ApplyEnrichment(teilVorlage, content);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "NIM enrichment failed; returning unenriched part.");
            }

            return teilVorlage;
        }

        private static string BuildPrompt(TeilVorlage teil)
        {
            return $"""
                Enrich the following bicycle wear part entry. Return a JSON object with exactly these fields:
                - "gruppe": product group / shift group (string, e.g. "Ultegra", "Eagle", "GRX") or null if not applicable
                - "geschwindigkeiten": number of speeds (integer, e.g. 12) or null if not applicable (e.g. tyres)
                - "fahrradKategorien": comma-separated compatible bike categories, only values from: "Rennrad", "Gravel", "Mountainbike"
                - "beschreibung": 2-3 sentence product description in German

                Part:
                Name: {teil.Name}
                Hersteller: {teil.Hersteller}
                Kategorie: {teil.Kategorie}
                """;
        }

        private static void ApplyEnrichment(TeilVorlage teil, string json)
        {
            // Strip markdown code fences if the model includes them despite instructions
            var trimmed = json.Trim();
            if (trimmed.StartsWith("```"))
            {
                var firstNewline = trimmed.IndexOf('\n');
                var lastFence    = trimmed.LastIndexOf("```");
                if (firstNewline >= 0 && lastFence > firstNewline)
                    trimmed = trimmed[(firstNewline + 1)..lastFence].Trim();
            }

            using var doc = JsonDocument.Parse(trimmed);
            var root = doc.RootElement;

            if (string.IsNullOrWhiteSpace(teil.Gruppe)
                && root.TryGetProperty("gruppe", out var gruppe)
                && gruppe.ValueKind == JsonValueKind.String)
            {
                teil.Gruppe = gruppe.GetString();
            }

            if (!teil.Geschwindigkeiten.HasValue
                && root.TryGetProperty("geschwindigkeiten", out var speed)
                && speed.ValueKind == JsonValueKind.Number)
            {
                teil.Geschwindigkeiten = speed.GetInt32();
            }

            if (string.IsNullOrWhiteSpace(teil.FahrradKategorien)
                && root.TryGetProperty("fahrradKategorien", out var bikes)
                && bikes.ValueKind == JsonValueKind.String)
            {
                teil.FahrradKategorien = bikes.GetString() ?? string.Empty;
            }

            if (string.IsNullOrWhiteSpace(teil.Beschreibung)
                && root.TryGetProperty("beschreibung", out var desc)
                && desc.ValueKind == JsonValueKind.String)
            {
                teil.Beschreibung = desc.GetString();
            }
        }
    }
}
