namespace ApiHospital.Models
{
    public class Nurse : Worker
    {
        public required string NurseCode { get; set; }
        public string? Speciality { get; set; }
    }
}