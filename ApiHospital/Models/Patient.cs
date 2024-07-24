using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiHospital.Models;

public class Patient
{   
    [Key]
    public int Id { get; set; }
    public required string Nif { get; set; }
    public required string Name { get; set; }

    public required string Surname { get; set; }
    public bool Discharge { get; set; }

    public int? BedId { get; set; }
}