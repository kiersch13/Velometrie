using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using App.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BackendTests.Services;

/// <summary>
/// Tests for TeilVorlageService.
/// Each test gets its own in-memory database (unique name) so they don't interfere.
/// </summary>
public class TeilVorlageServiceTests
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
    public async Task GetAllAsync_ReturnsAllTeilvorlagen()
    {
        // Arrange: seed three TeilVorlage entries into the in-memory database
        using var context = CreateInMemoryContext("GetAll_Basic");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Shimano Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "Continental Grand Prix", Hersteller = "Continental", Kategorie = WearPartCategory.Reifen, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "SRAM Eagle Kassette", Hersteller = "SRAM", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Mountainbike" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.Equal(3, result.Count());
    }

    [Fact]
    public async Task GetAllAsync_WithKategorie_FiltersByCategory()
    {
        // Arrange: seed entries with different categories
        using var context = CreateInMemoryContext("GetAll_FilterByKategorie");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Shimano Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "SRAM Eagle Kassette", Hersteller = "SRAM", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Mountainbike" },
            new TeilVorlage { Name = "KMC Kette", Hersteller = "KMC", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Mountainbike" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act: filter by Kette category
        var result = await service.GetAllAsync(kategorie: WearPartCategory.Kette);

        // Assert
        Assert.Equal(2, result.Count());
        Assert.All(result, item => Assert.Equal(WearPartCategory.Kette, item.Kategorie));
    }

    [Fact]
    public async Task GetAllAsync_WithHersteller_FiltersByManufacturer()
    {
        // Arrange: seed entries with different manufacturers
        using var context = CreateInMemoryContext("GetAll_FilterByHersteller");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Shimano Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "Shimano 105 Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "SRAM Eagle Kassette", Hersteller = "SRAM", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Mountainbike" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act: filter by Shimano
        var result = await service.GetAllAsync(hersteller: "Shimano");

        // Assert
        Assert.Equal(2, result.Count());
        Assert.All(result, item => Assert.Equal("Shimano", item.Hersteller));
    }

    [Fact]
    public async Task GetAllAsync_WithFahrradKategorie_FiltersByBikeCategory()
    {
        // Arrange: seed entries with different FahrradKategorien
        using var context = CreateInMemoryContext("GetAll_FilterByFahrradKategorie");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Shimano Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "KMC Kette", Hersteller = "KMC", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad,Gravel" },
            new TeilVorlage { Name = "SRAM Eagle Kassette", Hersteller = "SRAM", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Mountainbike" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act: filter by Rennrad
        var result = await service.GetAllAsync(fahrradKategorie: "Rennrad");

        // Assert
        Assert.Equal(2, result.Count());
        Assert.All(result, item => Assert.Contains("Rennrad", item.FahrradKategorien));
    }

    [Fact]
    public async Task GetAllAsync_WithSuche_SearchsByNameAndHersteller()
    {
        // Arrange: seed entries with names and manufacturers
        using var context = CreateInMemoryContext("GetAll_Search");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Shimano Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "KMC Kette", Hersteller = "KMC", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Mountainbike" },
            new TeilVorlage { Name = "Continental Grand Prix", Hersteller = "Continental", Kategorie = WearPartCategory.Reifen, FahrradKategorien = "Rennrad" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act: search for "Ultegra"
        var result = await service.GetAllAsync(suche: "Ultegra");

        // Assert: should find the Ultegra item
        Assert.Single(result);
        Assert.Equal("Shimano Ultegra Kette", result.First().Name);
    }

    [Fact]
    public async Task GetAllAsync_WithSuche_SearchsByManufacturerName()
    {
        // Arrange: seed entries with manufacturers
        using var context = CreateInMemoryContext("GetAll_SearchByManufacturer");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "KMC Kette", Hersteller = "KMC", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Mountainbike" },
            new TeilVorlage { Name = "Grand Prix", Hersteller = "Continental", Kategorie = WearPartCategory.Reifen, FahrradKategorien = "Rennrad" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act: search for "Shimano"
        var result = await service.GetAllAsync(suche: "Shimano");

        // Assert: should find the Shimano item
        Assert.Single(result);
        Assert.Equal("Ultegra Kette", result.First().Name);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsOrderedByHerstellerThenName()
    {
        // Arrange: seed entries in non-alphabetical order
        using var context = CreateInMemoryContext("GetAll_Ordering");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "Zebra Kette", Hersteller = "KMC", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Mountainbike" },
            new TeilVorlage { Name = "Alpha Reifen", Hersteller = "Continental", Kategorie = WearPartCategory.Reifen, FahrradKategorien = "Rennrad" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act
        var result = await service.GetAllAsync();
        var resultList = result.ToList();

        // Assert: should be ordered Continental (Alpha), KMC (Zebra), Shimano (Ultegra)
        Assert.Equal("Alpha Reifen", resultList[0].Name);
        Assert.Equal("Continental", resultList[0].Hersteller);
        Assert.Equal("Zebra Kette", resultList[1].Name);
        Assert.Equal("KMC", resultList[1].Hersteller);
        Assert.Equal("Ultegra Kette", resultList[2].Name);
        Assert.Equal("Shimano", resultList[2].Hersteller);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsCorrectItem()
    {
        // Arrange
        using var context = CreateInMemoryContext("GetById_Success");
        var teilVorlage = new TeilVorlage { Name = "Shimano Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" };
        context.Teilvorlagen.Add(teilVorlage);
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act
        var result = await service.GetByIdAsync(teilVorlage.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Shimano Ultegra Kette", result.Name);
        Assert.Equal("Shimano", result.Hersteller);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        // Arrange
        using var context = CreateInMemoryContext("GetById_NotFound");
        var service = new TeilVorlageService(context);

        // Act
        var result = await service.GetByIdAsync(id: 9999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetHerstellerListAsync_ReturnsDistinctHersteller()
    {
        // Arrange: seed entries with duplicate manufacturers
        using var context = CreateInMemoryContext("GetHersteller_Distinct");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "105 Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "Eagle Kassette", Hersteller = "SRAM", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Mountainbike" },
            new TeilVorlage { Name = "Grand Prix", Hersteller = "Continental", Kategorie = WearPartCategory.Reifen, FahrradKategorien = "Rennrad" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act
        var result = await service.GetHerstellerListAsync();

        // Assert
        Assert.Equal(3, result.Count());
        Assert.Contains("Shimano", result);
        Assert.Contains("SRAM", result);
        Assert.Contains("Continental", result);
    }

    [Fact]
    public async Task GetHerstellerListAsync_ReturnsSortedAlphabetically()
    {
        // Arrange: seed entries with manufacturers in non-alphabetical order
        using var context = CreateInMemoryContext("GetHersteller_Sorted");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "Eagle Kassette", Hersteller = "SRAM", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Mountainbike" },
            new TeilVorlage { Name = "Grand Prix", Hersteller = "Continental", Kategorie = WearPartCategory.Reifen, FahrradKategorien = "Rennrad" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act
        var result = await service.GetHerstellerListAsync();
        var resultList = result.ToList();

        // Assert: verify the results are in alphabetical order
        Assert.Equal(3, resultList.Count);
        // Check that all elements are sorted
        var expected = resultList.OrderBy(h => h).ToList();
        Assert.Equal(expected, resultList);
    }

    [Fact]
    public async Task GetHerstellerListAsync_WithKategorie_FiltersByCategory()
    {
        // Arrange: seed entries with different categories
        using var context = CreateInMemoryContext("GetHersteller_FilterByKategorie");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "KMC Kette", Hersteller = "KMC", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Mountainbike" },
            new TeilVorlage { Name = "Grand Prix", Hersteller = "Continental", Kategorie = WearPartCategory.Reifen, FahrradKategorien = "Rennrad" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act: filter by Kette category
        var result = await service.GetHerstellerListAsync(kategorie: WearPartCategory.Kette);

        // Assert: should only include Shimano and KMC (both have Kette)
        Assert.Equal(2, result.Count());
        Assert.Contains("Shimano", result);
        Assert.Contains("KMC", result);
        Assert.DoesNotContain("Continental", result);
    }

    [Fact]
    public async Task GetHerstellerListAsync_WithFahrradKategorie_FiltersByBikeCategory()
    {
        // Arrange: seed entries with different FahrradKategorien
        using var context = CreateInMemoryContext("GetHersteller_FilterByFahrradKategorie");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "Eagle Kassette", Hersteller = "SRAM", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Mountainbike" },
            new TeilVorlage { Name = "Grand Prix", Hersteller = "Continental", Kategorie = WearPartCategory.Reifen, FahrradKategorien = "Rennrad,Gravel" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act: filter by Rennrad
        var result = await service.GetHerstellerListAsync(fahrradKategorie: "Rennrad");

        // Assert: should include Shimano and Continental (both have Rennrad)
        Assert.Equal(2, result.Count());
        Assert.Contains("Shimano", result);
        Assert.Contains("Continental", result);
        Assert.DoesNotContain("SRAM", result);
    }

    [Fact]
    public async Task AddAsync_SavesItemToDatabase()
    {
        // Arrange
        using var context = CreateInMemoryContext("Add_Success");
        var service = new TeilVorlageService(context);
        var newTeilVorlage = new TeilVorlage
        {
            Name = "Test Kette",
            Hersteller = "TestHersteller",
            Kategorie = WearPartCategory.Kette,
            FahrradKategorien = "Rennrad",
            Gruppe = "Test Gruppe",
            Geschwindigkeiten = 12,
            Beschreibung = "Test Beschreibung"
        };

        // Act
        var added = await service.AddAsync(newTeilVorlage);

        // Assert: returned object has correct values, and exactly one item is in the DB
        Assert.NotNull(added);
        Assert.Equal("Test Kette", added.Name);
        Assert.Equal("TestHersteller", added.Hersteller);
        Assert.Equal(WearPartCategory.Kette, added.Kategorie);
        Assert.Equal("Rennrad", added.FahrradKategorien);
        Assert.Equal("Test Gruppe", added.Gruppe);
        Assert.Equal(12, added.Geschwindigkeiten);
        Assert.Equal("Test Beschreibung", added.Beschreibung);
        Assert.Equal(1, await context.Teilvorlagen.CountAsync());
    }

    [Fact]
    public async Task AddAsync_AssignsId()
    {
        // Arrange
        using var context = CreateInMemoryContext("Add_AssignsId");
        var service = new TeilVorlageService(context);
        var newTeilVorlage = new TeilVorlage
        {
            Name = "Test Kette",
            Hersteller = "TestHersteller",
            Kategorie = WearPartCategory.Kette,
            FahrradKategorien = "Rennrad"
        };

        // Act
        var added = await service.AddAsync(newTeilVorlage);

        // Assert: Id should be assigned
        Assert.True(added.Id > 0);
    }

    [Fact]
    public async Task UpdateAsync_UpdatesExistingItem()
    {
        // Arrange
        using var context = CreateInMemoryContext("Update_Success");
        var original = new TeilVorlage
        {
            Name = "Alte Kette",
            Hersteller = "AlterHersteller",
            Kategorie = WearPartCategory.Kette,
            FahrradKategorien = "Rennrad",
            Gruppe = "Alte Gruppe"
        };
        context.Teilvorlagen.Add(original);
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);
        var updated = new TeilVorlage
        {
            Name = "Neue Kette",
            Hersteller = "NeuerHersteller",
            Kategorie = WearPartCategory.Kassette,
            FahrradKategorien = "Mountainbike",
            Gruppe = "Neue Gruppe",
            Geschwindigkeiten = 10,
            Beschreibung = "Neue Beschreibung"
        };

        // Act
        var result = await service.UpdateAsync(original.Id, updated);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Neue Kette", result.Name);
        Assert.Equal("NeuerHersteller", result.Hersteller);
        Assert.Equal(WearPartCategory.Kassette, result.Kategorie);
        Assert.Equal("Mountainbike", result.FahrradKategorien);
        Assert.Equal("Neue Gruppe", result.Gruppe);
        Assert.Equal(10, result.Geschwindigkeiten);
        Assert.Equal("Neue Beschreibung", result.Beschreibung);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenNotFound()
    {
        // Arrange
        using var context = CreateInMemoryContext("Update_NotFound");
        var service = new TeilVorlageService(context);
        var updated = new TeilVorlage
        {
            Name = "Phantom Kette",
            Hersteller = "Phantom",
            Kategorie = WearPartCategory.Kette,
            FahrradKategorien = "Rennrad"
        };

        // Act
        var result = await service.UpdateAsync(id: 9999, updated);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_RemovesItemFromDatabase()
    {
        // Arrange
        using var context = CreateInMemoryContext("Delete_Success");
        var teilVorlage = new TeilVorlage
        {
            Name = "Zu löschende Kette",
            Hersteller = "Shimano",
            Kategorie = WearPartCategory.Kette,
            FahrradKategorien = "Rennrad"
        };
        context.Teilvorlagen.Add(teilVorlage);
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act
        var result = await service.DeleteAsync(teilVorlage.Id);

        // Assert
        Assert.True(result);
        Assert.Equal(0, await context.Teilvorlagen.CountAsync());
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenNotFound()
    {
        // Arrange
        using var context = CreateInMemoryContext("Delete_NotFound");
        var service = new TeilVorlageService(context);

        // Act
        var result = await service.DeleteAsync(id: 9999);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetAllAsync_WithMultipleFilters_CombinesFilters()
    {
        // Arrange: seed entries with various combinations
        using var context = CreateInMemoryContext("GetAll_MultipleFilters");
        context.Teilvorlagen.AddRange(
            new TeilVorlage { Name = "Shimano Ultegra Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad" },
            new TeilVorlage { Name = "Shimano 105 Kette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kette, FahrradKategorien = "Rennrad,Gravel" },
            new TeilVorlage { Name = "SRAM Eagle Kassette", Hersteller = "SRAM", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Mountainbike" },
            new TeilVorlage { Name = "Shimano Eagle Kassette", Hersteller = "Shimano", Kategorie = WearPartCategory.Kassette, FahrradKategorien = "Mountainbike" }
        );
        await context.SaveChangesAsync();

        var service = new TeilVorlageService(context);

        // Act: filter by Shimano + Kette + Rennrad
        var result = await service.GetAllAsync(
            kategorie: WearPartCategory.Kette,
            hersteller: "Shimano",
            fahrradKategorie: "Rennrad"
        );

        // Assert: should only return Shimano Ketten for Rennrad
        Assert.Equal(2, result.Count());
        Assert.All(result, item =>
        {
            Assert.Equal("Shimano", item.Hersteller);
            Assert.Equal(WearPartCategory.Kette, item.Kategorie);
            Assert.Contains("Rennrad", item.FahrradKategorien);
        });
    }

    [Fact]
    public async Task AddAsync_WithOnlyRequiredFields()
    {
        // Arrange
        using var context = CreateInMemoryContext("Add_MinimalFields");
        var service = new TeilVorlageService(context);
        var minimal = new TeilVorlage
        {
            Name = "Minimal Kette",
            Hersteller = "MinimalHersteller",
            Kategorie = WearPartCategory.Kette,
            FahrradKategorien = "Rennrad"
            // No optional fields set
        };

        // Act
        var added = await service.AddAsync(minimal);

        // Assert
        Assert.NotNull(added);
        Assert.Equal("Minimal Kette", added.Name);
        Assert.Null(added.Gruppe);
        Assert.Null(added.Geschwindigkeiten);
        Assert.Null(added.Beschreibung);
    }
}
