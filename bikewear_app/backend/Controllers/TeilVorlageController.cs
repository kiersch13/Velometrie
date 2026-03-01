using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Mvc;

namespace App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeilVorlageController : ControllerBase
    {
        private readonly ITeilVorlageService _service;

        public TeilVorlageController(ITeilVorlageService service)
        {
            _service = service;
        }

        /// <summary>
        /// Gibt alle Teilvorlagen zurück, optional gefiltert nach Kategorie,
        /// Hersteller und/oder Fahrradkategorie.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeilVorlage>>> GetAll(
            [FromQuery] WearPartCategory? kategorie,
            [FromQuery] string? hersteller,
            [FromQuery] string? fahrradKategorie)
        {
            return Ok(await _service.GetAllAsync(kategorie, hersteller, fahrradKategorie));
        }

        /// <summary>
        /// Gibt eine einzelne Teilvorlage anhand der ID zurück.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<TeilVorlage>> GetById(int id)
        {
            var teil = await _service.GetByIdAsync(id);
            if (teil == null) return NotFound();
            return Ok(teil);
        }

        /// <summary>
        /// Gibt die Liste aller verfügbaren Hersteller zurück,
        /// optional gefiltert nach Kategorie und Fahrradkategorie.
        /// </summary>
        [HttpGet("hersteller")]
        public async Task<ActionResult<IEnumerable<string>>> GetHersteller(
            [FromQuery] WearPartCategory? kategorie,
            [FromQuery] string? fahrradKategorie)
        {
            return Ok(await _service.GetHerstellerListAsync(kategorie, fahrradKategorie));
        }

        /// <summary>Fügt eine neue Teilvorlage hinzu.</summary>
        [HttpPost]
        public async Task<ActionResult<TeilVorlage>> Add(TeilVorlage teilVorlage)
        {
            var created = await _service.AddAsync(teilVorlage);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        /// <summary>Aktualisiert eine vorhandene Teilvorlage.</summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<TeilVorlage>> Update(int id, TeilVorlage teilVorlage)
        {
            var updated = await _service.UpdateAsync(id, teilVorlage);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        /// <summary>Löscht eine Teilvorlage.</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
