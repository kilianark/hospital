namespace ApiHospital.Models
{
    public class Doctor : Worker
    {
        public  int? DoctorCode { get; set; }
        public string? Speciality { get; set; }
    }
}
