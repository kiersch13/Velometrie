using App.Data;
using App.Models;
using App.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BackendTests.Services;

/// <summary>
/// Tests for BikeService.
/// Each test gets its own in-memory database (unique name) so they don't interfere.
/// </summary>
public class BikeServiceTests
{
    // Helper: creates a fresh in-memory EF Core database for each test
    private static AppDbContext CreateInMemoryContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllBikesAsync_ReturnsAllBikes()
    {
        // Arrange: seed two bikes into the in-memory database
        using var context = CreateInMemoryContext("GetAllBikes");
        context.Rads.AddRange(
            new Bike { Name = "Rennmaschine", Kategorie = BikeCategory.Rennrad,    Kilometerstand = 1000 },
            new Bike { Name = "Abenteurer",   Kategorie = BikeCategory.Gravel,     Kilometerstand = 500  }
        );
        await context.SaveChangesAsync();

        var service = new BikeService(context);

        // Act
        var result = await service.GetAllBikesAsync();

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetBikeByIdAsync_ReturnsCorrectBike()
    {
        // Arrange
        using var context = CreateInMemoryContext("GetBikeById");
        var bike = new Bike { Name = "Spezifisches Rad", Kategorie = BikeCategory.Gravel, Kilometerstand = 200 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();

        var service = new BikeService(context);

        // Act
        var result = await service.GetBikeByIdAsync(bike.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Spezifisches Rad", result.Name);
    }

    [Fact]
    public async Task AddBikeAsync_SavesBikeToDatabase()
    {
        // Arrange
        using var context = CreateInMemoryContext("AddBike");
        var service = new BikeService(context);
        var newBike = new Bike { Name = "Testrad", Kategorie = BikeCategory.Mountainbike, Kilometerstand = 0 };

        // Act
        var added = await service.AddBikeAsync(newBike);

        // Assert: returned object has correct values, and exactly one bike is in the DB
        Assert.NotNull(added);
        Assert.Equal("Testrad", added.Name);
        Assert.Equal(1, await context.Rads.CountAsync());
    }

    [Fact]
    public async Task UpdateKilometerstandAsync_UpdatesExistingBike()
    {
        // Arrange
        using var context = CreateInMemoryContext("UpdateKm");
        var bike = new Bike { Name = "Rad", Kategorie = BikeCategory.Rennrad, Kilometerstand = 100 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();

        var service = new BikeService(context);

        // Act
        var updated = await service.UpdateKilometerstandAsync(bike.Id, 999);

        // Assert
        Assert.NotNull(updated);
        Assert.Equal(999, updated.Kilometerstand);
    }

    [Fact]
    public async Task UpdateKilometerstandAsync_ReturnsNull_WhenBikeNotFound()
    {
        // Arrange
        using var context = CreateInMemoryContext("UpdateKm_NotFound");
        var service = new BikeService(context);

        // Act
        var result = await service.UpdateKilometerstandAsync(id: 9999, kilometerstand: 100);

        // Assert
        Assert.Null(result);
    }
}
