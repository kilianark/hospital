namespace ApiHospital.Models;

public class Patient : Person
{
    public required int PatientCode { get; set; }
    public string? EmergencyContact { get; set; }
    public required string PatientZone { get; set; }
    public string? ReasonId { get; set; }
    public int? BedId { get; set; }
}
