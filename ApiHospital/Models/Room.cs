using System.ComponentModel.DataAnnotations;

namespace ApiHospital.Models
{
    public class Room
    {
        [Key]
        public required int Id { get; set; }
        public required int RoomNumber { get; set; }
        public required int Capacity { get; set; }
        public required string Zone { get; set; } //ambulatorio, hospitalizado.......
        public string? Area { get; set; } //psiquiatría, oncología............
        public required int Floor { get; set; }
        public required bool Availability { get; set; }
        public ICollection<Bed>? Beds { get; set; } = new List<Bed>();
    }
}
