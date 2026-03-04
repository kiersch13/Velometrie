using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IServiceEintragService
    {
        Task<IEnumerable<ServiceEintrag>> GetByWearPartIdAsync(int wearPartId);
        Task<ServiceEintrag?> GetByIdAsync(int id);
        Task<ServiceEintrag> AddAsync(ServiceEintrag eintrag);
        Task<ServiceEintrag?> UpdateAsync(int id, ServiceEintrag eintrag);
        Task<bool> DeleteAsync(int id);
    }
}
