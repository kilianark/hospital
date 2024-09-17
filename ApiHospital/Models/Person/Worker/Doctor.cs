namespace ApiHospital.Models;
public class Doctor: Worker{
    public required int DoctorCode {get; set;}
    public string? Speciality { get; set; }
    
}