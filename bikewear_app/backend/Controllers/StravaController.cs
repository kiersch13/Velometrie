using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Mvc;

namespace App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StravaController : ControllerBase
    {
        private readonly IStravaService _stravaService;

        public StravaController(IStravaService stravaService)
        {
            _stravaService = stravaService;
        }

        [HttpGet("bikes")]
        public async Task<ActionResult<IEnumerable<StravaGear>>> GetGear([FromQuery] int userId)
        {
            try
            {
                var bikes = await _stravaService.GetStravaGearAsync(userId);
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
}
