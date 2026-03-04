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
        public DbSet<ServiceEintrag> ServiceEintraege { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<WearPart>()
                .HasOne<Bike>()
                .WithMany()
                .HasForeignKey(w => w.RadId)
                .OnDelete(DeleteBehavior.Cascade);

            // Npgsql 9+ maps DateTime to 'timestamp with time zone' by default, which
            // requires DateTimeKind.Utc. Since the app stores wall-clock dates (no timezone
            // semantics), use 'timestamp without time zone' so plain DateTime works correctly.
            modelBuilder.Entity<WearPart>()
                .Property(w => w.EinbauDatum)
                .HasColumnType("timestamp without time zone");
            modelBuilder.Entity<WearPart>()
                .Property(w => w.AusbauDatum)
                .HasColumnType("timestamp without time zone");

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

            // ServiceEintrag belongs to a WearPart; cascade delete
            modelBuilder.Entity<ServiceEintrag>()
                .HasOne<WearPart>()
                .WithMany()
                .HasForeignKey(s => s.WearPartId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ServiceEintrag>()
                .Property(s => s.Datum)
                .HasColumnType("timestamp without time zone");
        }
    }
}