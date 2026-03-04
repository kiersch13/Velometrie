using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IWearPartGruppeService
    {
        Task<IEnumerable<WearPartGruppe>> GetAllByBikeAsync(int radId);
        Task<WearPartGruppe?> GetByIdAsync(int id);
        Task<WearPartGruppe> AddAsync(WearPartGruppe gruppe);
        Task<WearPartGruppe?> UpdateAsync(int id, WearPartGruppe gruppe);
        Task<bool> DeleteAsync(int id);
    }
}
