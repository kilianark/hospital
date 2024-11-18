using System.ComponentModel.DataAnnotations;
using ApiHospital.Interfaces;

namespace ApiHospital.Models
{
    public class Hospital : ISoftDelete
    {
        [Key]
        public required int HospitalCode { get; set; }
        public required string HospitalName { get; set; }

        public bool IsDeleted { get; set; }

    }
}
