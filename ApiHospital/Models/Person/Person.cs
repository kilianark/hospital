using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiHospital.Models
{
    public abstract class Person
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required string Surname1 { get; set; }
        public string? Surname2 { get; set; }
        public required string Dni { get; set; }
        public required DateTime BirthDate { get; set; }
        public required string Country { get; set; }
        public string? Address { get; set; }
        public required string Phone { get; set; }
        public string? Email { get; set; }
        public string? CIP { get; set; }
        public required string Gender { get; set; }
        public required int Hospital { get; set; }
    }
}
