using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Mvc;

namespace App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WearPartController : ControllerBase
    {
        private readonly IWearPartService _wearPartService;

        public WearPartController(IWearPartService wearPartService)
        {
            _wearPartService = wearPartService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WearPart>>> GetAllWearParts()
        {
            return Ok(await _wearPartService.GetAllWearPartsAsync());
        }

        [HttpGet("bike/{radId}")]
        public async Task<ActionResult<IEnumerable<WearPart>>> GetWearPartsByBike(int radId)
        {
            return Ok(await _wearPartService.GetWearPartsByBikeIdAsync(radId));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WearPart>> GetWearPartById(int id)
        {
            var wearPart = await _wearPartService.GetWearPartByIdAsync(id);
            if (wearPart == null)
            {
                return NotFound();
            }
            return Ok(wearPart);
        }

        [HttpPost]
        public async Task<ActionResult<WearPart>> AddWearPart(WearPart wearPart)
        {
            var createdWearPart = await _wearPartService.AddWearPartAsync(wearPart);
            return CreatedAtAction(nameof(GetWearPartById), new { id = createdWearPart.Id }, createdWearPart);
        }
    }
}