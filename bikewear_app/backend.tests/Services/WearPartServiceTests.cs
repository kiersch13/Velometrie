using App.Data;
using App.Models;
using App.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BackendTests.Services;

/// <summary>
/// Tests for WearPartService.
/// Each test gets its own in-memory database (unique name) so they don't interfere.
/// </summary>
public class WearPartServiceTests
{
    private static AppDbContext CreateInMemoryContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllWearPartsAsync_ReturnsAllParts()
    {
        // Arrange: seed two wear parts into the in-memory database
        using var context = CreateInMemoryContext("GetAllWearParts");
        context.Verschleissteile.AddRange(
            new WearPart { RadId = 1, Name = "Vorderreifen", Kategorie = WearPartCategory.Reifen,   EinbauKilometerstand = 0, EinbauDatum = DateTime.Today },
            new WearPart { RadId = 1, Name = "Kette #1",     Kategorie = WearPartCategory.Kette,    EinbauKilometerstand = 0, EinbauDatum = DateTime.Today }
        );
        await context.SaveChangesAsync();

        var service = new WearPartService(context);

        // Act
        var result = await service.GetAllWearPartsAsync();

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetWearPartsByBikeIdAsync_ReturnsOnlyMatchingParts()
    {
        // Arrange: two bikes, one part each
        using var context = CreateInMemoryContext("GetWearPartsByBikeId");
        context.Verschleissteile.AddRange(
            new WearPart { RadId = 1, Name = "Reifen Rad 1", Kategorie = WearPartCategory.Reifen, EinbauKilometerstand = 0, EinbauDatum = DateTime.Today },
            new WearPart { RadId = 2, Name = "Reifen Rad 2", Kategorie = WearPartCategory.Reifen, EinbauKilometerstand = 0, EinbauDatum = DateTime.Today }
        );
        await context.SaveChangesAsync();

        var service = new WearPartService(context);

        // Act: filter for bike 1 only
        var result = await service.GetWearPartsByBikeIdAsync(radId: 1);

        // Assert: only one part matches, and it's the correct one
        Assert.Single(result);
        Assert.Equal("Reifen Rad 1", result.First().Name);
    }

    [Fact]
    public async Task GetWearPartByIdAsync_ReturnsCorrectPart()
    {
        // Arrange
        using var context = CreateInMemoryContext("GetWearPartById");
        var part = new WearPart { RadId = 1, Name = "Kassette", Kategorie = WearPartCategory.Kassette, EinbauKilometerstand = 500, EinbauDatum = DateTime.Today };
        context.Verschleissteile.Add(part);
        await context.SaveChangesAsync();

        var service = new WearPartService(context);

        // Act
        var result = await service.GetWearPartByIdAsync(part.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Kassette", result.Name);
    }

    [Fact]
    public async Task AddWearPartAsync_SetsBikeIdCorrectly()
    {
        // Arrange
        using var context = CreateInMemoryContext("AddWearPart");
        var service = new WearPartService(context);
        var part = new WearPart
        {
            RadId = 42,
            Name = "Kettenblatt",
            Kategorie = WearPartCategory.Kettenblatt,
            EinbauKilometerstand = 0,
            EinbauDatum = DateTime.Today
        };

        // Act
        var added = await service.AddWearPartAsync(part);

        // Assert: the RadId (FK to Bike) is preserved correctly
        Assert.NotNull(added);
        Assert.Equal(42, added.RadId);
        Assert.Equal("Kettenblatt", added.Name);
        Assert.Equal(1, await context.Verschleissteile.CountAsync());
    }

    [Fact]
    public async Task UpdateWearPartAsync_UpdatesExistingPart()
    {
        // Arrange
        using var context = CreateInMemoryContext("UpdateWearPart");
        var part = new WearPart
        {
            RadId = 1,
            Name = "Alter Reifen",
            Kategorie = WearPartCategory.Reifen,
            EinbauKilometerstand = 0,
            EinbauDatum = DateTime.Today
        };
        context.Verschleissteile.Add(part);
        await context.SaveChangesAsync();

        var service = new WearPartService(context);
        var updatedPart = new WearPart
        {
            RadId = 1,
            Name = "Neuer Reifen",
            Kategorie = WearPartCategory.Reifen,
            EinbauKilometerstand = 200,
            EinbauDatum = DateTime.Today
        };

        // Act
        var result = await service.UpdateWearPartAsync(part.Id, updatedPart);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Neuer Reifen", result.Name);
        Assert.Equal(200, result.EinbauKilometerstand);
    }

    [Fact]
    public async Task UpdateWearPartAsync_ReturnsNull_WhenPartNotFound()
    {
        // Arrange
        using var context = CreateInMemoryContext("UpdateWearPart_NotFound");
        var service = new WearPartService(context);
        var updatedPart = new WearPart
        {
            RadId = 1,
            Name = "Phantom",
            Kategorie = WearPartCategory.Kette,
            EinbauKilometerstand = 0,
            EinbauDatum = DateTime.Today
        };

        // Act
        var result = await service.UpdateWearPartAsync(id: 9999, wearPart: updatedPart);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteWearPartAsync_RemovesPartFromDatabase()
    {
        // Arrange
        using var context = CreateInMemoryContext("DeleteWearPart");
        var part = new WearPart
        {
            RadId = 1,
            Name = "Zu löschendes Teil",
            Kategorie = WearPartCategory.Sonstiges,
            EinbauKilometerstand = 0,
            EinbauDatum = DateTime.Today
        };
        context.Verschleissteile.Add(part);
        await context.SaveChangesAsync();

        var service = new WearPartService(context);

        // Act
        var result = await service.DeleteWearPartAsync(part.Id);

        // Assert
        Assert.True(result);
        Assert.Equal(0, await context.Verschleissteile.CountAsync());
    }

    [Fact]
    public async Task DeleteWearPartAsync_ReturnsFalse_WhenPartNotFound()
    {
        // Arrange
        using var context = CreateInMemoryContext("DeleteWearPart_NotFound");
        var service = new WearPartService(context);

        // Act
        var result = await service.DeleteWearPartAsync(id: 9999);

        // Assert
        Assert.False(result);
    }
}
