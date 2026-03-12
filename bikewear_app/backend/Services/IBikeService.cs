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
        Task<Bike?> UpdateBikePhotoAsync(int id, int userId, string storageKey, string fileName, string mimeType, long fileSize, DateTime updatedAtUtc);
        Task<Bike?> RemoveBikePhotoAsync(int id, int userId);
        Task<bool> DeleteBikeAsync(int id, int userId);
        Task<int?> GetOdometerAtDateAsync(int bikeId, int userId, DateTime date);
        Task<double?> GetWeeklyAvgKmAsync(int bikeId, int userId);
    }
}