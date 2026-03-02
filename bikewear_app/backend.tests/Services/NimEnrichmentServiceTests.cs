using System.Threading.Tasks;
using App.Models;
using App.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace BackendTests.Services;

/// <summary>
/// Tests for NimEnrichmentService.
/// </summary>
public class NimEnrichmentServiceTests
{
    /// <summary>
    /// Creates a real IHttpClientFactory via DI (required for constructor injection).
    /// </summary>
    private static System.Net.Http.IHttpClientFactory CreateHttpClientFactory()
    {
        var services = new ServiceCollection();
        services.AddHttpClient();
        return services.BuildServiceProvider().GetRequiredService<System.Net.Http.IHttpClientFactory>();
    }

    [Fact]
    public async Task EnrichAsync_NoApiKey_ReturnsPartialUnchanged()
    {
        // Arrange: configuration without an API key
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["NvidiaAI:ApiKey"]  = "",
                ["NvidiaAI:Model"]   = "test-model",
                ["NvidiaAI:BaseUrl"] = "https://example.com/v1"
            })
            .Build();

        var service = new NimEnrichmentService(
            CreateHttpClientFactory(),
            config,
            NullLogger<NimEnrichmentService>.Instance);

        var partial = new TeilVorlage
        {
            Id = 0,
            Name = "Shimano Test Kette",
            Hersteller = "Shimano",
            Kategorie = WearPartCategory.Kette,
            FahrradKategorien = "Rennrad"
        };

        // Act
        var result = await service.EnrichAsync(partial);

        // Assert: no API key → should be returned as-is (reference equality or same values)
        Assert.Equal(partial.Name, result.Name);
        Assert.Equal(partial.Hersteller, result.Hersteller);
        Assert.Equal(partial.Kategorie, result.Kategorie);
        Assert.Equal(partial.FahrradKategorien, result.FahrradKategorien);
    }

    [Fact]
    public async Task EnrichAsync_NullApiKey_ReturnsPartialUnchanged()
    {
        // Arrange: configuration with null API key
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["NvidiaAI:ApiKey"] = null
            })
            .Build();

        var service = new NimEnrichmentService(
            CreateHttpClientFactory(),
            config,
            NullLogger<NimEnrichmentService>.Instance);

        var partial = new TeilVorlage
        {
            Id = 42,
            Name = "Continental GP5000",
            Hersteller = "Continental",
            Kategorie = WearPartCategory.Reifen,
            FahrradKategorien = "Rennrad,Gravel"
        };

        // Act
        var result = await service.EnrichAsync(partial);

        // Assert: no API key → returned unchanged
        Assert.Equal(partial.Id, result.Id);
        Assert.Equal(partial.Name, result.Name);
        Assert.Equal(partial.Hersteller, result.Hersteller);
        Assert.Equal(partial.Kategorie, result.Kategorie);
    }
}
