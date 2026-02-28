using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IBikeService
    {
        Task<IEnumerable<Bike>> GetAllBikesAsync();
        Task<Bike> GetBikeByIdAsync(int id);
        Task<Bike> AddBikeAsync(Bike bike);
        Task<Bike> UpdateKilometerstandAsync(int id, int kilometerstand);
    }
}