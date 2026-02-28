using System.Threading.Tasks;
using App.Data;
using App.Models;
using Microsoft.EntityFrameworkCore;

namespace App.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> LoginAsync(string stravaId, string accessToken)
        {
            var user = await _context.Benutzer.FirstOrDefaultAsync(u => u.StravaId == stravaId);
            if (user == null)
            {
                user = new User { StravaId = stravaId, AccessToken = accessToken };
                _context.Benutzer.Add(user);
            }
            else
            {
                user.AccessToken = accessToken;
            }
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task LogoutAsync(int userId)
        {
            var user = await _context.Benutzer.FindAsync(userId);
            if (user != null)
            {
                _context.Benutzer.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }
}