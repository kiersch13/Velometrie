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
            existing.StravaId = bike.StravaId;
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
            return bike.Kilometerstand - (int)Math.Round(kmSince);
        }
    }
}