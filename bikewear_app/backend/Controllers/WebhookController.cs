using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace App.Controllers
{
    [ApiController]
    [Route("api/webhook")]
    public class WebhookController : ControllerBase
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConfiguration _config;
        private readonly ILogger<WebhookController> _logger;

        public WebhookController(
            IServiceScopeFactory scopeFactory,
            IConfiguration config,
            ILogger<WebhookController> logger)
        {
            _scopeFactory = scopeFactory;
            _config = config;
            _logger = logger;
        }

        // Strava subscription validation (GET)
        [HttpGet("strava")]
        public ActionResult StravaValidation(
            [FromQuery(Name = "hub.mode")] string mode,
            [FromQuery(Name = "hub.challenge")] string challenge,
            [FromQuery(Name = "hub.verify_token")] string verifyToken)
        {
            var expectedToken = _config["Strava:WebhookVerifyToken"];
            if (verifyToken != expectedToken)
                return Unauthorized();

            return Ok(new Dictionary<string, string> { { "hub.challenge", challenge } });
        }

        // Strava event handler (POST)
        // Responds immediately (Strava requires a response within 2 seconds).
        // A fresh DI scope is created inside Task.Run to avoid accessing a disposed scoped DbContext.
        [HttpPost("strava")]
        public ActionResult StravaEvent([FromBody] StravaWebhookEvent webhookEvent)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var svc = scope.ServiceProvider.GetRequiredService<IStravaWebhookService>();
                    await svc.HandleEventAsync(webhookEvent);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Unhandled error processing Strava webhook event.");
                }
            });

            return Ok();
        }
    }
}
