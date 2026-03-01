using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BikeController : ControllerBase
    {
        private readonly IBikeService _bikeService;

        public BikeController(IBikeService bikeService)
        {
            _bikeService = bikeService;
        }

        private int GetCurrentUserId()
            => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bike>>> GetAllBikes()
        {
            return Ok(await _bikeService.GetAllBikesAsync(GetCurrentUserId()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Bike>> GetBikeById(int id)
        {
            var bike = await _bikeService.GetBikeByIdAsync(id, GetCurrentUserId());
            if (bike == null)
            {
                return NotFound();
            }
            return Ok(bike);
        }

        [HttpPost]
        public async Task<ActionResult<Bike>> AddBike(Bike bike)
        {
            bike.UserId = GetCurrentUserId();
            var createdBike = await _bikeService.AddBikeAsync(bike);
            return CreatedAtAction(nameof(GetBikeById), new { id = createdBike.Id }, createdBike);
        }

        [HttpPut("{id}/kilometerstand")]
        public async Task<ActionResult<Bike>> UpdateKilometerstand(int id, [FromBody] int kilometerstand)
        {
            var updatedBike = await _bikeService.UpdateKilometerstandAsync(id, GetCurrentUserId(), kilometerstand);
            if (updatedBike == null)
            {
                return NotFound();
            }
            return Ok(updatedBike);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Bike>> UpdateBike(int id, Bike bike)
        {
            var updatedBike = await _bikeService.UpdateBikeAsync(id, GetCurrentUserId(), bike);
            if (updatedBike == null)
            {
                return NotFound();
            }
            return Ok(updatedBike);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBike(int id)
        {
            var deleted = await _bikeService.DeleteBikeAsync(id, GetCurrentUserId());
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpGet("{id}/odometer-at")]
        public async Task<ActionResult<int>> GetOdometerAt(int id, [FromQuery] DateTime date)
        {
            try
            {
                var result = await _bikeService.GetOdometerAtDateAsync(id, GetCurrentUserId(), date);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch
            {
                return BadRequest("Kilometerstand konnte nicht berechnet werden.");
            }
        }
    }
}