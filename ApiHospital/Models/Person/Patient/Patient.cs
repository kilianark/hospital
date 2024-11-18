using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ApiHospital.Interfaces;

namespace ApiHospital.Models;

public class Patient : Person
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int PatientCode { get; set; }
    public string? EmergencyContact { get; set; }
    public required string Zone { get; set; }
    public int? BedId { get; set; }

}
