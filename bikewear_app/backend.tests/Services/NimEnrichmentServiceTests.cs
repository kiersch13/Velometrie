using App.Models;
using App.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace BackendTests.Services;

/// <summary>
/// Tests for NimEnrichmentService.
/// These tests use an in-process stub and do not make real network calls.
/// </summary>
public class NimEnrichmentServiceTests
{
    private static NimEnrichmentService CreateService(Dictionary<string, string?> config)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(config)
            .Build();

        // Use a real IHttpClientFactory via a minimal host – but since we expect
        // the service to short-circuit when the API key is absent, we can pass
        // a factory that would fail if actually called.
        var factory = new SingletonHttpClientFactory(new HttpClient());

        return new NimEnrichmentService(factory, configuration, NullLogger<NimEnrichmentService>.Instance);
    }

    [Fact]
    public async Task EnrichAsync_NoApiKey_ReturnsTeilVorlageUnchanged()
    {
        // Arrange
        var service = CreateService(new Dictionary<string, string?> { ["Nim:ApiKey"] = "" });
        var teil = new TeilVorlage
        {
            Name           = "Shimano Ultegra 12s Kette",
            Hersteller     = "Shimano",
            Kategorie      = WearPartCategory.Kette,
            FahrradKategorien = string.Empty
        };

        // Act
        var result = await service.EnrichAsync(teil);

        // Assert: same object returned, nothing mutated
        Assert.Same(teil, result);
        Assert.Null(result.Gruppe);
        Assert.Null(result.Geschwindigkeiten);
        Assert.Empty(result.FahrradKategorien);
        Assert.Null(result.Beschreibung);
    }

    [Fact]
    public async Task EnrichAsync_NullApiKey_ReturnsTeilVorlageUnchanged()
    {
        // Arrange
        var service = CreateService(new Dictionary<string, string?> { ["Nim:ApiKey"] = null });
        var teil = new TeilVorlage
        {
            Name           = "Continental Grand Prix 5000",
            Hersteller     = "Continental",
            Kategorie      = WearPartCategory.Reifen,
            FahrradKategorien = string.Empty
        };

        // Act
        var result = await service.EnrichAsync(teil);

        // Assert: unchanged
        Assert.Same(teil, result);
    }

    /// <summary>Minimal IHttpClientFactory that returns a single pre-built client.</summary>
    private sealed class SingletonHttpClientFactory : IHttpClientFactory
    {
        private readonly HttpClient _client;
        public SingletonHttpClientFactory(HttpClient client) => _client = client;
        public HttpClient CreateClient(string name) => _client;
    }
}
