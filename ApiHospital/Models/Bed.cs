using System.ComponentModel.DataAnnotations;

namespace ApiHospital.Models
{
    public class Bed
    {
        [Key]
        public int Id { get; set; }
        public int RoomId { get; set; }

        public Patient? Patient { get; set; }
    }
}