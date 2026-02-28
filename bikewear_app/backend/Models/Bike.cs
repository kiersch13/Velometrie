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
        public string Name { get; set; }
        public BikeCategory Kategorie { get; set; }
        public int Kilometerstand { get; set; }
        public string StravaId { get; set; }
    }
}