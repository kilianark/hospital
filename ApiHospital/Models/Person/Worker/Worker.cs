namespace ApiHospital.Models
{
    public abstract class Worker : Person
    {
        public required string Username { get; set; }
        public required string Worktype { get; set; }
    }
}
