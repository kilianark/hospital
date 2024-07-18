namespace hospitalDTO.DTOapi {
    public class PatientDTO {
        public int Id { get; set; }
        public string Nif { get; set; }
        public string Name { get; set; }

        public string Surname { get; set; }
        public bool Discharge { get; set; }

        public int? BedId { get; set; }

    }
}