using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ApiHospital.Interfaces;

namespace ApiHospital.Models
{
    public class Move : ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public int Patient_id { get; set; }
        public required int Hospital_codeO { get; set; }
        public required int Hospital_codeD { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;

        public bool IsDeleted { get; set; }
    }
}
