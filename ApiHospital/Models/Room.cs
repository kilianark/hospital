namespace ApiHospital.Models {
    public class Room
    {
        public int Id {get; set;}

        public ICollection<Bed> Beds { get; } = new List<Bed>();
    }
}