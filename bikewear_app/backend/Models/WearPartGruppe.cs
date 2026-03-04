using System.ComponentModel.DataAnnotations;

namespace App.Models
{
    public class WearPartGruppe
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int RadId { get; set; }
    }
}
