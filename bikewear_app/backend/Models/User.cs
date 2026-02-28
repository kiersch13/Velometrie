using System.ComponentModel.DataAnnotations;

namespace App.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string StravaId { get; set; }
        [Required]
        public string AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public long? TokenExpiresAt { get; set; }
        public string? Vorname { get; set; }
    }
}