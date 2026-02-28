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

        public BikeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Bike>> GetAllBikesAsync()
        {
            return await _context.Rads.ToListAsync();
        }

        public async Task<Bike> GetBikeByIdAsync(int id)
        {
            return await _context.Rads.FindAsync(id);
        }

        public async Task<Bike> AddBikeAsync(Bike bike)
        {
            _context.Rads.Add(bike);
            await _context.SaveChangesAsync();
            return bike;
        }

        public async Task<Bike> UpdateKilometerstandAsync(int id, int kilometerstand)
        {
            var bike = await _context.Rads.FindAsync(id);
            if (bike == null)
            {
                return null;
            }
            bike.Kilometerstand = kilometerstand;
            await _context.SaveChangesAsync();
            return bike;
        }
    }
}