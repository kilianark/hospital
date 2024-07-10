namespace ApiHospital.Models
{
    public class Patients
    {
        public int Id { get; set; }
        public string Nif { get; set; }
        public string Name { get; set; }

        public string Surname { get; set; }

        public string? BedId { get; set; }

        public bool Discharge { get; set; }
    }
}