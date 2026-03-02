using Microsoft.EntityFrameworkCore;
using App.Models;

namespace App.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Bike> Rads { get; set; }
        public DbSet<WearPart> Verschleissteile { get; set; }
        public DbSet<User> Benutzer { get; set; }
        public DbSet<TeilVorlage> Teilvorlagen { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<WearPart>()
                .HasOne<Bike>()
                .WithMany()
                .HasForeignKey(w => w.RadId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique index on Email (nullable; multiple NULLs are allowed in PostgreSQL UNIQUE indexes)
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Each bike belongs to a user; deleting a user cascades to their bikes
            modelBuilder.Entity<Bike>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}