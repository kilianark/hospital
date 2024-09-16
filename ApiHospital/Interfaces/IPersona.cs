using System.ComponentModel.DataAnnotations;

namespace ApiHospital.Interfaces;
public interface IPersona {
    public int Id { get; set; }
    public string Dni { get; set; }
    public string Name { get; set; }
    public string Surname1 { get; set; }
    public string? Surname2 { get; set; }
    public DateOnly BirthDate { get; set; }
    public string Country { get; set; }
    public string? Adress {get; set;}
    public string Phone {get; set; }
    public string Email {get; set;}
    public string CIP {get; set;}
    public string Sex {get; set;}
}