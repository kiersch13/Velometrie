using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using App.Controllers;
using App.Data;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BackendTests.Controllers;

/// <summary>
/// Integration tests for WearPartController.
/// Each test wires a real WearPartService to an in-memory database and calls
/// controller methods directly, verifying both the HTTP result type and the data.
/// </summary>
public class WearPartControllerTests
{
    private static AppDbContext CreateInMemoryContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    private static WearPartController CreateController(AppDbContext context)
        => new WearPartController(new WearPartService(context));

    [Fact]
    public async Task GetAllWearParts_ReturnsOkWithParts()
    {
        using var context = CreateInMemoryContext("Ctrl_GetAllWearParts");
        context.Verschleissteile.AddRange(
            new WearPart { RadId = 1, Name = "Vorderreifen", Kategorie = WearPartCategory.Reifen,   EinbauKilometerstand = 0, EinbauDatum = DateTime.Today },
            new WearPart { RadId = 1, Name = "Kette",        Kategorie = WearPartCategory.Kette,    EinbauKilometerstand = 0, EinbauDatum = DateTime.Today }
        );
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        var result = await controller.GetAllWearParts();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var parts = Assert.IsAssignableFrom<IEnumerable<WearPart>>(ok.Value);
        Assert.Equal(2, parts.Count());
    }

    [Fact]
    public async Task GetWearPartsByBike_ReturnsOnlyMatchingParts()
    {
        using var context = CreateInMemoryContext("Ctrl_GetWearPartsByBike");
        context.Verschleissteile.AddRange(
            new WearPart { RadId = 1, Name = "Reifen Rad 1", Kategorie = WearPartCategory.Reifen, EinbauKilometerstand = 0, EinbauDatum = DateTime.Today },
            new WearPart { RadId = 2, Name = "Reifen Rad 2", Kategorie = WearPartCategory.Reifen, EinbauKilometerstand = 0, EinbauDatum = DateTime.Today }
        );
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        var result = await controller.GetWearPartsByBike(radId: 1);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var parts = Assert.IsAssignableFrom<IEnumerable<WearPart>>(ok.Value);
        Assert.Single(parts);
        Assert.Equal("Reifen Rad 1", parts.First().Name);
    }

    [Fact]
    public async Task GetWearPartById_ReturnsOk_WhenPartExists()
    {
        using var context = CreateInMemoryContext("Ctrl_GetWearPartById");
        var part = new WearPart { RadId = 1, Name = "Kassette", Kategorie = WearPartCategory.Kassette, EinbauKilometerstand = 500, EinbauDatum = DateTime.Today };
        context.Verschleissteile.Add(part);
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        var result = await controller.GetWearPartById(part.Id);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<WearPart>(ok.Value);
        Assert.Equal("Kassette", returned.Name);
    }

    [Fact]
    public async Task GetWearPartById_ReturnsNotFound_WhenPartDoesNotExist()
    {
        using var context = CreateInMemoryContext("Ctrl_GetWearPartById_NotFound");
        var controller = CreateController(context);

        var result = await controller.GetWearPartById(9999);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task AddWearPart_ReturnsCreated_WithNewPart()
    {
        using var context = CreateInMemoryContext("Ctrl_AddWearPart");
        var controller = CreateController(context);
        var newPart = new WearPart { RadId = 1, Name = "Neues Kettenblatt", Kategorie = WearPartCategory.Kettenblatt, EinbauKilometerstand = 0, EinbauDatum = DateTime.Today };

        var result = await controller.AddWearPart(newPart);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returned = Assert.IsType<WearPart>(created.Value);
        Assert.Equal("Neues Kettenblatt", returned.Name);
        Assert.Equal(1, await context.Verschleissteile.CountAsync());
    }

    [Fact]
    public async Task UpdateWearPart_ReturnsOk_WhenPartExists()
    {
        using var context = CreateInMemoryContext("Ctrl_UpdateWearPart");
        var part = new WearPart { RadId = 1, Name = "Alter Reifen", Kategorie = WearPartCategory.Reifen, EinbauKilometerstand = 0, EinbauDatum = DateTime.Today };
        context.Verschleissteile.Add(part);
        await context.SaveChangesAsync();
        var controller = CreateController(context);
        var updated = new WearPart { RadId = 1, Name = "Neuer Reifen", Kategorie = WearPartCategory.Reifen, EinbauKilometerstand = 200, EinbauDatum = DateTime.Today };

        var result = await controller.UpdateWearPart(part.Id, updated);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<WearPart>(ok.Value);
        Assert.Equal("Neuer Reifen", returned.Name);
    }

    [Fact]
    public async Task UpdateWearPart_ReturnsNotFound_WhenPartDoesNotExist()
    {
        using var context = CreateInMemoryContext("Ctrl_UpdateWearPart_NotFound");
        var controller = CreateController(context);
        var phantom = new WearPart { RadId = 1, Name = "Phantom", Kategorie = WearPartCategory.Kette, EinbauKilometerstand = 0, EinbauDatum = DateTime.Today };

        var result = await controller.UpdateWearPart(9999, phantom);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task DeleteWearPart_ReturnsNoContent_WhenPartExists()
    {
        using var context = CreateInMemoryContext("Ctrl_DeleteWearPart");
        var part = new WearPart { RadId = 1, Name = "Zu löschen", Kategorie = WearPartCategory.Sonstiges, EinbauKilometerstand = 0, EinbauDatum = DateTime.Today };
        context.Verschleissteile.Add(part);
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        var result = await controller.DeleteWearPart(part.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.Equal(0, await context.Verschleissteile.CountAsync());
    }

    [Fact]
    public async Task DeleteWearPart_ReturnsNotFound_WhenPartDoesNotExist()
    {
        using var context = CreateInMemoryContext("Ctrl_DeleteWearPart_NotFound");
        var controller = CreateController(context);

        var result = await controller.DeleteWearPart(9999);

        Assert.IsType<NotFoundResult>(result);
    }
}
