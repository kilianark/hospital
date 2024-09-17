namespace hospitalDTO.DTOapi {
    public class PatientDTO {
    public required int PatientCode {get; set;}
    public required string Dni { get; set; }
    public required string Name { get; set; }
    public required string Surname1 { get; set; }
    public string? Surname2 { get; set; }
    public required DateOnly BirthDate { get; set; }
    public required string Country { get; set; } // caldra afegir també en els DTO, API, Controladors, etc
    public string? Adress {get; set;}
    public required string Phone {get; set; }
    public required string Email {get; set;}
    public required string CIP {get; set;}
    public required string Sex {get; set;}
    public required string Status { get; set; }
    public required string StatusType { get; set; }
    public int? BedId { get; set; }
    }
}