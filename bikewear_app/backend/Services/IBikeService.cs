using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IBikeService
    {
        Task<IEnumerable<Bike>> GetAllBikesAsync(int userId);
        Task<Bike?> GetBikeByIdAsync(int id, int userId);
        Task<Bike> AddBikeAsync(Bike bike);
        Task<Bike?> UpdateKilometerstandAsync(int id, int userId, int kilometerstand);
        Task<Bike?> UpdateBikeAsync(int id, int userId, Bike bike);
        Task<bool> DeleteBikeAsync(int id, int userId);
        Task<int?> GetOdometerAtDateAsync(int bikeId, int userId, DateTime date);
    }
}