namespace ApiHospital.Models;
public class Patient: Person{
    public required int PatientCode {get; set;}
    public string? EmergencyContact {get; set;}
    public required string Status { get; set; }
    public required string StatusType { get; set; }
    public int? BedId { get; set; }
}