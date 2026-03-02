using App.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace App.Data
{
    public static class AdminUserSeeder
    {
        public static async Task SeedAsync(AppDbContext db, IConfiguration config)
        {
            var email = config["AdminUser:Email"];
            var password = config["AdminUser:Password"];
            var anzeigename = config["AdminUser:Anzeigename"];

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                return;

            var normalizedEmail = email.Trim().ToLowerInvariant();

            var existing = await db.Benutzer
                .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

            if (existing != null)
                return; // already seeded

            var hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 10);

            db.Benutzer.Add(new User
            {
                Email = normalizedEmail,
                PasswordHash = hash,
                Anzeigename = string.IsNullOrWhiteSpace(anzeigename) ? "Admin" : anzeigename.Trim()
            });

            await db.SaveChangesAsync();
        }

        /// <summary>
        /// Removes ghost Benutzer rows with no Email — left over from before
        /// email/password auth was introduced. Safe to run on every startup.
        /// </summary>
        public static async Task CleanupOrphanedUsersAsync(AppDbContext db)
        {
            var orphans = await db.Benutzer
                .Where(u => u.Email == null)
                .ToListAsync();

            if (orphans.Count == 0)
                return;

            db.Benutzer.RemoveRange(orphans);
            await db.SaveChangesAsync();
        }
    }
}
