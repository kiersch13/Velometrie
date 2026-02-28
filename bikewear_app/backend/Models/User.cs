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
    }
}