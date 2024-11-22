using System.ComponentModel.DataAnnotations;

namespace ApiHospital.Models
{
    public class Bed 
    {
        [Key]
        public required int Id { get; set; }
        public required string BedCode { get; set; }
        public required int RoomId { get; set; }
        public required bool Availability { get; set; }
        public bool IsDeleted { get; set; }
    }
}
