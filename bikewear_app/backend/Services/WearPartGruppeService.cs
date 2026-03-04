using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using Microsoft.EntityFrameworkCore;

namespace App.Services
{
    public class WearPartGruppeService : IWearPartGruppeService
    {
        private readonly AppDbContext _context;

        public WearPartGruppeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WearPartGruppe>> GetAllByBikeAsync(int radId)
        {
            return await _context.WearPartGruppen
                .Where(g => g.RadId == radId)
                .ToListAsync();
        }

        public async Task<WearPartGruppe?> GetByIdAsync(int id)
        {
            return await _context.WearPartGruppen.FindAsync(id);
        }

        public async Task<WearPartGruppe> AddAsync(WearPartGruppe gruppe)
        {
            _context.WearPartGruppen.Add(gruppe);
            await _context.SaveChangesAsync();
            return gruppe;
        }

        public async Task<WearPartGruppe?> UpdateAsync(int id, WearPartGruppe gruppe)
        {
            var existing = await _context.WearPartGruppen.FindAsync(id);
            if (existing == null)
            {
                return null;
            }
            existing.Name = gruppe.Name;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var gruppe = await _context.WearPartGruppen.FindAsync(id);
            if (gruppe == null)
            {
                return false;
            }
            _context.WearPartGruppen.Remove(gruppe);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
