using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using App.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BackendTests.Services;

// FakeStravaService returns 0 km by default; configure kmSince to simulate real data.
file class FakeStravaService : IStravaService
{
    private readonly double _kmSince;
    public FakeStravaService(double kmSince = 0) => _kmSince = kmSince;
    public Task<IEnumerable<StravaGear>> GetStravaGearAsync(int userId) => throw new NotImplementedException();
    public Task<double> GetActivityKmOnGearAfterDateAsync(int userId, string stravaGearId, DateTime fromDate)
        => Task.FromResult(_kmSince);
}

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
            new Bike { Name = "Rennmaschine", Kategorie = BikeCategory.Rennrad,    Kilometerstand = 1000, UserId = 1 },
            new Bike { Name = "Abenteurer",   Kategorie = BikeCategory.Gravel,     Kilometerstand = 500,  UserId = 1 }
        );
        await context.SaveChangesAsync();

        var service = new BikeService(context, new FakeStravaService());

        // Act
        var result = await service.GetAllBikesAsync(userId: 1);

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetAllBikesAsync_ReturnsOnlyCurrentUsersBikes()
    {
        // Arrange: two bikes for different users
        using var context = CreateInMemoryContext("GetAllBikes_UserFilter");
        context.Rads.AddRange(
            new Bike { Name = "Mein Rad",       Kategorie = BikeCategory.Rennrad, Kilometerstand = 100, UserId = 1 },
            new Bike { Name = "Fremdes Rad",     Kategorie = BikeCategory.Gravel,  Kilometerstand = 200, UserId = 2 }
        );
        await context.SaveChangesAsync();

        var service = new BikeService(context, new FakeStravaService());

        // Act: user 1 should only see their own bike
        var result = await service.GetAllBikesAsync(userId: 1);

        // Assert
        Assert.Single(result);
        Assert.Equal("Mein Rad", result.First().Name);
    }

    [Fact]
    public async Task GetBikeByIdAsync_ReturnsCorrectBike()
    {
        // Arrange
        using var context = CreateInMemoryContext("GetBikeById");
        var bike = new Bike { Name = "Spezifisches Rad", Kategorie = BikeCategory.Gravel, Kilometerstand = 200, UserId = 1 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();

        var service = new BikeService(context, new FakeStravaService());

        // Act
        var result = await service.GetBikeByIdAsync(bike.Id, userId: 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Spezifisches Rad", result.Name);
    }

    [Fact]
    public async Task GetBikeByIdAsync_ReturnsNull_WhenBelongsToDifferentUser()
    {
        // Arrange
        using var context = CreateInMemoryContext("GetBikeById_WrongUser");
        var bike = new Bike { Name = "Fremdes Rad", Kategorie = BikeCategory.Gravel, Kilometerstand = 200, UserId = 2 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();

        var service = new BikeService(context, new FakeStravaService());

        // Act: user 1 tries to access user 2's bike
        var result = await service.GetBikeByIdAsync(bike.Id, userId: 1);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task AddBikeAsync_SavesBikeToDatabase()
    {
        // Arrange
        using var context = CreateInMemoryContext("AddBike");
        var service = new BikeService(context, new FakeStravaService());
        var newBike = new Bike { Name = "Testrad", Kategorie = BikeCategory.Mountainbike, Kilometerstand = 0, UserId = 1 };

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
        var bike = new Bike { Name = "Rad", Kategorie = BikeCategory.Rennrad, Kilometerstand = 100, UserId = 1 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();

        var service = new BikeService(context, new FakeStravaService());

        // Act
        var updated = await service.UpdateKilometerstandAsync(bike.Id, userId: 1, kilometerstand: 999);

        // Assert
        Assert.NotNull(updated);
        Assert.Equal(999, updated.Kilometerstand);
    }

    [Fact]
    public async Task UpdateKilometerstandAsync_ReturnsNull_WhenBikeNotFound()
    {
        // Arrange
        using var context = CreateInMemoryContext("UpdateKm_NotFound");
        var service = new BikeService(context, new FakeStravaService());

        // Act
        var result = await service.UpdateKilometerstandAsync(id: 9999, userId: 1, kilometerstand: 100);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateBikeAsync_UpdatesExistingBike()
    {
        // Arrange
        using var context = CreateInMemoryContext("UpdateBike");
        var bike = new Bike { Name = "Altes Rad", Kategorie = BikeCategory.Rennrad, Kilometerstand = 100, UserId = 1 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();

        var service = new BikeService(context, new FakeStravaService());
        var updated = new Bike { Name = "Neues Rad", Kategorie = BikeCategory.Gravel, Kilometerstand = 500, UserId = 1 };

        // Act
        var result = await service.UpdateBikeAsync(bike.Id, userId: 1, bike: updated);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Neues Rad", result.Name);
        Assert.Equal(BikeCategory.Gravel, result.Kategorie);
        Assert.Equal(500, result.Kilometerstand);
    }

    [Fact]
    public async Task UpdateBikeAsync_ReturnsNull_WhenBikeNotFound()
    {
        // Arrange
        using var context = CreateInMemoryContext("UpdateBike_NotFound");
        var service = new BikeService(context, new FakeStravaService());
        var updated = new Bike { Name = "Phantom", Kategorie = BikeCategory.Mountainbike, Kilometerstand = 0, UserId = 1 };

        // Act
        var result = await service.UpdateBikeAsync(id: 9999, userId: 1, bike: updated);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteBikeAsync_RemovesBikeFromDatabase()
    {
        // Arrange
        using var context = CreateInMemoryContext("DeleteBike");
        var bike = new Bike { Name = "Zu löschendes Rad", Kategorie = BikeCategory.Rennrad, Kilometerstand = 0, UserId = 1 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();

        var service = new BikeService(context, new FakeStravaService());

        // Act
        var result = await service.DeleteBikeAsync(bike.Id, userId: 1);

        // Assert
        Assert.True(result);
        Assert.Equal(0, await context.Rads.CountAsync());
    }

    [Fact]
    public async Task DeleteBikeAsync_ReturnsFalse_WhenBikeNotFound()
    {
        // Arrange
        using var context = CreateInMemoryContext("DeleteBike_NotFound");
        var service = new BikeService(context, new FakeStravaService());

        // Act
        var result = await service.DeleteBikeAsync(id: 9999, userId: 1);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetOdometerAtDateAsync_ReturnsNull_WhenBikeNotFound()
    {
        // Arrange
        using var context = CreateInMemoryContext("OdometerAt_NotFound");
        var service = new BikeService(context, new FakeStravaService());

        // Act
        var result = await service.GetOdometerAtDateAsync(bikeId: 9999, userId: 1, date: DateTime.UtcNow);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetOdometerAtDateAsync_ReturnsCurrentKm_WhenNoStravaId()
    {
        // Arrange
        using var context = CreateInMemoryContext("OdometerAt_NoStrava");
        var bike = new Bike { Name = "Ohne Strava", Kategorie = BikeCategory.Rennrad, Kilometerstand = 5000, StravaId = null, UserId = 1 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();

        var service = new BikeService(context, new FakeStravaService(kmSince: 0));

        // Act
        var result = await service.GetOdometerAtDateAsync(bike.Id, userId: 1, date: DateTime.UtcNow.AddMonths(-3));

        // Assert
        Assert.Equal(5000, result);
    }

    [Fact]
    public async Task GetOdometerAtDateAsync_SubtractsKmSinceDate_WhenStravaIdSet()
    {
        // Arrange
        using var context = CreateInMemoryContext("OdometerAt_WithStrava");
        var bike = new Bike { Name = "Mit Strava", Kategorie = BikeCategory.Gravel, Kilometerstand = 3000, StravaId = "b123", UserId = 1 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();

        // Simulate 450.7 km recorded since the install date
        var service = new BikeService(context, new FakeStravaService(kmSince: 450.7));

        // Act
        var result = await service.GetOdometerAtDateAsync(bike.Id, userId: 1, date: DateTime.UtcNow.AddMonths(-3));

        // Assert: 3000 - round(450.7) = 3000 - 451 = 2549
        Assert.Equal(2549, result);
    }
}
