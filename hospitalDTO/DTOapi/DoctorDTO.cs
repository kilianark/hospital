namespace hospitalDTO.DTOapi {
    public class DoctorDTO {
    public required int DoctorCode {get; set;}
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
    public required string User {get; set;}
    public required string WorkerType {get; set;}
    public required string Speciality { get; set; }
    }
}