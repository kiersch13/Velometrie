using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IWearPartService
    {
        Task<IEnumerable<WearPart>> GetAllWearPartsAsync();
        Task<IEnumerable<WearPart>> GetWearPartsByBikeIdAsync(int radId);
        Task<WearPart?> GetWearPartByIdAsync(int id);
        Task<WearPart> AddWearPartAsync(WearPart wearPart);
        Task<WearPart?> UpdateWearPartAsync(int id, WearPart wearPart);
        Task<bool> DeleteWearPartAsync(int id);
    }
}