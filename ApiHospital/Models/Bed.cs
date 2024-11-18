using System.ComponentModel.DataAnnotations;
using ApiHospital.Interfaces;

namespace ApiHospital.Models
{
    public class Bed : ISoftDelete
    {
        [Key]
        public required int Id { get; set; }
        public required string BedCode { get; set; }
        public required int RoomId { get; set; }
        public required bool Availability { get; set; }
        public bool IsDeleted { get; set; }
    }
}
