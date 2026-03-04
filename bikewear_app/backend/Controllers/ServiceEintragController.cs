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
    public class ServiceEintragController : ControllerBase
    {
        private readonly IServiceEintragService _service;

        public ServiceEintragController(IServiceEintragService service)
        {
            _service = service;
        }

        [HttpGet("wearpart/{wearPartId}")]
        public async Task<ActionResult<IEnumerable<ServiceEintrag>>> GetByWearPart(int wearPartId)
        {
            return Ok(await _service.GetByWearPartIdAsync(wearPartId));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceEintrag>> GetById(int id)
        {
            var eintrag = await _service.GetByIdAsync(id);
            if (eintrag == null)
                return NotFound();
            return Ok(eintrag);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceEintrag>> Add(ServiceEintrag eintrag)
        {
            var created = await _service.AddAsync(eintrag);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceEintrag>> Update(int id, ServiceEintrag eintrag)
        {
            var updated = await _service.UpdateAsync(id, eintrag);
            if (updated == null)
                return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}
