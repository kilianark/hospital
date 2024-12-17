namespace ApiHospital.Models
{
    public class Doctor : Worker
    {
        public required string DoctorCode { get; set; }
        public string? Speciality { get; set; }
    }
}
