using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IAuthService
    {
        Task<User> LoginAsync(string stravaId, string accessToken);
        Task LogoutAsync(int userId);
    }
}