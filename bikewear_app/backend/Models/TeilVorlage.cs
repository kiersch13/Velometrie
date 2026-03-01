using System.ComponentModel.DataAnnotations;

namespace App.Models
{
    /// <summary>
    /// Ein Eintrag in der Teilebibliothek – eine bekannte Verschleißteil-Vorlage,
    /// die der Nutzer beim Einbau eines Teils auswählen kann.
    /// </summary>
    public class TeilVorlage
    {
        [Key]
        public int Id { get; set; }

        /// <summary>Lesbarer Name, z. B. "Shimano Ultegra 12s Kette"</summary>
        [Required]
        public string Name { get; set; } = string.Empty;

        /// <summary>Hersteller, z. B. "Shimano", "SRAM", "Continental"</summary>
        [Required]
        public string Hersteller { get; set; } = string.Empty;

        /// <summary>Teilekategorie (Kette, Kassette, Kettenblatt, Reifen, Sonstiges)</summary>
        public WearPartCategory Kategorie { get; set; }

        /// <summary>Produktgruppe / Schaltgruppe, z. B. "Ultegra", "GRX", "Eagle"</summary>
        public string? Gruppe { get; set; }

        /// <summary>Anzahl Gänge – null bei Reifen und kategoriefremden Teilen</summary>
        public int? Geschwindigkeiten { get; set; }

        /// <summary>
        /// Kommagetrennte Liste kompatibler Fahrradkategorien,
        /// z. B. "Rennrad,Gravel" oder "Mountainbike"
        /// </summary>
        [Required]
        public string FahrradKategorien { get; set; } = string.Empty;

        /// <summary>Kurze Produktbeschreibung auf Deutsch</summary>
        public string? Beschreibung { get; set; }
    }
}
