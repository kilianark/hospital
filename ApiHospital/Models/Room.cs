using System.ComponentModel.DataAnnotations;

namespace ApiHospital.Models {
    public class Room
    {   
        [Key]
        public int Id {get; set;}
        public int Capacity {get; set;}
        public int RoomNumber {get; set;}
        public string? RoomType { get; set; }
        public bool Disponibility { get; set; }
        public ICollection<Bed> Beds { get; } = new List<Bed>();
    }
}