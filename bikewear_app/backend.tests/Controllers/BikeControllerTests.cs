using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Controllers;
using App.Data;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BackendTests.Controllers;

// FakeStravaService that returns 0 km — only needed by BikeService constructor.
file class FakeStravaService : IStravaService
{
    public Task<IEnumerable<StravaGear>> GetStravaGearAsync(int userId) => throw new NotImplementedException();
    public Task<double> GetActivityKmOnGearAfterDateAsync(int userId, string stravaGearId, DateTime fromDate)
        => Task.FromResult(0.0);
}

file class FakeR2StorageService : IR2StorageService
{
    public Task UploadAsync(string key, Stream content, string contentType, long contentLength)
        => Task.CompletedTask;

    public Task<R2ObjectData?> GetAsync(string key)
        => Task.FromResult<R2ObjectData?>(null);

    public Task DeleteAsync(string key)
        => Task.CompletedTask;
}

/// <summary>
/// Integration tests for BikeController.
/// Each test wires a real BikeService to an in-memory database and calls controller
/// methods directly, verifying both the HTTP result type and the returned data.
/// </summary>
public class BikeControllerTests
{
    private static AppDbContext CreateInMemoryContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    private static BikeController CreateController(AppDbContext context, int userId = 1)
    {
        var service = new BikeService(context, new FakeStravaService());
        var controller = new BikeController(service, new FakeR2StorageService());
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(
                    new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) },
                    "Test"))
            }
        };
        return controller;
    }

    [Fact]
    public async Task GetAllBikes_ReturnsOkWithBikes()
    {
        using var context = CreateInMemoryContext("Ctrl_GetAllBikes");
        context.Rads.AddRange(
            new Bike { Name = "Rad A", Kategorie = BikeCategory.Rennrad, Kilometerstand = 100, UserId = 1 },
            new Bike { Name = "Rad B", Kategorie = BikeCategory.Gravel,  Kilometerstand = 200, UserId = 1 }
        );
        await context.SaveChangesAsync();
        var controller = CreateController(context, userId: 1);

        var result = await controller.GetAllBikes();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var bikes = Assert.IsAssignableFrom<IEnumerable<Bike>>(ok.Value);
        Assert.Equal(2, bikes.Count());
    }

    [Fact]
    public async Task GetAllBikes_ReturnsOnlyCurrentUsersBikes()
    {
        using var context = CreateInMemoryContext("Ctrl_GetAllBikes_UserFilter");
        context.Rads.AddRange(
            new Bike { Name = "Mein Rad",  Kategorie = BikeCategory.Rennrad, Kilometerstand = 100, UserId = 1 },
            new Bike { Name = "Fremdes Rad", Kategorie = BikeCategory.Gravel, Kilometerstand = 200, UserId = 2 }
        );
        await context.SaveChangesAsync();
        var controller = CreateController(context, userId: 1);

        var result = await controller.GetAllBikes();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var bikes = Assert.IsAssignableFrom<IEnumerable<Bike>>(ok.Value);
        Assert.Single(bikes);
        Assert.Equal("Mein Rad", bikes.First().Name);
    }

    [Fact]
    public async Task GetBikeById_ReturnsOk_WhenBikeExists()
    {
        using var context = CreateInMemoryContext("Ctrl_GetBikeById");
        var bike = new Bike { Name = "Testrad", Kategorie = BikeCategory.Mountainbike, Kilometerstand = 500, UserId = 1 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();
        var controller = CreateController(context, userId: 1);

        var result = await controller.GetBikeById(bike.Id);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<Bike>(ok.Value);
        Assert.Equal("Testrad", returned.Name);
    }

    [Fact]
    public async Task GetBikeById_ReturnsNotFound_WhenBikeDoesNotExist()
    {
        using var context = CreateInMemoryContext("Ctrl_GetBikeById_NotFound");
        var controller = CreateController(context, userId: 1);

        var result = await controller.GetBikeById(9999);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task AddBike_ReturnsCreated_WithNewBike()
    {
        using var context = CreateInMemoryContext("Ctrl_AddBike");
        var controller = CreateController(context, userId: 1);
        var newBike = new Bike { Name = "Neues Rad", Kategorie = BikeCategory.Gravel, Kilometerstand = 0, UserId = 0 };

        var result = await controller.AddBike(newBike);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returned = Assert.IsType<Bike>(created.Value);
        Assert.Equal("Neues Rad", returned.Name);
        Assert.Equal(1, returned.UserId); // controller sets UserId from claims
    }

    [Fact]
    public async Task UpdateKilometerstand_ReturnsOk_WhenBikeExists()
    {
        using var context = CreateInMemoryContext("Ctrl_UpdateKm");
        var bike = new Bike { Name = "Rad", Kategorie = BikeCategory.Rennrad, Kilometerstand = 100, UserId = 1 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();
        var controller = CreateController(context, userId: 1);

        var result = await controller.UpdateKilometerstand(bike.Id, 9999);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<Bike>(ok.Value);
        Assert.Equal(9999, returned.Kilometerstand);
    }

    [Fact]
    public async Task UpdateKilometerstand_ReturnsNotFound_WhenBikeDoesNotExist()
    {
        using var context = CreateInMemoryContext("Ctrl_UpdateKm_NotFound");
        var controller = CreateController(context, userId: 1);

        var result = await controller.UpdateKilometerstand(9999, 100);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task UpdateBike_ReturnsOk_WhenBikeExists()
    {
        using var context = CreateInMemoryContext("Ctrl_UpdateBike");
        var bike = new Bike { Name = "Altes Rad", Kategorie = BikeCategory.Rennrad, Kilometerstand = 100, UserId = 1 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();
        var controller = CreateController(context, userId: 1);
        var updated = new Bike { Name = "Neues Rad", Kategorie = BikeCategory.Gravel, Kilometerstand = 500, UserId = 1 };

        var result = await controller.UpdateBike(bike.Id, updated);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<Bike>(ok.Value);
        Assert.Equal("Neues Rad", returned.Name);
    }

    [Fact]
    public async Task UpdateBike_ReturnsNotFound_WhenBikeDoesNotExist()
    {
        using var context = CreateInMemoryContext("Ctrl_UpdateBike_NotFound");
        var controller = CreateController(context, userId: 1);
        var phantom = new Bike { Name = "Phantom", Kategorie = BikeCategory.Mountainbike, Kilometerstand = 0, UserId = 1 };

        var result = await controller.UpdateBike(9999, phantom);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task DeleteBike_ReturnsNoContent_WhenBikeExists()
    {
        using var context = CreateInMemoryContext("Ctrl_DeleteBike");
        var bike = new Bike { Name = "Zu löschen", Kategorie = BikeCategory.Rennrad, Kilometerstand = 0, UserId = 1 };
        context.Rads.Add(bike);
        await context.SaveChangesAsync();
        var controller = CreateController(context, userId: 1);

        var result = await controller.DeleteBike(bike.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.Equal(0, await context.Rads.CountAsync());
    }

    [Fact]
    public async Task DeleteBike_ReturnsNotFound_WhenBikeDoesNotExist()
    {
        using var context = CreateInMemoryContext("Ctrl_DeleteBike_NotFound");
        var controller = CreateController(context, userId: 1);

        var result = await controller.DeleteBike(9999);

        Assert.IsType<NotFoundResult>(result);
    }
}
