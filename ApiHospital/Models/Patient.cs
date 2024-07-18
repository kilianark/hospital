namespace ApiHospital.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public required string Nif { get; set; }
        public required string Name { get; set; }

        public required string Surname { get; set; }
        public bool Discharge { get; set; }

        public int? BedId { get; set; }
    }
}