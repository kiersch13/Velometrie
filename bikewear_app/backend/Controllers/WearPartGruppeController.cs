using System.Collections.Generic;
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
    public class WearPartGruppeController : ControllerBase
    {
        private readonly IWearPartGruppeService _gruppeService;

        public WearPartGruppeController(IWearPartGruppeService gruppeService)
        {
            _gruppeService = gruppeService;
        }

        [HttpGet("bike/{radId}")]
        public async Task<ActionResult<IEnumerable<WearPartGruppe>>> GetByBike(int radId)
        {
            return Ok(await _gruppeService.GetAllByBikeAsync(radId));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WearPartGruppe>> GetById(int id)
        {
            var gruppe = await _gruppeService.GetByIdAsync(id);
            if (gruppe == null)
            {
                return NotFound();
            }
            return Ok(gruppe);
        }

        [HttpPost]
        public async Task<ActionResult<WearPartGruppe>> Add(WearPartGruppe gruppe)
        {
            var created = await _gruppeService.AddAsync(gruppe);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<WearPartGruppe>> Update(int id, WearPartGruppe gruppe)
        {
            var updated = await _gruppeService.UpdateAsync(id, gruppe);
            if (updated == null)
            {
                return NotFound();
            }
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _gruppeService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
