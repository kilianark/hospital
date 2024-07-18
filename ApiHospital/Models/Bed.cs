namespace ApiHospital.Models
{
    public class Bed
    {
        public int Id { get; set; }
        public int RoomId { get; set; }

        public Patient? Patient { get; set; }
    }
}