using System.Collections.Generic;
using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IAuthService
    {
        Task<User> LoginAsync(string stravaId, string accessToken);
        Task LogoutAsync(int userId);
        string GetStravaRedirectUrl();
        Task<User> StravaCallbackAsync(string code);
        Task<IEnumerable<StravaGear>> GetStravaGearAsync(int userId);
        Task<string> GetFreshAccessTokenAsync(int userId);
    }
}