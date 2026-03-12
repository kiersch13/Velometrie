using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using Microsoft.EntityFrameworkCore;

namespace App.Services
{
    public class BikeService : IBikeService
    {
        private readonly AppDbContext _context;
        private readonly IStravaService _stravaService;

        public BikeService(AppDbContext context, IStravaService stravaService)
        {
            _context = context;
            _stravaService = stravaService;
        }

        public async Task<IEnumerable<Bike>> GetAllBikesAsync(int userId)
        {
            return await _context.Rads.Where(b => b.UserId == userId).ToListAsync();
        }

        public async Task<Bike?> GetBikeByIdAsync(int id, int userId)
        {
            return await _context.Rads.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        }

        public async Task<Bike> AddBikeAsync(Bike bike)
        {
            _context.Rads.Add(bike);
            await _context.SaveChangesAsync();
            return bike;
        }

        public async Task<Bike?> UpdateKilometerstandAsync(int id, int userId, int kilometerstand)
        {
            var bike = await _context.Rads.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (bike == null)
            {
                return null;
            }
            bike.Kilometerstand = kilometerstand;
            await _context.SaveChangesAsync();
            return bike;
        }

        public async Task<Bike?> UpdateBikeAsync(int id, int userId, Bike bike)
        {
            var existing = await _context.Rads.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (existing == null)
            {
                return null;
            }
            existing.Name = bike.Name;
            existing.Kategorie = bike.Kategorie;
            existing.Kilometerstand = bike.Kilometerstand;
            existing.Fahrstunden = bike.Fahrstunden;
            existing.StravaId = bike.StravaId;
            existing.IndoorKilometerstand = bike.IndoorKilometerstand;
            existing.Sattelhoehe = bike.Sattelhoehe;
            existing.Sattelversatz = bike.Sattelversatz;
            existing.Vorbaulaenge = bike.Vorbaulaenge;
            existing.Vorbauwinkel = bike.Vorbauwinkel;
            existing.Kurbellaenge = bike.Kurbellaenge;
            existing.Lenkerbreite = bike.Lenkerbreite;
            existing.Spacer = bike.Spacer;
            existing.Reach = bike.Reach;
            existing.Stack = bike.Stack;
            existing.Radstand = bike.Radstand;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<Bike?> UpdateBikePhotoAsync(int id, int userId, string storageKey, string fileName, string mimeType, long fileSize, DateTime updatedAtUtc)
        {
            var existing = await _context.Rads.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (existing == null)
            {
                return null;
            }

            existing.FotoStorageKey = storageKey;
            existing.FotoDateiname = fileName;
            existing.FotoMimeType = mimeType;
            existing.FotoGroesseBytes = fileSize;
            existing.FotoAktualisiertAm = updatedAtUtc;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<Bike?> RemoveBikePhotoAsync(int id, int userId)
        {
            var existing = await _context.Rads.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (existing == null)
            {
                return null;
            }

            existing.FotoStorageKey = null;
            existing.FotoDateiname = null;
            existing.FotoMimeType = null;
            existing.FotoGroesseBytes = null;
            existing.FotoAktualisiertAm = null;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteBikeAsync(int id, int userId)
        {
            var bike = await _context.Rads.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (bike == null)
            {
                return false;
            }
            _context.Rads.Remove(bike);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int?> GetOdometerAtDateAsync(int bikeId, int userId, DateTime date)
        {
            var bike = await _context.Rads.FirstOrDefaultAsync(b => b.Id == bikeId && b.UserId == userId);
            if (bike == null) return null;

            if (string.IsNullOrEmpty(bike.StravaId))
                return bike.Kilometerstand;

            var kmSince = await _stravaService.GetActivityKmOnGearAfterDateAsync(userId, bike.StravaId, date);
            return Math.Max(0, bike.Kilometerstand - (int)Math.Round(kmSince));
        }

        public async Task<double?> GetWeeklyAvgKmAsync(int bikeId, int userId)
        {
            var bike = await _context.Rads.FirstOrDefaultAsync(b => b.Id == bikeId && b.UserId == userId);
            if (bike == null) return null;

            if (string.IsNullOrEmpty(bike.StravaId)) return null;

            var sixWeeksAgo = DateTime.UtcNow.AddDays(-42);
            var kmInSixWeeks = await _stravaService.GetActivityKmOnGearAfterDateAsync(userId, bike.StravaId, sixWeeksAgo);
            return kmInSixWeeks / 6.0;
        }
    }
}