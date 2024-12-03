namespace hospitalDTO.DTOapi {
    public class AppointmentDTO
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Status { get; set; }
        public int? ReasonId {get; set;}
        public bool InUrgencies {get; set;}
    }
}
