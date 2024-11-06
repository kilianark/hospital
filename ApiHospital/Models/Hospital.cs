using System.ComponentModel.DataAnnotations;

namespace ApiHospital.Models
{
    public class Hospital
    {
        [Key]
        public required int HospitalCode { get; set; }
        public required string HospitalName { get; set; }

    }
}
