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

// Minimal NIM stub — passes through input unchanged for all controller tests.
file class FakeNimEnrichmentService : INimEnrichmentService
{
    public Task<TeilVorlage> EnrichAsync(TeilVorlage partial) => Task.FromResult(partial);
    public Task<(bool IsValid, string Grund)> ValidateAsync(TeilVorlage partial)
        => Task.FromResult((true, string.Empty));
}

/// <summary>
/// Integration tests for TeilVorlageController.
/// Each test wires a real TeilVorlageService to an in-memory database and calls
/// controller methods directly, verifying both the HTTP result type and the data.
/// </summary>
public class TeilVorlageControllerTests
{
    private static AppDbContext CreateInMemoryContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    private static TeilVorlageController CreateController(AppDbContext context)
        => new TeilVorlageController(new TeilVorlageService(context), new FakeNimEnrichmentService());

    [Fact]
    public async Task GetAll_ReturnsOkWithAllTeilvorlagen()
    {
        using var context = CreateInMemoryContext("Ctrl_TeilVorlage_GetAll");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Shimano Kette 11s", Hersteller = "Shimano",     Kategorie = WearPartCategory.Kette,   FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "Continental GP5000", Hersteller = "Continental", Kategorie = WearPartCategory.Reifen,  FahrradKategorien = "Rennrad,Gravel" }
        );
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        var result = await controller.GetAll(null, null, null, null);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var teile = Assert.IsAssignableFrom<IEnumerable<TeilVorlage>>(ok.Value);
        Assert.Equal(2, teile.Count());
    }

    [Fact]
    public async Task GetAll_FiltersByKategorie()
    {
        using var context = CreateInMemoryContext("Ctrl_TeilVorlage_GetAll_FilterKategorie");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Kette A", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette,  FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "Reifen A", Hersteller = "Conti",  Kategorie = WearPartCategory.Reifen, FahrradKategorien = "Rennrad" }
        );
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        var result = await controller.GetAll(WearPartCategory.Kette, null, null, null);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var teile = Assert.IsAssignableFrom<IEnumerable<TeilVorlage>>(ok.Value);
        Assert.Single(teile);
        Assert.Equal("Kette A", teile.First().Name);
    }

    [Fact]
    public async Task GetById_ReturnsOk_WhenExists()
    {
        using var context = CreateInMemoryContext("Ctrl_TeilVorlage_GetById");
        var teil = new TeilVorlage { Name = "SRAM Eagle", Hersteller = "SRAM", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Mountainbike" };
        context.Teilvorlagen.Add(teil);
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        var result = await controller.GetById(teil.Id);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<TeilVorlage>(ok.Value);
        Assert.Equal("SRAM Eagle", returned.Name);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenNotExists()
    {
        using var context = CreateInMemoryContext("Ctrl_TeilVorlage_GetById_NotFound");
        var controller = CreateController(context);

        var result = await controller.GetById(9999);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task GetHersteller_ReturnsDistinctManufacturers()
    {
        using var context = CreateInMemoryContext("Ctrl_TeilVorlage_GetHersteller");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Kette 11s", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette,  FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "Kette 12s", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette,  FahrradKategorien = "Gravel" },
            new TeilVorlage { Name = "Kette X01", Hersteller = "SRAM",    Kategorie = WearPartCategory.Kette,  FahrradKategorien = "Mountainbike" }
        );
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        var result = await controller.GetHersteller(null, null);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var hersteller = Assert.IsAssignableFrom<IEnumerable<string>>(ok.Value);
        Assert.Equal(2, hersteller.Count()); // "Shimano" and "SRAM"
    }

    [Fact]
    public async Task Add_ReturnsCreated_WithNewTeilVorlage()
    {
        using var context = CreateInMemoryContext("Ctrl_TeilVorlage_Add");
        var controller = CreateController(context);
        var newTeil = new TeilVorlage { Name = "Neue Kassette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Rennrad" };

        var result = await controller.Add(newTeil);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returned = Assert.IsType<TeilVorlage>(created.Value);
        Assert.Equal("Neue Kassette", returned.Name);
        Assert.Equal(1, await context.Teilvorlagen.CountAsync());
    }

    [Fact]
    public async Task Update_ReturnsOk_WhenExists()
    {
        using var context = CreateInMemoryContext("Ctrl_TeilVorlage_Update");
        var teil = new TeilVorlage { Name = "Alte Kassette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Rennrad" };
        context.Teilvorlagen.Add(teil);
        await context.SaveChangesAsync();
        var controller = CreateController(context);
        var updated = new TeilVorlage { Name = "Neue Kassette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Rennrad,Gravel" };

        var result = await controller.Update(teil.Id, updated);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsType<TeilVorlage>(ok.Value);
        Assert.Equal("Neue Kassette", returned.Name);
        Assert.Equal("Rennrad,Gravel", returned.FahrradKategorien);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenNotExists()
    {
        using var context = CreateInMemoryContext("Ctrl_TeilVorlage_Update_NotFound");
        var controller = CreateController(context);
        var phantom = new TeilVorlage { Name = "Phantom", Hersteller = "Niemand", Kategorie = WearPartCategory.Sonstiges, FahrradKategorien = "Rennrad" };

        var result = await controller.Update(9999, phantom);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenExists()
    {
        using var context = CreateInMemoryContext("Ctrl_TeilVorlage_Delete");
        var teil = new TeilVorlage { Name = "Zu löschen", Hersteller = "Test", Kategorie = WearPartCategory.Sonstiges, FahrradKategorien = "Rennrad" };
        context.Teilvorlagen.Add(teil);
        await context.SaveChangesAsync();
        var controller = CreateController(context);

        var result = await controller.Delete(teil.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.Equal(0, await context.Teilvorlagen.CountAsync());
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenNotExists()
    {
        using var context = CreateInMemoryContext("Ctrl_TeilVorlage_Delete_NotFound");
        var controller = CreateController(context);

        var result = await controller.Delete(9999);

        Assert.IsType<NotFoundResult>(result);
    }
}
