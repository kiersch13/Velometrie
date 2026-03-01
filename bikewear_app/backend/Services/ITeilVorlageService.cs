using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface ITeilVorlageService
    {
        Task<IEnumerable<TeilVorlage>> GetAllAsync(
            WearPartCategory? kategorie = null,
            string? hersteller = null,
            string? fahrradKategorie = null);

        Task<TeilVorlage?> GetByIdAsync(int id);

        Task<IEnumerable<string>> GetHerstellerListAsync(
            WearPartCategory? kategorie = null,
            string? fahrradKategorie = null);

        Task<TeilVorlage> AddAsync(TeilVorlage teilVorlage);

        Task<TeilVorlage?> UpdateAsync(int id, TeilVorlage teilVorlage);

        Task<bool> DeleteAsync(int id);
    }
}
