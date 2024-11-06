namespace hospitalDTO.DTOapi {
    public class MoveDTO {
        public int Id { get; set; }
        public int Patient_id { get; set; }
        public required int Hospital_codeO { get; set; }
        public required int Hospital_codeD { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
    }
}