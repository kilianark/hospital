namespace ApiHospital.Models
{
    public abstract class Worker : Person
    {
        
        public required string WorkerCode {get; set;}
        public required string? Username { get; set; }
        public required string? Worktype { get; set; }
        public string? Speciality { get; set; }
    }
}
