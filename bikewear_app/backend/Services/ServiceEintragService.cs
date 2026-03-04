using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using Microsoft.EntityFrameworkCore;

namespace App.Services
{
    public class ServiceEintragService : IServiceEintragService
    {
        private readonly AppDbContext _context;

        public ServiceEintragService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ServiceEintrag>> GetByWearPartIdAsync(int wearPartId)
        {
            return await _context.ServiceEintraege
                .Where(s => s.WearPartId == wearPartId)
                .OrderByDescending(s => s.Datum)
                .ToListAsync();
        }

        public async Task<ServiceEintrag?> GetByIdAsync(int id)
        {
            return await _context.ServiceEintraege.FindAsync(id);
        }

        public async Task<ServiceEintrag> AddAsync(ServiceEintrag eintrag)
        {
            _context.ServiceEintraege.Add(eintrag);
            await _context.SaveChangesAsync();
            return eintrag;
        }

        public async Task<ServiceEintrag?> UpdateAsync(int id, ServiceEintrag eintrag)
        {
            var existing = await _context.ServiceEintraege.FindAsync(id);
            if (existing == null)
                return null;

            existing.ServiceTyp = eintrag.ServiceTyp;
            existing.Datum = eintrag.Datum;
            existing.BeiFahrstunden = eintrag.BeiFahrstunden;
            existing.Notizen = eintrag.Notizen;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var eintrag = await _context.ServiceEintraege.FindAsync(id);
            if (eintrag == null)
                return false;

            _context.ServiceEintraege.Remove(eintrag);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
