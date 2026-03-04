using System;

namespace App.Models
{
    /// <summary>
    /// Request payload for moving a wear part from one bike to another.
    /// </summary>
    public class MoveWearPartRequest
    {
        public int ZielRadId { get; set; }
        public int AusbauKilometerstand { get; set; }
        public DateTime AusbauDatum { get; set; }
        public int EinbauKilometerstand { get; set; }
        public DateTime EinbauDatum { get; set; }
        public double? AusbauFahrstunden { get; set; }
        public double? EinbauFahrstunden { get; set; }
    }
}
