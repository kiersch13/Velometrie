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

        public async Task<WearPart?> GetWearPartByIdAsync(int id)
        {
            return await _context.Verschleissteile.FindAsync(id);
        }

        public async Task<WearPart> AddWearPartAsync(WearPart wearPart)
        {
            _context.Verschleissteile.Add(wearPart);
            await _context.SaveChangesAsync();
            return wearPart;
        }

        public async Task<WearPart?> UpdateWearPartAsync(int id, WearPart wearPart)
        {
            var existing = await _context.Verschleissteile.FindAsync(id);
            if (existing == null)
            {
                return null;
            }
            existing.Name = wearPart.Name;
            existing.Kategorie = wearPart.Kategorie;
            existing.EinbauKilometerstand = wearPart.EinbauKilometerstand;
            existing.AusbauKilometerstand = wearPart.AusbauKilometerstand;
            existing.EinbauDatum = wearPart.EinbauDatum;
            existing.AusbauDatum = wearPart.AusbauDatum;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteWearPartAsync(int id)
        {
            var wearPart = await _context.Verschleissteile.FindAsync(id);
            if (wearPart == null)
            {
                return false;
            }
            _context.Verschleissteile.Remove(wearPart);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}