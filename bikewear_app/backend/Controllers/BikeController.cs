using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Mvc;

namespace App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BikeController : ControllerBase
    {
        private readonly IBikeService _bikeService;

        public BikeController(IBikeService bikeService)
        {
            _bikeService = bikeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bike>>> GetAllBikes()
        {
            return Ok(await _bikeService.GetAllBikesAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Bike>> GetBikeById(int id)
        {
            var bike = await _bikeService.GetBikeByIdAsync(id);
            if (bike == null)
            {
                return NotFound();
            }
            return Ok(bike);
        }

        [HttpPost]
        public async Task<ActionResult<Bike>> AddBike(Bike bike)
        {
            var createdBike = await _bikeService.AddBikeAsync(bike);
            return CreatedAtAction(nameof(GetBikeById), new { id = createdBike.Id }, createdBike);
        }

        [HttpPut("{id}/kilometerstand")]
        public async Task<ActionResult<Bike>> UpdateKilometerstand(int id, [FromBody] int kilometerstand)
        {
            var updatedBike = await _bikeService.UpdateKilometerstandAsync(id, kilometerstand);
            if (updatedBike == null)
            {
                return NotFound();
            }
            return Ok(updatedBike);
        }
    }
}