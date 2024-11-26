using ApiHospital.Interfaces;

namespace ApiHospital.Models
{
    public class Appointment : ISoftDelete
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; }
        public bool IsDeleted { get; set; }
    }
}
