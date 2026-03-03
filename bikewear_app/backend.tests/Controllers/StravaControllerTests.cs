using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using App.Controllers;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace BackendTests.Controllers;

/// <summary>
/// Fake implementation of IStravaService for testing.
/// Allows configuration of return values or exceptions for each method.
/// </summary>
file class FakeStravaService : IStravaService
{
    private IEnumerable<StravaGear>? _gearToReturn;
    private Exception? _exceptionToThrow;
    private bool _shouldThrow;

    public void ConfigureGetStravaGearAsync(IEnumerable<StravaGear> gear)
    {
        _gearToReturn = gear;
        _shouldThrow = false;
        _exceptionToThrow = null;
    }

    public void ConfigureGetStravaGearAsyncToThrow(Exception exception)
    {
        _shouldThrow = true;
        _exceptionToThrow = exception;
        _gearToReturn = null;
    }

    public Task<IEnumerable<StravaGear>> GetStravaGearAsync(int userId)
    {
        if (_shouldThrow && _exceptionToThrow != null)
        {
            throw _exceptionToThrow;
        }
        return Task.FromResult(_gearToReturn ?? new List<StravaGear>());
    }

    public Task<double> GetActivityKmOnGearAfterDateAsync(int userId, string stravaGearId, DateTime fromDate)
    {
        return Task.FromResult(0.0);
    }
}

/// <summary>
/// Integration tests for StravaController.
/// Tests the GetGear endpoint which calls IStravaService.GetStravaGearAsync.
/// </summary>
public class StravaControllerTests
{
    private static StravaController CreateController(IStravaService? service = null)
    {
        service ??= new FakeStravaService();
        return new StravaController(service);
    }

    [Fact]
    public async Task GetGear_ReturnsOkWithGearList()
    {
        var service = new FakeStravaService();
        var gear = new List<StravaGear>
        {
            new StravaGear { Id = "1", Name = "Road Bike", KilometerstandKm = 1000 },
            new StravaGear { Id = "2", Name = "Gravel Bike", KilometerstandKm = 500 }
        };
        service.ConfigureGetStravaGearAsync(gear);
        var controller = CreateController(service);

        var result = await controller.GetGear(userId: 1);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsAssignableFrom<IEnumerable<StravaGear>>(ok.Value);
        Assert.Equal(2, returned.Count());
    }

    [Fact]
    public async Task GetGear_ReturnsOkWithEmptyList()
    {
        var service = new FakeStravaService();
        var gear = new List<StravaGear>();
        service.ConfigureGetStravaGearAsync(gear);
        var controller = CreateController(service);

        var result = await controller.GetGear(userId: 1);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var returned = Assert.IsAssignableFrom<IEnumerable<StravaGear>>(ok.Value);
        Assert.Empty(returned);
    }

    [Fact]
    public async Task GetGear_ReturnsBadRequest_WhenServiceThrowsInvalidOperationException()
    {
        var service = new FakeStravaService();
        var errorMessage = "User not found in Strava";
        service.ConfigureGetStravaGearAsyncToThrow(new InvalidOperationException(errorMessage));
        var controller = CreateController(service);

        var result = await controller.GetGear(userId: 1);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal(errorMessage, badRequest.Value);
    }

    [Fact]
    public async Task GetGear_ReturnsBadRequest_WhenServiceThrowsGenericException()
    {
        var service = new FakeStravaService();
        service.ConfigureGetStravaGearAsyncToThrow(new Exception("Network error"));
        var controller = CreateController(service);

        var result = await controller.GetGear(userId: 1);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal("Strava-Fahrräder konnten nicht abgerufen werden.", badRequest.Value);
    }
}
