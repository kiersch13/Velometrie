using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IBikeService
    {
        Task<IEnumerable<Bike>> GetAllBikesAsync();
        Task<Bike?> GetBikeByIdAsync(int id);
        Task<Bike> AddBikeAsync(Bike bike);
        Task<Bike?> UpdateKilometerstandAsync(int id, int kilometerstand);
        Task<Bike?> UpdateBikeAsync(int id, Bike bike);
        Task<bool> DeleteBikeAsync(int id);
        Task<int?> GetOdometerAtDateAsync(int bikeId, int userId, DateTime date);
    }
}