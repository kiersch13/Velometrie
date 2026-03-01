using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App.Data;
using App.Models;
using Microsoft.EntityFrameworkCore;

namespace App.Services
{
    public class TeilVorlageService : ITeilVorlageService
    {
        private readonly AppDbContext _context;

        public TeilVorlageService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TeilVorlage>> GetAllAsync(
            WearPartCategory? kategorie = null,
            string? hersteller = null,
            string? fahrradKategorie = null)
        {
            var query = _context.Teilvorlagen.AsQueryable();

            if (kategorie.HasValue)
                query = query.Where(t => t.Kategorie == kategorie.Value);

            if (!string.IsNullOrWhiteSpace(hersteller))
                query = query.Where(t => t.Hersteller == hersteller);

            if (!string.IsNullOrWhiteSpace(fahrradKategorie))
                query = query.Where(t => t.FahrradKategorien.Contains(fahrradKategorie));

            return await query.OrderBy(t => t.Hersteller).ThenBy(t => t.Name).ToListAsync();
        }

        public async Task<TeilVorlage?> GetByIdAsync(int id)
        {
            return await _context.Teilvorlagen.FindAsync(id);
        }

        public async Task<IEnumerable<string>> GetHerstellerListAsync(
            WearPartCategory? kategorie = null,
            string? fahrradKategorie = null)
        {
            var query = _context.Teilvorlagen.AsQueryable();

            if (kategorie.HasValue)
                query = query.Where(t => t.Kategorie == kategorie.Value);

            if (!string.IsNullOrWhiteSpace(fahrradKategorie))
                query = query.Where(t => t.FahrradKategorien.Contains(fahrradKategorie));

            return await query
                .Select(t => t.Hersteller)
                .Distinct()
                .OrderBy(h => h)
                .ToListAsync();
        }

        public async Task<TeilVorlage> AddAsync(TeilVorlage teilVorlage)
        {
            _context.Teilvorlagen.Add(teilVorlage);
            await _context.SaveChangesAsync();
            return teilVorlage;
        }

        public async Task<TeilVorlage?> UpdateAsync(int id, TeilVorlage teilVorlage)
        {
            var existing = await _context.Teilvorlagen.FindAsync(id);
            if (existing == null) return null;

            existing.Name = teilVorlage.Name;
            existing.Hersteller = teilVorlage.Hersteller;
            existing.Kategorie = teilVorlage.Kategorie;
            existing.Gruppe = teilVorlage.Gruppe;
            existing.Geschwindigkeiten = teilVorlage.Geschwindigkeiten;
            existing.FahrradKategorien = teilVorlage.FahrradKategorien;
            existing.Beschreibung = teilVorlage.Beschreibung;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Teilvorlagen.FindAsync(id);
            if (existing == null) return false;

            _context.Teilvorlagen.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
