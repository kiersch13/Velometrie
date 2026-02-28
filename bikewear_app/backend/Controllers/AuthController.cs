using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Mvc;

namespace App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] User user)
        {
            var authenticatedUser = await _authService.LoginAsync(user.StravaId, user.AccessToken);
            if (authenticatedUser == null)
            {
                return BadRequest("Login failed");
            }
            return Ok(authenticatedUser);
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout([FromBody] int userId)
        {
            await _authService.LogoutAsync(userId);
            return Ok("Logged out successfully");
        }

        [HttpGet("strava/redirect-url")]
        public ActionResult<object> GetStravaRedirectUrl()
        {
            var url = _authService.GetStravaRedirectUrl();
            return Ok(new { url });
        }

        [HttpPost("strava/callback")]
        public async Task<ActionResult<User>> StravaCallback([FromBody] StravaCallbackRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Code))
            {
                return BadRequest("Authorization code is required");
            }
            try
            {
                var user = await _authService.StravaCallbackAsync(request.Code);
                return Ok(user);
            }
            catch
            {
                return BadRequest("Strava-Authentifizierung fehlgeschlagen");
            }
        }

        [HttpGet("strava/bikes")]
        public async Task<ActionResult<IEnumerable<StravaGear>>> GetStravaBikes([FromQuery] int userId)
        {
            try
            {
                var bikes = await _authService.GetStravaGearAsync(userId);
                return Ok(bikes);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch
            {
                return BadRequest("Strava-Fahrräder konnten nicht abgerufen werden.");
            }
        }
    }

    public class StravaCallbackRequest
    {
        public string Code { get; set; } = string.Empty;
    }
}