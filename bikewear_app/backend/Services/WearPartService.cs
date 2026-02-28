using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using Microsoft.EntityFrameworkCore;

namespace App.Services
{
    public class WearPartService : IWearPartService
    {
        private readonly AppDbContext _context;

        public WearPartService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WearPart>> GetAllWearPartsAsync()
        {
            return await _context.Verschleissteile.ToListAsync();
        }

        public async Task<IEnumerable<WearPart>> GetWearPartsByBikeIdAsync(int radId)
        {
            return await _context.Verschleissteile.Where(w => w.RadId == radId).ToListAsync();
        }

        public async Task<WearPart> GetWearPartByIdAsync(int id)
        {
            return await _context.Verschleissteile.FindAsync(id);
        }

        public async Task<WearPart> AddWearPartAsync(WearPart wearPart)
        {
            _context.Verschleissteile.Add(wearPart);
            await _context.SaveChangesAsync();
            return wearPart;
        }
    }
}