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
    }
}