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
        Sonstiges
    }

    public class WearPart
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int RadId { get; set; }
        [Required]
        public string Name { get; set; }
        public WearPartCategory Kategorie { get; set; }
        public int EinbauKilometerstand { get; set; }
        public int? AusbauKilometerstand { get; set; }
        public DateTime EinbauDatum { get; set; }
        public DateTime? AusbauDatum { get; set; }
    }
}