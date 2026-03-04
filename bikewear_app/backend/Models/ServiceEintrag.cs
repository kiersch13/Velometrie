using System;
using System.ComponentModel.DataAnnotations;

namespace App.Models
{
    public enum ServiceTyp
    {
        KleinerService,
        GrosserService
    }

    /// <summary>
    /// Ein Service-Eintrag für ein Federungsteil (Federgabel/Dämpfer).
    /// Speichert wann und welcher Service durchgeführt wurde.
    /// </summary>
    public class ServiceEintrag
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int WearPartId { get; set; }

        public ServiceTyp ServiceTyp { get; set; }

        public DateTime Datum { get; set; }

        /// <summary>Fahrstunden des Rades zum Servicezeitpunkt.</summary>
        public double BeiFahrstunden { get; set; }

        /// <summary>Optionaler Kommentar zum Service.</summary>
        public string? Notizen { get; set; }
    }
}
