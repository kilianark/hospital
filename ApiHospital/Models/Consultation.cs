using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ApiHospital.Interfaces;

namespace ApiHospital.Models
{
    public class Consultation : ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public int Patient_id { get; set; }
        public int Doctor_id { get; set; }
        public int? ReasonId { get; set; }
        public DateTime date_request { get; set; } = DateTime.Now;
        public DateTime? date_consulta { get; set; }
        public string Zone { get; set; }
        public bool IsDeleted { get; set; }
    }
}
