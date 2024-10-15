namespace hospitalDTO.DTOapi {
    public class PatientDTO {
        public required int PatientCode {get; set;}
        public required string Name { get; set; }
        public required string Surname1 { get; set; }
        public string? Surname2 { get; set; }
        public required string Dni { get; set; }
        public required DateTime BirthDate { get; set; }
        public required string Country { get; set; }
        public string? Address {get; set;}
        public required string Phone {get; set; }
        public required string Email {get; set;}
        public required string CIP {get; set;}
        public required string Gender {get; set;}
        public string? EmergencyContact { get; set; }
        public required string Zone { get; set; }
        public int? ReasonId { get; set; }
        public int? BedId { get; set; }
        public int? RoomId { get; set; }
    }
}