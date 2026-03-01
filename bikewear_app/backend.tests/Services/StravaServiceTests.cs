using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using App.Models;
using App.Services;
using Xunit;

namespace BackendTests.Services;

// ---------------------------------------------------------------------------
// Fakes (file-scoped — not visible outside this file)
// ---------------------------------------------------------------------------

/// <summary>Returns a pre-configured HTTP response for every request.</summary>
file class FakeHandler : HttpMessageHandler
{
    private readonly Queue<HttpResponseMessage> _responses;

    public FakeHandler(params HttpResponseMessage[] responses)
        => _responses = new Queue<HttpResponseMessage>(responses);

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage _, CancellationToken __)
        => Task.FromResult(_responses.Count > 0 ? _responses.Dequeue() : new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent("[]", Encoding.UTF8, "application/json")
        });
}

file class FakeHttpClientFactory : IHttpClientFactory
{
    private readonly HttpMessageHandler _handler;
    public FakeHttpClientFactory(HttpMessageHandler handler) => _handler = handler;
    public HttpClient CreateClient(string name) => new(_handler);
}

file class FakeAuthService : IAuthService
{
    private readonly string _token;
    public FakeAuthService(string token = "fake-token") => _token = token;
    public Task<string> GetFreshAccessTokenAsync(int userId) => Task.FromResult(_token);
    public Task<User> LoginAsync(string stravaId, string accessToken) => throw new NotImplementedException();
    public Task LogoutAsync(int userId) => throw new NotImplementedException();
    public string GetStravaRedirectUrl() => throw new NotImplementedException();
    public Task<User> StravaCallbackAsync(string code) => throw new NotImplementedException();
}

// ---------------------------------------------------------------------------
// StravaService tests
// ---------------------------------------------------------------------------

public class StravaServiceTests
{
    private static StravaService BuildService(IHttpClientFactory factory, string token = "fake-token")
        => new(new FakeAuthService(token), factory);

    // ---- GetStravaGearAsync -----------------------------------------------

    [Fact]
    public async Task GetStravaGearAsync_ParsesBikesFromAthleteEndpoint()
    {
        // Arrange
        const string athleteJson = """
            {
              "id": 1,
              "bikes": [
                { "id": "b100", "name": "Rennmaschine", "distance": 5000000 },
                { "id": "b200", "name": "Gravelbike",   "distance": 2500000 }
              ]
            }
            """;

        var factory = new FakeHttpClientFactory(new FakeHandler(
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(athleteJson, Encoding.UTF8, "application/json")
            }
        ));
        var service = BuildService(factory);

        // Act
        var gear = await service.GetStravaGearAsync(userId: 1);
        var list = new System.Collections.Generic.List<StravaGear>(gear);

        // Assert
        Assert.Equal(2, list.Count);
        Assert.Equal("b100", list[0].Id);
        Assert.Equal("Rennmaschine", list[0].Name);
        Assert.Equal(5000, list[0].KilometerstandKm);  // 5 000 000 m ÷ 1000
        Assert.Equal("b200", list[1].Id);
        Assert.Equal(2500, list[1].KilometerstandKm);
    }

    [Fact]
    public async Task GetStravaGearAsync_ReturnsEmpty_WhenNoBikesProperty()
    {
        // Arrange
        var factory = new FakeHttpClientFactory(new FakeHandler(
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{\"id\":1}", Encoding.UTF8, "application/json")
            }
        ));
        var service = BuildService(factory);

        // Act
        var gear = await service.GetStravaGearAsync(userId: 1);

        // Assert
        Assert.Empty(gear);
    }

    // ---- GetActivityKmOnGearAfterDateAsync --------------------------------

    [Fact]
    public async Task GetActivityKmOnGearAfterDateAsync_SumsDistanceForMatchingGear()
    {
        // Arrange: one page with two activities — only the one with our gear_id counts
        const string activitiesJson = """
            [
              { "id": 1, "gear_id": "b123", "distance": 50000 },
              { "id": 2, "gear_id": "b999", "distance": 30000 }
            ]
            """;

        // Second page is empty → ends pagination
        var factory = new FakeHttpClientFactory(new FakeHandler(
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(activitiesJson, Encoding.UTF8, "application/json")
            },
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            }
        ));
        var service = BuildService(factory);

        // Act
        var km = await service.GetActivityKmOnGearAfterDateAsync(
            userId: 1, stravaGearId: "b123", fromDate: DateTime.UtcNow.AddMonths(-3));

        // Assert: only 50 000 m → 50 km
        Assert.Equal(50.0, km);
    }

    [Fact]
    public async Task GetActivityKmOnGearAfterDateAsync_HandlesMultiplePages()
    {
        // Arrange: page 1 has one matching activity, page 2 has another, page 3 is empty
        const string page1 = """[{ "id": 1, "gear_id": "b123", "distance": 100000 }]""";
        const string page2 = """[{ "id": 2, "gear_id": "b123", "distance": 200000 }]""";

        var factory = new FakeHttpClientFactory(new FakeHandler(
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(page1, Encoding.UTF8, "application/json")
            },
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(page2, Encoding.UTF8, "application/json")
            },
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            }
        ));
        var service = BuildService(factory);

        // Act
        var km = await service.GetActivityKmOnGearAfterDateAsync(
            userId: 1, stravaGearId: "b123", fromDate: DateTime.UtcNow.AddMonths(-6));

        // Assert: 100 000 + 200 000 = 300 000 m → 300 km
        Assert.Equal(300.0, km);
    }

    [Fact]
    public async Task GetActivityKmOnGearAfterDateAsync_ReturnsZero_WhenNoMatchingActivities()
    {
        // Arrange: two activities with different gear_id
        const string activitiesJson = """
            [
              { "id": 1, "gear_id": "b999", "distance": 80000 },
              { "id": 2, "gear_id": "b888", "distance": 40000 }
            ]
            """;

        var factory = new FakeHttpClientFactory(new FakeHandler(
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(activitiesJson, Encoding.UTF8, "application/json")
            },
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            }
        ));
        var service = BuildService(factory);

        // Act
        var km = await service.GetActivityKmOnGearAfterDateAsync(
            userId: 1, stravaGearId: "b123", fromDate: DateTime.UtcNow.AddMonths(-1));

        // Assert
        Assert.Equal(0.0, km);
    }
}
