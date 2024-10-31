namespace hospitalDTO.DTOapi {
    public class ConsultationDTO {
        public int Id { get; set; }
        public required int Patient_id  { get; set; }
        public required int Doctor_id { get; set; }
        public int? ReasonId { get; set; }
        public DateTime Date_Request { get; set; } = DateTime.Now;
        public DateTime? Date_Consulta { get; set; }
        public required string Zone { get; set; }
    }
}