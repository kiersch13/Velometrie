using System;
using System.ComponentModel.DataAnnotations;

namespace App.Models
{
    public enum WearPartCategory
    {
        Reifen,
        Kassette,
        Kettenblatt,
        Kette,
        Sonstiges,
        Federung
    }

    public class WearPart
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int RadId { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public WearPartCategory Kategorie { get; set; }
        public string? Position { get; set; }
        public int EinbauKilometerstand { get; set; }
        public int? AusbauKilometerstand { get; set; }
        public DateTime EinbauDatum { get; set; }
        public DateTime? AusbauDatum { get; set; }

        /// <summary>Fahrstunden des Rades zum Einbauzeitpunkt (nur für Federung relevant).</summary>
        public double? EinbauFahrstunden { get; set; }

        /// <summary>Fahrstunden des Rades zum Ausbauzeitpunkt (nur für Federung relevant).</summary>
        public double? AusbauFahrstunden { get; set; }

        public string? Notizen { get; set; }

        /// <summary>Reifenbreite in Millimetern (nur für Reifen relevant).</summary>
        public int? ReifenBreiteMm { get; set; }

        /// <summary>Reifenbreite in Zoll (nur für Reifen relevant).</summary>
        public double? ReifenBreiteZoll { get; set; }

        /// <summary>Reifenluftdruck in Bar (nur für Reifen relevant).</summary>
        public double? ReifenDruckBar { get; set; }

        /// <summary>Reifenluftdruck in PSI (nur für Reifen relevant).</summary>
        public double? ReifenDruckPsi { get; set; }
    }
}