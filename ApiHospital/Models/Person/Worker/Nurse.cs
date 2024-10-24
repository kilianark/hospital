namespace ApiHospital.Models
{
    public class Nurse : Worker
    {
        public required int NurseCode { get; set; }
        public string? Speciality { get; set; }
    }
}