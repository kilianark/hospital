namespace hospitalDTO.DTOapi {
    public class NurseDTO {
    public required int NurseCode {get; set;}
    public required string Name { get; set; }
    public required string Surname1 { get; set; }
    public string? Surname2 { get; set; }
    public required string Dni { get; set; }
    public required DateTime BirthDate { get; set; }
    public required string Country { get; set; }
    public string? Address {get; set;}
    public required string Phone {get; set; }
    public string? Email {get; set;}
    public string? CIP {get; set;}
    public required string Gender {get; set;}
    public required string Username {get; set;}
    public required string Worktype {get; set;}
    public required string Speciality { get; set; }
    public required string Hospital { get; set; }
    }
}