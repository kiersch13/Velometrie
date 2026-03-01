using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IStravaService
    {
        Task<IEnumerable<StravaGear>> GetStravaGearAsync(int userId);
        Task<double> GetActivityKmOnGearAfterDateAsync(int userId, string stravaGearId, DateTime fromDate);
    }
}
