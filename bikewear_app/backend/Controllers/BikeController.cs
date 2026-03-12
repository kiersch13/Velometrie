using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BikeController : ControllerBase
    {
        private const long MaxPhotoBytes = 5 * 1024 * 1024;
        private static readonly HashSet<string> AllowedPhotoMimeTypes =
        [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        private readonly IBikeService _bikeService;
        private readonly IR2StorageService _r2StorageService;
        private readonly ILogger<BikeController> _logger;

        public BikeController(IBikeService bikeService, IR2StorageService r2StorageService, ILogger<BikeController> logger)
        {
            _bikeService = bikeService;
            _r2StorageService = r2StorageService;
            _logger = logger;
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

        [HttpGet("{id}/weekly-avg-km")]
        public async Task<ActionResult<double?>> GetWeeklyAvgKm(int id)
        {
            var result = await _bikeService.GetWeeklyAvgKmAsync(id, GetCurrentUserId());
            return Ok(result);
        }

        [HttpPost("{id}/photo")]
        public async Task<ActionResult<Bike>> UploadBikePhoto(int id, [FromForm] IFormFile? file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Bitte eine Bilddatei auswählen.");
                }

                if (file.Length > MaxPhotoBytes)
                {
                    return BadRequest("Die Datei ist zu groß (max. 5 MB).");
                }

                if (!AllowedPhotoMimeTypes.Contains(file.ContentType))
                {
                    return BadRequest("Nur JPEG, PNG oder WEBP sind erlaubt.");
                }

                var userId = GetCurrentUserId();
                var bike = await _bikeService.GetBikeByIdAsync(id, userId);
                if (bike == null)
                {
                    return NotFound();
                }

                if (!string.IsNullOrWhiteSpace(bike.FotoStorageKey))
                {
                    await _r2StorageService.DeleteAsync(bike.FotoStorageKey);
                }

                var originalFileName = Path.GetFileName(file.FileName);
                var extension = Path.GetExtension(originalFileName);
                var safeExtension = string.IsNullOrWhiteSpace(extension) ? string.Empty : extension.ToLowerInvariant();
                var storageKey = $"bikes/{id}/photo-{Guid.NewGuid():N}{safeExtension}";

                await using var stream = file.OpenReadStream();
                await _r2StorageService.UploadAsync(storageKey, stream, file.ContentType, file.Length);

                var updatedBike = await _bikeService.UpdateBikePhotoAsync(
                    id,
                    userId,
                    storageKey,
                    originalFileName,
                    file.ContentType,
                    file.Length,
                    DateTime.UtcNow);

                if (updatedBike == null)
                {
                    return NotFound();
                }

                return Ok(updatedBike);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Bike photo upload failed for bike {BikeId}", id);
                return StatusCode(500, "Foto-Upload fehlgeschlagen. Bitte R2-Konfiguration prüfen.");
            }
        }

        [HttpGet("{id}/photo")]
        public async Task<IActionResult> GetBikePhoto(int id)
        {
            try
            {
                var bike = await _bikeService.GetBikeByIdAsync(id, GetCurrentUserId());
                if (bike == null || string.IsNullOrWhiteSpace(bike.FotoStorageKey))
                {
                    return NotFound();
                }

                var stored = await _r2StorageService.GetAsync(bike.FotoStorageKey);
                if (stored == null)
                {
                    return NotFound();
                }

                return File(stored.Content, stored.ContentType, enableRangeProcessing: true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Bike photo fetch failed for bike {BikeId}", id);
                return StatusCode(500, "Foto konnte nicht geladen werden. Bitte R2-Konfiguration prüfen.");
            }
        }

        [HttpDelete("{id}/photo")]
        public async Task<ActionResult<Bike>> DeleteBikePhoto(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var bike = await _bikeService.GetBikeByIdAsync(id, userId);
                if (bike == null)
                {
                    return NotFound();
                }

                if (!string.IsNullOrWhiteSpace(bike.FotoStorageKey))
                {
                    await _r2StorageService.DeleteAsync(bike.FotoStorageKey);
                }

                var updatedBike = await _bikeService.RemoveBikePhotoAsync(id, userId);
                if (updatedBike == null)
                {
                    return NotFound();
                }

                return Ok(updatedBike);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Bike photo delete failed for bike {BikeId}", id);
                return StatusCode(500, "Foto konnte nicht gelöscht werden. Bitte R2-Konfiguration prüfen.");
            }
        }
    }
}