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
            existing.Position = wearPart.Position;
            existing.EinbauKilometerstand = wearPart.EinbauKilometerstand;
            existing.AusbauKilometerstand = wearPart.AusbauKilometerstand;
            existing.EinbauDatum = wearPart.EinbauDatum;
            existing.AusbauDatum = wearPart.AusbauDatum;
            existing.EinbauFahrstunden = wearPart.EinbauFahrstunden;
            existing.AusbauFahrstunden = wearPart.AusbauFahrstunden;
            existing.Notizen = wearPart.Notizen;
            existing.GruppeId = wearPart.GruppeId;
            existing.ReifenBreiteMm = wearPart.ReifenBreiteMm;
            existing.ReifenBreiteZoll = wearPart.ReifenBreiteZoll;
            existing.ReifenDruckBar = wearPart.ReifenDruckBar;
            existing.ReifenDruckPsi = wearPart.ReifenDruckPsi;
            existing.IndoorIgnorieren = wearPart.IndoorIgnorieren;
            existing.EinbauIndoorKilometerstand = wearPart.EinbauIndoorKilometerstand;
            existing.AusbauIndoorKilometerstand = wearPart.AusbauIndoorKilometerstand;
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

        public async Task<WearPart?> MoveWearPartAsync(int id, MoveWearPartRequest request, int userId)
        {
            var existing = await _context.Verschleissteile.FindAsync(id);
            if (existing == null)
            {
                return null;
            }

            // Validate target bike exists and belongs to the same user
            var targetBike = await _context.Rads.FirstOrDefaultAsync(b => b.Id == request.ZielRadId && b.UserId == userId);
            if (targetBike == null)
            {
                return null;
            }

            // Look up the source bike for indoor km snapshot
            var sourceBike = await _context.Rads.FirstOrDefaultAsync(b => b.Id == existing.RadId);

            // Close the current installation
            existing.AusbauKilometerstand = request.AusbauKilometerstand;
            existing.AusbauDatum = request.AusbauDatum;
            existing.AusbauFahrstunden = request.AusbauFahrstunden;
            existing.AusbauIndoorKilometerstand = sourceBike?.IndoorKilometerstand ?? 0;

            // Create a new installation on the target bike
            var newPart = new WearPart
            {
                RadId = request.ZielRadId,
                Name = existing.Name,
                Kategorie = existing.Kategorie,
                Position = existing.Position,
                EinbauKilometerstand = request.EinbauKilometerstand,
                EinbauDatum = request.EinbauDatum,
                EinbauFahrstunden = request.EinbauFahrstunden,
                Notizen = existing.Notizen,
                ReifenBreiteMm = existing.ReifenBreiteMm,
                ReifenBreiteZoll = existing.ReifenBreiteZoll,
                ReifenDruckBar = existing.ReifenDruckBar,
                ReifenDruckPsi = existing.ReifenDruckPsi,
                VorgaengerId = existing.Id,
                IndoorIgnorieren = existing.IndoorIgnorieren,
                EinbauIndoorKilometerstand = targetBike.IndoorKilometerstand,
                // GruppeId intentionally null — groups are per-bike
            };

            _context.Verschleissteile.Add(newPart);
            await _context.SaveChangesAsync();
            return newPart;
        }

        public async Task<IEnumerable<WearPart>> GetWearPartHistoryAsync(int id)
        {
            var part = await _context.Verschleissteile.FindAsync(id);
            if (part == null)
            {
                return Enumerable.Empty<WearPart>();
            }

            var chain = new List<WearPart>();

            // Walk backwards to find the root
            var current = part;
            while (current.VorgaengerId != null)
            {
                var predecessor = await _context.Verschleissteile.FindAsync(current.VorgaengerId);
                if (predecessor == null) break;
                chain.Insert(0, predecessor);
                current = predecessor;
            }

            // Add the queried part
            chain.Add(part);

            // Walk forwards to find successors
            var currentId = part.Id;
            while (true)
            {
                var successor = await _context.Verschleissteile
                    .FirstOrDefaultAsync(w => w.VorgaengerId == currentId);
                if (successor == null) break;
                chain.Add(successor);
                currentId = successor.Id;
            }

            return chain;
        }
    }
}