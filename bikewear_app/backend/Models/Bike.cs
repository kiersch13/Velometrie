using System;
using System.ComponentModel.DataAnnotations;

namespace App.Models
{
    public enum BikeCategory
    {
        Rennrad,
        Gravel,
        Mountainbike
    }

    public class Bike
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public BikeCategory Kategorie { get; set; }
        public int Kilometerstand { get; set; }

        /// <summary>Gesamte Fahrstunden (Moving Time) von Strava in Stunden.</summary>
        public double Fahrstunden { get; set; }

        public string? StravaId { get; set; }

        /// <summary>The ID of the user who owns this bike.</summary>
        [Required]
        public int UserId { get; set; }

        /// <summary>Kumulative Indoor-Kilometer (VirtualRide / Trainer).</summary>
        public int IndoorKilometerstand { get; set; }

        // ── Bike Fit ──────────────────────────────────────────────────────

        /// <summary>Sattelhöhe in mm (Mitte Tretlager bis Oberkante Sattel).</summary>
        public double? Sattelhoehe { get; set; }

        /// <summary>Sattelversatz (Setback) in mm.</summary>
        public double? Sattelversatz { get; set; }

        /// <summary>Vorbaulänge in mm.</summary>
        public int? Vorbaulaenge { get; set; }

        /// <summary>Vorbauwinkel in Grad.</summary>
        public double? Vorbauwinkel { get; set; }

        /// <summary>Kurbellänge in mm (z.B. 170, 172.5, 175).</summary>
        public double? Kurbellaenge { get; set; }

        /// <summary>Lenkerbreite in mm (c-c).</summary>
        public int? Lenkerbreite { get; set; }

        /// <summary>Spacer-Stapelhöhe unter dem Vorbau in mm.</summary>
        public int? Spacer { get; set; }

        /// <summary>Rahmen-Reach in mm.</summary>
        public int? Reach { get; set; }

        /// <summary>Rahmen-Stack in mm.</summary>
        public int? Stack { get; set; }

        /// <summary>Radstand in mm.</summary>
        public int? Radstand { get; set; }
    }
}