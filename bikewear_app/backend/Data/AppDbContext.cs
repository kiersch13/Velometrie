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

            // Unique index on Email (filtered to non-null rows)
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique()
                .HasFilter("[Email] IS NOT NULL");
        }
    }
}