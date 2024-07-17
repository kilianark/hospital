namespace hospitalDTO.DTOapi {
    public class PatientDTO {
        public int Id { get; set; }
        public required string Nif { get; set; }
        public required string Name { get; set; }

        public required string Surname { get; set; }
        public bool Discharge { get; set; }

    }
}