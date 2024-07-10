namespace ApiHospital.Models
{
    public class Beds
    {
        public string Id { get; set; }
        public string RoomId { get; set; }
        public string? PatientId { get; set; }
    }
}