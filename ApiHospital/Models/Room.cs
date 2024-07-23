using System.ComponentModel.DataAnnotations;

namespace ApiHospital.Models {
    public class Room
    {   
        [Key]
        public int Id {get; set;}


        public ICollection<Bed> Beds { get; } = new List<Bed>();
    }
}